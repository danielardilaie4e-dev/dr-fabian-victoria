'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

type BreastModeId = 'augmentation' | 'submuscular' | 'mastopexy' | 'reduction'
type StageId = 'before' | 'after'

const SKIN = '#d79f84'
const SKIN_LIGHT = '#e5b395'
const MARKING_BLUE = '#1747b7'
const MEDICAL_GOLD = '#AA8D57'
const GARMENT = '#7f5b52'

const MODES: Record<
  BreastModeId,
  {
    label: string
    title: string
    before: string
    after: string
    goal: string
    when: string
    evaluation: string
    limits: string
    beforeScale: [number, number, number]
    afterScale: [number, number, number]
    beforeY: number
    afterY: number
    beforeDroop: number
    afterDroop: number
    implantPlane: 'none' | 'subglandular' | 'submuscular'
    showLift: boolean
    showReduction: boolean
  }
> = {
  augmentation: {
    label: 'Aumento',
    title: 'Volumen con lectura de cobertura',
    before: 'La vista inicial muestra menor proyección y permite valorar cobertura de piel y glándula.',
    after: 'La simulación añade volumen de forma gradual, manteniendo surco y proporción del tórax.',
    goal: 'Aumentar volumen y proyección respetando proporción del tórax, cobertura de tejidos y posición del surco.',
    when: 'Se considera cuando se desea restaurar o aumentar volumen y existe tejido suficiente para cubrir el implante.',
    evaluation: 'Se revisan ancho de tórax, base mamaria, grosor de tejidos, asimetrías, surco, piel y antecedentes mamarios.',
    limits: 'La simulación no define tamaño final de implante, cicatriz, sensibilidad ni evolución de los tejidos.',
    beforeScale: [0.19, 0.2, 0.12],
    afterScale: [0.29, 0.31, 0.22],
    beforeY: -0.02,
    afterY: 0.0,
    beforeDroop: 0.05,
    afterDroop: 0.015,
    implantPlane: 'subglandular',
    showLift: false,
    showReduction: false,
  },
  submuscular: {
    label: 'Submuscular',
    title: 'Implante cubierto por pectoral',
    before: 'La vista inicial permite reconocer el pectoral como plano profundo de cobertura.',
    after: 'La simulación ubica el implante detrás del plano muscular para mostrar cobertura parcial.',
    goal: 'Aprovechar la cobertura del pectoral para suavizar el borde superior del implante en pacientes seleccionadas.',
    when: 'Puede considerarse cuando la cobertura de tejido mamario es limitada o se busca transición superior más suave.',
    evaluation: 'Se analizan músculo pectoral, grosor de piel y glándula, actividad física, caja torácica y objetivos de forma.',
    limits: 'El modelo no muestra dolor, movimiento muscular, recuperación ni comportamiento dinámico del implante.',
    beforeScale: [0.19, 0.2, 0.12],
    afterScale: [0.28, 0.3, 0.2],
    beforeY: -0.02,
    afterY: 0.01,
    beforeDroop: 0.05,
    afterDroop: 0.012,
    implantPlane: 'submuscular',
    showLift: false,
    showReduction: false,
  },
  mastopexy: {
    label: 'Mastopexia',
    title: 'Elevación del complejo areola-pezón',
    before: 'La vista inicial muestra descenso del tejido y posición baja del complejo areola-pezón.',
    after: 'La simulación reposiciona el tejido y marca la dirección del levantamiento.',
    goal: 'Elevar la mama, reposicionar areola y pezón, y remodelar el tejido para mejorar forma y simetría.',
    when: 'Se considera cuando la areola está baja, apunta hacia abajo o hay exceso de piel con pérdida de soporte.',
    evaluation: 'Se revisan grado de ptosis, calidad de piel, volumen disponible, tamaño areolar, simetría y cicatrices esperadas.',
    limits: 'La simulación no predice cicatrización, cambios de sensibilidad ni duración del resultado en el tiempo.',
    beforeScale: [0.3, 0.38, 0.21],
    afterScale: [0.26, 0.29, 0.19],
    beforeY: -0.15,
    afterY: 0.06,
    beforeDroop: 0.18,
    afterDroop: 0.025,
    implantPlane: 'none',
    showLift: true,
    showReduction: false,
  },
  reduction: {
    label: 'Reducción',
    title: 'Menos peso y nueva proporción',
    before: 'La vista inicial muestra mayor volumen y predominio de carga en el polo inferior.',
    after: 'La simulación reduce volumen, asciende la areola y conserva una forma proporcional.',
    goal: 'Disminuir peso mamario, elevar el tejido y buscar una proporción más cómoda con el cuerpo.',
    when: 'Se considera por volumen excesivo, incomodidad física, limitación funcional o deseo de una talla más proporcional.',
    evaluation: 'Se valoran síntomas, volumen a retirar, piel, posición de areola, simetría, antecedentes y expectativas de cicatriz.',
    limits: 'El modelo no reemplaza mediciones clínicas ni define la cantidad exacta de tejido a retirar.',
    beforeScale: [0.36, 0.43, 0.26],
    afterScale: [0.26, 0.3, 0.19],
    beforeY: -0.16,
    afterY: 0.02,
    beforeDroop: 0.22,
    afterDroop: 0.04,
    implantPlane: 'none',
    showLift: true,
    showReduction: true,
  },
}

const modeOrder: BreastModeId[] = ['augmentation', 'submuscular', 'mastopexy', 'reduction']

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-((value - center) ** 2) / (2 * width ** 2))
}

function createUpperTorsoGeometry() {
  const rings = 112
  const segments = 132
  const yMin = -1.02
  const yMax = 0.84
  const vertices: number[] = []
  const indices: number[] = []

  for (let iy = 0; iy <= rings; iy += 1) {
    const y = yMin + (yMax - yMin) * (iy / rings)
    const shoulder = gaussian(y, 0.62, 0.22)
    const upperChest = gaussian(y, 0.32, 0.34)
    const rib = gaussian(y, -0.08, 0.48)
    const waist = gaussian(y, -0.82, 0.24)
    const halfWidth = 0.25 + shoulder * 0.47 + upperChest * 0.2 + rib * 0.1 - waist * 0.09
    const frontDepth = 0.12 + upperChest * 0.13 + rib * 0.08
    const backDepth = 0.1 + upperChest * 0.05 + rib * 0.05

    for (let ix = 0; ix <= segments; ix += 1) {
      const theta = (ix / segments) * Math.PI * 2
      const sin = Math.sin(theta)
      const cos = Math.cos(theta)
      const side = Math.abs(sin)
      const front = Math.max(0, cos)
      const x = sin * halfWidth * (1 - front * 0.07)
      const z = cos * (front > 0 ? frontDepth : backDepth) * (1 + side * 0.04)
      vertices.push(x, y, z)
    }
  }

  for (let iy = 0; iy < rings; iy += 1) {
    for (let ix = 0; ix < segments; ix += 1) {
      const a = iy * (segments + 1) + ix
      const b = a + segments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function createBreastGeometry(scale: [number, number, number], droop: number) {
  const rings = 72
  const segments = 96
  const vertices: number[] = []
  const indices: number[] = []

  for (let iy = 0; iy <= rings; iy += 1) {
    const v = iy / rings
    const phi = v * Math.PI
    for (let ix = 0; ix <= segments; ix += 1) {
      const u = ix / segments
      const theta = u * Math.PI * 2
      const sx = Math.sin(phi) * Math.cos(theta)
      const sy = Math.cos(phi)
      const sz = Math.sin(phi) * Math.sin(theta)
      const lowerPole = Math.max(0, -sy)
      const upperPole = Math.max(0, sy)
      const medial = Math.max(0, Math.cos(theta))
      const teardrop = 1 + lowerPole * droop * 1.45 - upperPole * droop * 0.3
      const naturalFlatten = 1 - upperPole * 0.08 - medial * 0.02
      const x = sx * scale[0] * naturalFlatten
      const y = sy * scale[1] * teardrop - lowerPole * droop * 0.1
      const z = Math.abs(sz) * scale[2] * (1 + lowerPole * droop * 0.72)
      vertices.push(x, y, z)
    }
  }

  for (let iy = 0; iy < rings; iy += 1) {
    for (let ix = 0; ix < segments; ix += 1) {
      const a = iy * (segments + 1) + ix
      const b = a + segments + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function UpperTorso() {
  const geometry = useMemo(() => createUpperTorsoGeometry(), [])

  return (
    <group>
      <mesh geometry={geometry} position={[0, -0.04, -0.04]} castShadow receiveShadow>
        <meshPhysicalMaterial color={SKIN} roughness={0.82} transparent opacity={0.78} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.94, 0]} scale={[0.12, 0.22, 0.12]}>
        <capsuleGeometry args={[0.55, 0.52, 36, 56]} />
        <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.82} transparent opacity={0.72} depthWrite={false} />
      </mesh>

      <mesh position={[0, 1.2, 0.02]} scale={[0.17, 0.22, 0.15]}>
        <sphereGeometry args={[1, 60, 40]} />
        <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.82} transparent opacity={0.68} depthWrite={false} />
      </mesh>

      {[-0.74, 0.74].map((x) => (
        <mesh key={x} position={[x, 0.14, 0.0]} rotation={[0.04, 0, x > 0 ? -0.18 : 0.18]} scale={[0.07, 0.48, 0.07]}>
          <capsuleGeometry args={[1, 1.05, 36, 56]} />
          <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.84} transparent opacity={0.58} depthWrite={false} />
        </mesh>
      ))}

      <Line
        points={[
          [-0.6, 0.32, 0.33],
          [-0.3, 0.44, 0.43],
          [0, 0.48, 0.47],
          [0.3, 0.44, 0.43],
          [0.6, 0.32, 0.33],
        ]}
        color="#f3d1b3"
        transparent
        opacity={0.5}
        lineWidth={2}
      />
    </group>
  )
}

function BreastPair({ mode, stage }: { mode: (typeof MODES)[BreastModeId]; stage: StageId }) {
  const scale = stage === 'after' ? mode.afterScale : mode.beforeScale
  const y = stage === 'after' ? mode.afterY : mode.beforeY
  const droop = stage === 'after' ? mode.afterDroop : mode.beforeDroop
  const geometry = useMemo(() => createBreastGeometry(scale, droop), [scale, droop])
  const beforeGeometry = useMemo(() => createBreastGeometry(mode.beforeScale, mode.beforeDroop), [mode.beforeScale, mode.beforeDroop])

  return (
    <group>
      {stage === 'after' && (
        <>
          {[-0.28, 0.28].map((x) => (
            <mesh key={`before-${x}`} geometry={beforeGeometry} position={[x, mode.beforeY, 0.39]}>
              <meshStandardMaterial color="#f3c2a0" roughness={0.76} transparent opacity={0.14} wireframe depthWrite={false} />
            </mesh>
          ))}
        </>
      )}

      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, y, 0.39]}>
          <mesh geometry={geometry} castShadow receiveShadow>
            <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.76} transparent opacity={0.82} depthWrite={false} />
          </mesh>
          <mesh position={[0, -scale[1] * (0.12 + droop * 0.78), scale[2] * 0.93]} scale={[0.049, 0.038, 0.01]}>
            <sphereGeometry args={[1, 44, 24]} />
            <meshStandardMaterial color="#9f5f4f" roughness={0.66} transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ImplantPair({ plane }: { plane: 'none' | 'subglandular' | 'submuscular' }) {
  if (plane === 'none') return null

  const z = plane === 'submuscular' ? 0.255 : 0.345
  const y = plane === 'submuscular' ? -0.045 : -0.02
  const opacity = plane === 'submuscular' ? 0.38 : 0.55

  return (
    <group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, y, z]} scale={[0.22, 0.25, 0.13]}>
          <sphereGeometry args={[1, 72, 42]} />
          <meshPhysicalMaterial color="#dfeaf0" roughness={0.2} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function PectoralPlane({ active }: { active: boolean }) {
  return (
    <group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.07, 0.24]} rotation={[0.08, x > 0 ? -0.12 : 0.12, 0]} scale={[0.34, 0.37, 0.04]}>
          <sphereGeometry args={[1, 72, 36]} />
          <meshStandardMaterial color="#b9635c" roughness={0.84} transparent opacity={active ? 0.46 : 0.18} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function SurgicalGarment() {
  const topShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.62, -0.48)
    s.bezierCurveTo(-0.38, -0.56, -0.18, -0.58, 0, -0.56)
    s.bezierCurveTo(0.18, -0.58, 0.38, -0.56, 0.62, -0.48)
    s.lineTo(0.52, -0.64)
    s.bezierCurveTo(0.2, -0.54, -0.2, -0.54, -0.52, -0.64)
    s.closePath()
    return s
  }, [])

  return (
    <group>
      <mesh position={[0, 0.01, 0.61]}>
        <shapeGeometry args={[topShape]} />
        <meshStandardMaterial color={GARMENT} roughness={0.76} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <Line
        points={[
          [-0.6, -0.42, 0.58],
          [-0.32, -0.49, 0.64],
          [0, -0.5, 0.67],
          [0.32, -0.49, 0.64],
          [0.6, -0.42, 0.58],
        ]}
        color="#f5d5bf"
        transparent
        opacity={0.5}
        lineWidth={2}
      />
    </group>
  )
}

function SurgicalMarkings({ mode }: { mode: (typeof MODES)[BreastModeId] }) {
  return (
    <group>
      {[-0.28, 0.28].map((x) => (
        <group key={x}>
          <Line
            points={[
              [x - 0.21, -0.08, 0.64],
              [x - 0.15, 0.14, 0.69],
              [x, 0.25, 0.73],
              [x + 0.15, 0.14, 0.69],
              [x + 0.21, -0.08, 0.64],
            ]}
            color={MARKING_BLUE}
            transparent
            opacity={0.84}
            lineWidth={2}
          />
          {mode.showLift && (
            <Line
              points={[
                [x, -0.28, 0.76],
                [x, 0.22, 0.76],
              ]}
              color={MARKING_BLUE}
              transparent
              opacity={0.9}
              lineWidth={2}
            />
          )}
        </group>
      ))}

      {mode.showReduction && (
        <Line
          points={[
            [-0.5, -0.1, 0.72],
            [-0.28, -0.32, 0.78],
            [0, -0.2, 0.82],
            [0.28, -0.32, 0.78],
            [0.5, -0.1, 0.72],
          ]}
          color="#d24b4b"
          transparent
          opacity={0.75}
          lineWidth={2}
        />
      )}

      <Line
        points={[
          [0, 0.46, 0.48],
          [0, -0.72, 0.58],
        ]}
        color="#f5d5bf"
        transparent
        opacity={0.34}
        lineWidth={1}
      />
    </group>
  )
}

function BreastModel({ modeId, stage, modelScale }: { modeId: BreastModeId; stage: StageId; modelScale: number }) {
  const mode = MODES[modeId]

  return (
    <group position={[0, 0.12, 0]} scale={modelScale} rotation={[0, -0.05, 0]}>
      <UpperTorso />
      <PectoralPlane active={mode.implantPlane === 'submuscular'} />
      {stage === 'after' && <ImplantPair plane={mode.implantPlane} />}
      <BreastPair mode={mode} stage={stage} />
      <SurgicalMarkings mode={mode} />
      <SurgicalGarment />
    </group>
  )
}

function BreastScene({ modeId, stage }: { modeId: BreastModeId; stage: StageId }) {
  const { viewport } = useThree()
  const modelScale = viewport.aspect < 1 ? 0.76 : 0.94

  return <BreastModel modeId={modeId} stage={stage} modelScale={modelScale} />
}

export function BreastHarmonyViewer() {
  const [modeId, setModeId] = useState<BreastModeId>('submuscular')
  const [stage, setStage] = useState<StageId>('after')
  const mode = MODES[modeId]

  return (
    <article className="overflow-hidden rounded-lg border border-secondary/20 bg-[#111111]/80 shadow-2xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
        <div className="relative min-h-[530px] bg-[radial-gradient(circle_at_50%_48%,rgba(30,64,175,0.16),rgba(17,17,17,0)_56%)]">
          <Canvas camera={{ position: [0, 0.03, 3.85], fov: 32 }} dpr={[1, 1.7]} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.66} />
              <directionalLight position={[3.2, 4, 4]} intensity={1.1} />
              <directionalLight position={[-3, 1.2, -2]} intensity={0.34} />
              <Center position={[0, 0.1, 0]}>
                <BreastScene modeId={modeId} stage={stage} />
              </Center>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.42}
                maxPolarAngle={Math.PI / 1.73}
                minAzimuthAngle={-0.5}
                maxAzimuthAngle={0.5}
                autoRotate
                autoRotateSpeed={0.09}
              />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-neutral-light backdrop-blur">
            Modelo humano anatómico interactivo
          </div>
        </div>

        <div className="border-t border-secondary/15 p-5 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Armonía mamaria</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-white">{mode.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral">
            Modelo educativo con torso, pectoral, surco, implante y tejido mamario para explicar la decisión quirúrgica sin vender fantasías de catálogo, que bastante daño hace eso.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-light">Procedimiento</p>
            <div className="flex flex-wrap gap-2">
              {modeOrder.map((id) => (
                <button
                  key={id}
                  onClick={() => setModeId(id)}
                  className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    modeId === id
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-white/10 bg-white/5 text-neutral-light hover:border-secondary/50'
                  }`}
                >
                  {MODES[id].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-light">Vista</p>
            <div className="inline-flex rounded-md border border-white/10 bg-white/5 p-1">
              {(['before', 'after'] as StageId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setStage(id)}
                  className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                    stage === id ? 'bg-secondary text-white' : 'text-neutral-light hover:text-white'
                  }`}
                >
                  {id === 'before' ? 'Antes' : 'Simulación'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-neutral">
            <p><span className="font-semibold text-white">Lectura:</span> {stage === 'before' ? mode.before : mode.after}</p>
            <p><span className="font-semibold text-white">Objetivo:</span> {mode.goal}</p>
            <p><span className="font-semibold text-white">Evaluación:</span> {mode.evaluation}</p>
            <p><span className="font-semibold text-white">Límite:</span> {mode.limits}</p>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-md border border-secondary/20 bg-secondary/10 p-3 text-xs leading-relaxed text-neutral-light">
            <span className="h-3 w-3 rounded-full bg-[#AA8D57]" />
            Simulación anatómica orientativa. El tamaño, plano, cicatriz y técnica se definen únicamente con valoración médica.
          </div>
        </div>
      </div>
    </article>
  )
}
