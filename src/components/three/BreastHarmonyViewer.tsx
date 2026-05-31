'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

type BreastModeId = 'augmentation' | 'submuscular' | 'mastopexy' | 'reduction'
type StageId = 'before' | 'after'

const SKIN = '#c98f72'
const SKIN_LIGHT = '#e2ad8c'

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
    implantPlane: 'none' | 'subglandular' | 'submuscular'
    showLift: boolean
    showReduction: boolean
  }
> = {
  augmentation: {
    label: 'Aumento',
    title: 'Volumen con lectura de cobertura',
    before: 'La vista inicial muestra menor proyección y permite valorar cobertura de piel y glándula.',
    after: 'La proyección añade volumen de forma gradual, manteniendo el surco como referencia anatómica.',
    goal: 'Aumentar volumen y proyección respetando proporción del tórax, cobertura de tejidos y posición del surco.',
    when: 'Se considera cuando se desea restaurar o aumentar volumen y existe suficiente tejido para cubrir el implante.',
    evaluation: 'Se revisan ancho de tórax, base mamaria, grosor de tejidos, asimetrías, surco, piel y antecedentes mamarios.',
    limits: 'La simulación no define tamaño final de implante, cicatriz, sensibilidad ni evolución de los tejidos.',
    beforeScale: [0.2, 0.22, 0.14],
    afterScale: [0.28, 0.31, 0.21],
    beforeY: -0.05,
    afterY: -0.03,
    implantPlane: 'subglandular',
    showLift: false,
    showReduction: false,
  },
  submuscular: {
    label: 'Submuscular',
    title: 'Implante cubierto por pectoral',
    before: 'La vista inicial permite reconocer el pectoral como plano profundo de cobertura.',
    after: 'La proyección ubica el implante detrás del plano muscular para mostrar cobertura parcial.',
    goal: 'Aprovechar la cobertura del pectoral para suavizar el borde superior del implante en pacientes seleccionadas.',
    when: 'Puede considerarse cuando la cobertura de tejido mamario es limitada o se busca una transición superior más suave.',
    evaluation: 'Se analizan músculo pectoral, grosor de piel y glándula, actividad física, caja torácica y objetivos de forma.',
    limits: 'El modelo no muestra dolor, movimiento muscular, recuperación ni el comportamiento dinámico del implante.',
    beforeScale: [0.2, 0.22, 0.14],
    afterScale: [0.27, 0.3, 0.2],
    beforeY: -0.04,
    afterY: -0.02,
    implantPlane: 'submuscular',
    showLift: false,
    showReduction: false,
  },
  mastopexy: {
    label: 'Mastopexia',
    title: 'Elevación del complejo areola-pezón',
    before: 'La vista inicial muestra descenso del tejido y posición baja del complejo areola-pezón.',
    after: 'La proyección reposiciona el tejido y marca la dirección del levantamiento.',
    goal: 'Elevar la mama, reposicionar areola y pezón, y remodelar el tejido para mejorar forma y simetría.',
    when: 'Se considera cuando la areola está baja, apunta hacia abajo o hay exceso de piel con pérdida de soporte.',
    evaluation: 'Se revisan grado de ptosis, calidad de piel, volumen disponible, tamaño areolar, simetría y cicatrices esperadas.',
    limits: 'La proyección no predice cicatrización, cambios de sensibilidad ni duración del resultado en el tiempo.',
    beforeScale: [0.3, 0.34, 0.21],
    afterScale: [0.27, 0.31, 0.2],
    beforeY: -0.14,
    afterY: 0.04,
    implantPlane: 'none',
    showLift: true,
    showReduction: false,
  },
  reduction: {
    label: 'Reducción',
    title: 'Menos peso y nueva proporción',
    before: 'La vista inicial muestra mayor volumen y predominio de carga en el polo inferior.',
    after: 'La proyección reduce volumen, asciende la areola y conserva una forma proporcional.',
    goal: 'Disminuir peso mamario, elevar el tejido y buscar una proporción más cómoda con el cuerpo.',
    when: 'Se considera por volumen excesivo, incomodidad física, limitación funcional o deseo de una talla más proporcional.',
    evaluation: 'Se valoran síntomas, volumen a retirar, piel, posición de areola, simetría, antecedentes y expectativas de cicatriz.',
    limits: 'El modelo no reemplaza mediciones clínicas ni define la cantidad exacta de tejido a retirar.',
    beforeScale: [0.34, 0.38, 0.24],
    afterScale: [0.27, 0.31, 0.19],
    beforeY: -0.13,
    afterY: 0.0,
    implantPlane: 'none',
    showLift: true,
    showReduction: true,
  },
}

const modeOrder: BreastModeId[] = ['augmentation', 'submuscular', 'mastopexy', 'reduction']

function smoothLatheProfile(points: [number, number][], segments = 96) {
  return new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(segments)
}

function BustSurface() {
  const geometry = useMemo(() => {
    const torsoProfile: [number, number][] = [
      [0.0, -1.04],
      [0.2, -1.0],
      [0.32, -0.76],
      [0.34, -0.4],
      [0.4, -0.08],
      [0.52, 0.28],
      [0.62, 0.62],
      [0.36, 0.78],
      [0.12, 0.83],
      [0.0, 0.83],
    ]
    const lathe = new THREE.LatheGeometry(smoothLatheProfile(torsoProfile), 128)
    lathe.computeVertexNormals()
    return lathe
  }, [])

  return (
    <group>
      <mesh geometry={geometry} position={[0, -0.02, -0.03]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={SKIN}
          roughness={0.78}
          clearcoat={0.06}
          sheen={0.16}
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.02, 0]} scale={[0.13, 0.24, 0.12]}>
        <capsuleGeometry args={[0.55, 0.48, 32, 52]} />
        <meshPhysicalMaterial color={SKIN} roughness={0.82} transparent opacity={0.62} depthWrite={false} />
      </mesh>
      <Line
        points={[
          [-0.58, 0.38, 0.35],
          [-0.28, 0.48, 0.44],
          [0, 0.51, 0.48],
          [0.28, 0.48, 0.44],
          [0.58, 0.38, 0.35],
        ]}
        color="#f4d6bc"
        transparent
        opacity={0.42}
        lineWidth={1.4}
      />
    </group>
  )
}

function BreastPair({
  mode,
  stage,
}: {
  mode: (typeof MODES)[BreastModeId]
  stage: StageId
}) {
  const scale = stage === 'after' ? mode.afterScale : mode.beforeScale
  const y = stage === 'after' ? mode.afterY : mode.beforeY

  return (
    <group>
      {stage === 'after' &&
        [-0.28, 0.28].map((x) => (
          <mesh key={`before-${x}`} position={[x, mode.beforeY, 0.43]} scale={mode.beforeScale}>
            <sphereGeometry args={[1, 80, 48]} />
            <meshStandardMaterial color="#f4d6bc" roughness={0.78} transparent opacity={0.18} wireframe depthWrite={false} />
          </mesh>
        ))}

      {[-0.28, 0.28].map((x) => (
        <group key={x} position={[x, y, 0.43]}>
          <mesh scale={scale} castShadow receiveShadow>
            <sphereGeometry args={[1, 96, 56]} />
            <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.75} transparent opacity={0.72} depthWrite={false} />
          </mesh>
          <mesh position={[0, -scale[1] * 0.1, scale[2] * 0.98]} scale={[0.042, 0.032, 0.008]}>
            <sphereGeometry args={[1, 36, 18]} />
            <meshStandardMaterial color="#9a5e54" roughness={0.72} transparent opacity={0.68} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ImplantPair({ plane }: { plane: 'none' | 'subglandular' | 'submuscular' }) {
  if (plane === 'none') return null

  const z = plane === 'submuscular' ? 0.27 : 0.36
  const y = plane === 'submuscular' ? -0.05 : -0.03
  const opacity = plane === 'submuscular' ? 0.34 : 0.52

  return (
    <group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, y, z]} scale={[0.21, 0.24, 0.12]}>
          <sphereGeometry args={[1, 72, 42]} />
          <meshPhysicalMaterial color="#dce8ed" roughness={0.22} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function PectoralPlane({ active }: { active: boolean }) {
  return (
    <group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} position={[x, 0.08, 0.25]} rotation={[0.08, x > 0 ? -0.12 : 0.12, 0]} scale={[0.33, 0.36, 0.04]}>
          <sphereGeometry args={[1, 72, 36]} />
          <meshStandardMaterial color="#b8645c" roughness={0.84} transparent opacity={active ? 0.45 : 0.18} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function BreastGuides({ mode, stage }: { mode: (typeof MODES)[BreastModeId]; stage: StageId }) {
  return (
    <group>
      <Line
        points={[
          [-0.62, -0.35, 0.54],
          [-0.34, -0.41, 0.6],
          [0, -0.42, 0.62],
          [0.34, -0.41, 0.6],
          [0.62, -0.35, 0.54],
        ]}
        color="#f4d6bc"
        transparent
        opacity={0.5}
        lineWidth={1.5}
      />
      <Line
        points={[
          [0, 0.47, 0.5],
          [0, -0.74, 0.6],
        ]}
        color="#f4d6bc"
        transparent
        opacity={0.24}
        lineWidth={1}
      />
      {mode.showLift && stage === 'after' && (
        <>
          <Line points={[[-0.28, -0.25, 0.72], [-0.28, 0.18, 0.72]]} color="#d8b65f" transparent opacity={0.72} lineWidth={1.8} />
          <Line points={[[0.28, -0.25, 0.72], [0.28, 0.18, 0.72]]} color="#d8b65f" transparent opacity={0.72} lineWidth={1.8} />
        </>
      )}
      {mode.showReduction && stage === 'after' && (
        <Line
          points={[
            [-0.48, -0.08, 0.7],
            [-0.28, -0.25, 0.76],
            [0, -0.16, 0.8],
            [0.28, -0.25, 0.76],
            [0.48, -0.08, 0.7],
          ]}
          color="#d97864"
          transparent
          opacity={0.56}
          lineWidth={1.4}
        />
      )}
    </group>
  )
}

function BreastModel({
  modeId,
  stage,
  modelScale,
}: {
  modeId: BreastModeId
  stage: StageId
  modelScale: number
}) {
  const mode = MODES[modeId]

  return (
    <group position={[0, 0.04, 0]} scale={modelScale}>
      <BustSurface />
      <PectoralPlane active={mode.implantPlane === 'submuscular'} />
      {stage === 'after' && <ImplantPair plane={mode.implantPlane} />}
      <BreastPair mode={mode} stage={stage} />
      <BreastGuides mode={mode} stage={stage} />
    </group>
  )
}

function BreastScene({ modeId, stage }: { modeId: BreastModeId; stage: StageId }) {
  const { viewport } = useThree()
  const modelScale = viewport.aspect < 1 ? 0.76 : 0.86

  return <BreastModel modeId={modeId} stage={stage} modelScale={modelScale} />
}

export function BreastHarmonyViewer() {
  const [modeId, setModeId] = useState<BreastModeId>('submuscular')
  const [stage, setStage] = useState<StageId>('after')
  const mode = MODES[modeId]

  return (
    <article className="overflow-hidden rounded-lg border border-secondary/20 bg-[#111111]/95 shadow-2xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
        <div className="relative min-h-[520px] bg-[radial-gradient(circle_at_50%_48%,rgba(216,182,95,0.13),rgba(17,17,17,0)_58%)]">
          <Canvas camera={{ position: [0, 0.03, 4.65], fov: 31 }} dpr={[1, 1.7]} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.66} />
              <directionalLight position={[3.2, 4, 4]} intensity={1.1} />
              <directionalLight position={[-3, 1.2, -2]} intensity={0.34} />
              <Center position={[0, 0.2, 0]}>
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
                autoRotateSpeed={0.1}
              />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-neutral-light backdrop-blur">
            Vista anatómica interactiva
          </div>
        </div>

        <div className="border-t border-secondary/15 p-5 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Armonía mamaria</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-white">{mode.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral">
            El modelo permite revisar volumen, cobertura, surco y posición de la areola con una lectura anatómica clara.
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

          <div className="mt-5 grid gap-3">
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Qué se busca</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{mode.goal}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Cuándo se considera</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{mode.when}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Qué se evalúa</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{mode.evaluation}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Lectura del modelo</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">
                {stage === 'before' ? mode.before : mode.after} {mode.limits}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
