'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

type ProcedureId = 'lipo' | 'abdomen' | 'waist' | 'thighs'
type StageId = 'before' | 'after'

const SKIN = '#d79f84'
const SKIN_SOFT = '#e1ad91'
const GARMENT = '#7f5b52'
const MARKING_BLUE = '#1747b7'
const MEDICAL_GOLD = '#AA8D57'

const PROCEDURES: Record<
  ProcedureId,
  {
    label: string
    title: string
    before: string
    after: string
    goal: string
    when: string
    evaluation: string
    limits: string
    color: string
  }
> = {
  lipo: {
    label: 'Lipoescultura',
    title: 'De volumen localizado a transición anatómica',
    before: 'La vista inicial muestra plenitud moderada en abdomen bajo, flancos y espalda baja.',
    after: 'La simulación enseña una transición más limpia entre abdomen, cintura, cadera y espalda.',
    goal: 'Remodelar depósitos localizados de grasa y mejorar continuidad del contorno; no sustituye pérdida de peso.',
    when: 'Se considera en pacientes con peso estable, grasa localizada persistente y piel con retracción razonable.',
    evaluation: 'Se revisan grosor de grasa, calidad de piel, asimetrías, cicatrices, tono muscular y antecedentes médicos.',
    limits: 'El modelo no predice textura de piel, fibrosis, inflamación, edema ni cambios propios de la recuperación.',
    color: '#e7c044',
  },
  abdomen: {
    label: 'Abdominoplastia',
    title: 'Piel, ombligo y pared abdominal',
    before: 'La vista inicial resalta piel inferior redundante, abdomen proyectado y menor definición del ombligo.',
    after: 'La simulación muestra un abdomen más plano, ombligo reposicionado y cierre bajo de referencia.',
    goal: 'Retirar piel sobrante, mejorar tensión abdominal y tratar pared muscular si existe separación o debilidad.',
    when: 'Suele considerarse tras embarazos, pérdida importante de peso o flacidez que no mejora con ejercicio.',
    evaluation: 'Se valoran piel excedente, ombligo, diástasis, hernias, cicatrices, seguridad anestésica y expectativas.',
    limits: 'La cicatriz, posición final del ombligo y tensión dependen de anatomía y valoración presencial.',
    color: '#d97864',
  },
  waist: {
    label: 'Cintura',
    title: 'Contorno 360 y flancos',
    before: 'La vista inicial muestra cómo flancos y espalda baja pueden hacer que el contorno lateral se vea recto.',
    after: 'La simulación marca una cintura más continua entre espalda, abdomen y cadera.',
    goal: 'Mejorar la transición entre abdomen, espalda baja y cadera para una silueta más armónica.',
    when: 'Se considera cuando los flancos dominan el contorno y hay buen soporte de tejidos.',
    evaluation: 'Se revisan proporciones óseas, distribución de grasa, elasticidad, postura y balance con cadera y glúteos.',
    limits: 'La cintura posible está limitada por costillas, pelvis, musculatura y calidad de piel.',
    color: '#e8bf5f',
  },
  thighs: {
    label: 'Muslos',
    title: 'Transición cadera-muslo',
    before: 'La vista inicial muestra volumen lateral en muslo superior y transición pesada desde la cadera.',
    after: 'La simulación suaviza la transición lateral conservando proporción y soporte.',
    goal: 'Afinar depósitos localizados y mejorar continuidad visual entre cadera, muslo y rodilla.',
    when: 'Se considera cuando hay zonas focales de volumen y no predominan flacidez severa o problemas circulatorios.',
    evaluation: 'Se revisan simetría, drenaje, calidad de piel, celulitis, laxitud y relación con la cadera.',
    limits: 'El modelo no representa celulitis, edema, irregularidades de piel ni tiempos de recuperación.',
    color: '#e7c97e',
  },
}

const procedureOrder: ProcedureId[] = ['lipo', 'abdomen', 'waist', 'thighs']

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-((value - center) ** 2) / (2 * width ** 2))
}

function createTorsoGeometry(procedure: ProcedureId, stage: StageId) {
  const rings = 148
  const segments = 144
  const yMin = -1.18
  const yMax = 1.08
  const vertices: number[] = []
  const indices: number[] = []
  const uvs: number[] = []
  const after = stage === 'after'

  for (let iy = 0; iy <= rings; iy += 1) {
    const v = iy / rings
    const y = yMin + (yMax - yMin) * v

    const shoulder = gaussian(y, 0.9, 0.22)
    const chest = gaussian(y, 0.52, 0.35)
    const rib = gaussian(y, 0.12, 0.42)
    const waist = gaussian(y, -0.28, 0.26)
    const abdomen = gaussian(y, -0.28, 0.38)
    const pelvis = gaussian(y, -0.84, 0.28)
    const groinTaper = gaussian(y, -1.16, 0.16)

    let halfWidth = 0.23 + shoulder * 0.34 + chest * 0.2 + pelvis * 0.34 - waist * 0.12 - groinTaper * 0.13
    let frontDepth = 0.16 + chest * 0.11 + rib * 0.07 + abdomen * 0.17 + pelvis * 0.06
    let backDepth = 0.13 + chest * 0.06 + rib * 0.05 + pelvis * 0.14

    if (stage === 'before') {
      if (procedure === 'lipo') {
        frontDepth += abdomen * 0.09
        halfWidth += waist * 0.07 + pelvis * 0.025
        backDepth += waist * 0.04
      }
      if (procedure === 'abdomen') {
        frontDepth += abdomen * 0.13
        halfWidth += pelvis * 0.02
      }
      if (procedure === 'waist') {
        halfWidth += waist * 0.12
        backDepth += waist * 0.06
      }
      if (procedure === 'thighs') {
        halfWidth += pelvis * 0.035
      }
    }

    if (after) {
      if (procedure === 'lipo') {
        frontDepth -= abdomen * 0.06
        halfWidth -= waist * 0.1
        backDepth -= waist * 0.045
      }
      if (procedure === 'abdomen') {
        frontDepth -= abdomen * 0.105
        halfWidth -= pelvis * 0.02
      }
      if (procedure === 'waist') {
        halfWidth -= waist * 0.13
        backDepth -= waist * 0.06
      }
      if (procedure === 'thighs') {
        halfWidth -= pelvis * 0.02
      }
    }

    for (let ix = 0; ix <= segments; ix += 1) {
      const u = ix / segments
      const theta = u * Math.PI * 2
      const sin = Math.sin(theta)
      const cos = Math.cos(theta)
      const side = Math.abs(sin)
      const front = Math.max(0, cos)
      const back = Math.max(0, -cos)
      const anatomicalFlatness = 1 - front * 0.08 - back * 0.12
      const obliqueSoftness = 1 + side * waist * (after ? -0.04 : 0.035)
      const breathingAsymmetry = Math.sin(y * 6.3 + theta * 2.1) * 0.004
      const x = sin * halfWidth * anatomicalFlatness * obliqueSoftness + breathingAsymmetry
      const z = cos * (front > 0 ? frontDepth : backDepth) * (1 + side * 0.05)

      vertices.push(x, y, z)
      uvs.push(u, v)
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
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function createTreatmentPatch(procedure: ProcedureId) {
  const shape = new THREE.Shape()

  if (procedure === 'lipo') {
    shape.moveTo(-0.42, 0.22)
    shape.bezierCurveTo(-0.58, -0.02, -0.55, -0.46, -0.34, -0.78)
    shape.bezierCurveTo(-0.12, -0.92, 0.12, -0.92, 0.34, -0.78)
    shape.bezierCurveTo(0.55, -0.46, 0.58, -0.02, 0.42, 0.22)
    shape.bezierCurveTo(0.18, 0.1, -0.18, 0.1, -0.42, 0.22)
  }

  if (procedure === 'abdomen') {
    shape.moveTo(-0.34, 0.02)
    shape.bezierCurveTo(-0.45, -0.25, -0.4, -0.74, -0.22, -0.94)
    shape.bezierCurveTo(-0.05, -1.07, 0.12, -1.04, 0.3, -0.86)
    shape.bezierCurveTo(0.43, -0.56, 0.44, -0.18, 0.25, 0.04)
    shape.bezierCurveTo(0.06, 0.18, -0.14, 0.15, -0.34, 0.02)
  }

  if (procedure === 'waist') {
    shape.moveTo(-0.58, 0.18)
    shape.bezierCurveTo(-0.76, -0.1, -0.72, -0.62, -0.48, -0.88)
    shape.bezierCurveTo(-0.34, -0.62, -0.31, -0.18, -0.39, 0.13)
    shape.bezierCurveTo(-0.47, 0.26, -0.55, 0.27, -0.58, 0.18)
    shape.moveTo(0.58, 0.18)
    shape.bezierCurveTo(0.76, -0.1, 0.72, -0.62, 0.48, -0.88)
    shape.bezierCurveTo(0.34, -0.62, 0.31, -0.18, 0.39, 0.13)
    shape.bezierCurveTo(0.47, 0.26, 0.55, 0.27, 0.58, 0.18)
  }

  if (procedure === 'thighs') {
    shape.moveTo(-0.34, -0.86)
    shape.bezierCurveTo(-0.54, -1.12, -0.48, -1.52, -0.25, -1.74)
    shape.bezierCurveTo(-0.08, -1.46, -0.05, -1.04, -0.18, -0.86)
    shape.bezierCurveTo(-0.25, -0.8, -0.31, -0.8, -0.34, -0.86)
    shape.moveTo(0.34, -0.86)
    shape.bezierCurveTo(0.54, -1.12, 0.48, -1.52, 0.25, -1.74)
    shape.bezierCurveTo(0.08, -1.46, 0.05, -1.04, 0.18, -0.86)
    shape.bezierCurveTo(0.25, -0.8, 0.31, -0.8, 0.34, -0.86)
  }

  return shape
}

function TorsoSurface({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const geometry = useMemo(() => createTorsoGeometry(procedure, stage), [procedure, stage])
  const beforeGeometry = useMemo(() => createTorsoGeometry(procedure, 'before'), [procedure])

  return (
    <group>
      {stage === 'after' && (
        <mesh geometry={beforeGeometry} position={[0, 0, -0.012]}>
          <meshStandardMaterial color="#f2c4a8" wireframe transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}

      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial color={SKIN} roughness={0.82} sheen={0.16} transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Limb({
  position,
  rotation = [0, 0, 0],
  scale,
  opacity = 0.86,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale: [number, number, number]
  opacity?: number
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <capsuleGeometry args={[1, 1.15, 36, 64]} />
      <meshPhysicalMaterial color={SKIN_SOFT} roughness={0.84} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

function HumanBase({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const thighExtra = procedure === 'thighs' && stage === 'before' ? 0.06 : procedure === 'thighs' ? -0.035 : 0
  const flankCorrection = (procedure === 'waist' || procedure === 'lipo') && stage === 'after' ? -0.025 : 0
  const patchShape = useMemo(() => createTreatmentPatch(procedure), [procedure])
  const activeProcedure = PROCEDURES[procedure]

  return (
    <group position={[0, -0.02, 0]} rotation={[0, -0.08, 0]}>
      <TorsoSurface procedure={procedure} stage={stage} />

      <mesh position={[0, 1.16, 0.0]} scale={[0.105, 0.19, 0.105]}>
        <capsuleGeometry args={[1, 0.8, 32, 48]} />
        <meshPhysicalMaterial color={SKIN_SOFT} roughness={0.82} transparent opacity={0.84} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.42, 0.02]} scale={[0.2, 0.25, 0.18]}>
        <sphereGeometry args={[1, 64, 42]} />
        <meshPhysicalMaterial color={SKIN_SOFT} roughness={0.82} transparent opacity={0.82} depthWrite={false} />
      </mesh>

      <Limb position={[-0.67 + flankCorrection, 0.38, 0.02]} rotation={[0.04, 0.04, 0.18]} scale={[0.082, 0.46, 0.082]} opacity={0.78} />
      <Limb position={[0.67 - flankCorrection, 0.38, 0.02]} rotation={[0.04, -0.04, -0.18]} scale={[0.082, 0.46, 0.082]} opacity={0.78} />
      <Limb position={[-0.75, -0.34, 0.02]} rotation={[0.02, 0.02, 0.09]} scale={[0.066, 0.43, 0.066]} opacity={0.72} />
      <Limb position={[0.75, -0.34, 0.02]} rotation={[0.02, -0.02, -0.09]} scale={[0.066, 0.43, 0.066]} opacity={0.72} />

      <Limb position={[-0.19, -1.42, 0.01]} rotation={[0.02, 0, 0.045]} scale={[0.125 + thighExtra, 0.57, 0.12 + thighExtra * 0.55]} opacity={0.9} />
      <Limb position={[0.19, -1.42, 0.01]} rotation={[0.02, 0, -0.045]} scale={[0.125 + thighExtra, 0.57, 0.12 + thighExtra * 0.55]} opacity={0.9} />
      <Limb position={[-0.18, -2.2, 0.0]} rotation={[0.02, 0, 0.02]} scale={[0.092, 0.54, 0.092]} opacity={0.82} />
      <Limb position={[0.18, -2.2, 0.0]} rotation={[0.02, 0, -0.02]} scale={[0.092, 0.54, 0.092]} opacity={0.82} />

      <mesh position={[0, -0.12, 0.33]} scale={[0.035, 0.026, 0.012]}>
        <sphereGeometry args={[1, 40, 22]} />
        <meshStandardMaterial color="#91604f" roughness={0.72} transparent opacity={0.82} />
      </mesh>

      <mesh position={[0, -0.66, 0.46]}>
        <shapeGeometry
          args={[
            (() => {
              const s = new THREE.Shape()
              s.moveTo(-0.32, -0.02)
              s.lineTo(0.32, -0.02)
              s.lineTo(0.16, -0.34)
              s.quadraticCurveTo(0, -0.42, -0.16, -0.34)
              s.closePath()
              return s
            })(),
          ]}
        />
        <meshStandardMaterial color={GARMENT} roughness={0.76} transparent opacity={0.86} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.34, 0.45]} scale={[1, 1, 1]}>
        <shapeGeometry
          args={[
            (() => {
              const s = new THREE.Shape()
              s.moveTo(-0.39, 0.04)
              s.bezierCurveTo(-0.28, 0.18, -0.13, 0.22, 0, 0.2)
              s.bezierCurveTo(0.13, 0.22, 0.28, 0.18, 0.39, 0.04)
              s.lineTo(0.31, -0.12)
              s.bezierCurveTo(0.12, -0.03, -0.12, -0.03, -0.31, -0.12)
              s.closePath()
              return s
            })(),
          ]}
        />
        <meshStandardMaterial color={GARMENT} roughness={0.76} transparent opacity={0.68} depthWrite={false} />
      </mesh>

      <mesh position={[0, -0.25, 0.51]}>
        <shapeGeometry args={[patchShape, 64]} />
        <meshStandardMaterial color={activeProcedure.color} transparent opacity={0.34} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <SkinMarkings procedure={procedure} stage={stage} />
    </group>
  )
}

function SkinMarkings({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const sideLine = (side: -1 | 1): [number, number, number][] => [
    [side * 0.38, 0.68, 0.52],
    [side * 0.49, 0.28, 0.55],
    [side * 0.48, -0.1, 0.56],
    [side * 0.36, -0.46, 0.55],
    [side * 0.28, -0.9, 0.5],
  ]

  return (
    <group>
      <Line points={sideLine(-1)} color={MARKING_BLUE} transparent opacity={0.84} lineWidth={2} />
      <Line points={sideLine(1)} color={MARKING_BLUE} transparent opacity={0.84} lineWidth={2} />

      {(procedure === 'lipo' || procedure === 'abdomen') && (
        <>
          <Line
            points={[
              [-0.16, 0.18, 0.56],
              [-0.22, -0.14, 0.58],
              [-0.2, -0.52, 0.55],
            ]}
            color={procedure === 'abdomen' ? '#d24b4b' : MARKING_BLUE}
            transparent
            opacity={0.82}
            lineWidth={2}
          />
          <Line
            points={[
              [0.16, 0.18, 0.56],
              [0.22, -0.14, 0.58],
              [0.2, -0.52, 0.55],
            ]}
            color={procedure === 'abdomen' ? '#d24b4b' : MARKING_BLUE}
            transparent
            opacity={0.82}
            lineWidth={2}
          />
        </>
      )}

      {procedure === 'abdomen' && stage === 'after' && (
        <Line
          points={[
            [-0.34, -0.86, 0.54],
            [-0.12, -0.94, 0.56],
            [0.12, -0.94, 0.56],
            [0.34, -0.86, 0.54],
          ]}
          color="#f1efe8"
          transparent
          opacity={0.9}
          lineWidth={2}
        />
      )}

      {procedure === 'thighs' && (
        <>
          <Line
            points={[
              [-0.28, -0.96, 0.44],
              [-0.42, -1.18, 0.42],
              [-0.36, -1.46, 0.42],
              [-0.18, -1.5, 0.45],
            ]}
            color={MARKING_BLUE}
            transparent
            opacity={0.86}
            lineWidth={2}
          />
          <Line
            points={[
              [0.28, -0.96, 0.44],
              [0.42, -1.18, 0.42],
              [0.36, -1.46, 0.42],
              [0.18, -1.5, 0.45],
            ]}
            color={MARKING_BLUE}
            transparent
            opacity={0.86}
            lineWidth={2}
          />
        </>
      )}

      <Line
        points={[
          [-0.48, 0.74, 0.38],
          [-0.18, 0.86, 0.47],
          [0, 0.88, 0.5],
          [0.18, 0.86, 0.47],
          [0.48, 0.74, 0.38],
        ]}
        color="#f1d6a2"
        transparent
        opacity={0.48}
        lineWidth={1.5}
      />
    </group>
  )
}

function BodyScene({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const { viewport } = useThree()
  const modelScale = viewport.aspect < 1 ? 0.48 : 0.58

  return (
    <group scale={modelScale} position={[0, 0.1, 0]}>
      <HumanBase procedure={procedure} stage={stage} />
    </group>
  )
}

export function BodyContourViewer() {
  const [procedure, setProcedure] = useState<ProcedureId>('lipo')
  const [stage, setStage] = useState<StageId>('after')
  const current = PROCEDURES[procedure]

  return (
    <article className="overflow-hidden rounded-lg border border-secondary/20 bg-[#111111]/80 shadow-2xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
        <div className="relative min-h-[540px] bg-[radial-gradient(circle_at_50%_48%,rgba(30,64,175,0.18),rgba(17,17,17,0)_56%)]">
          <Canvas camera={{ position: [0, 0.05, 4.65], fov: 33 }} dpr={[1, 1.7]} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.64} />
              <directionalLight position={[3.2, 4, 4]} intensity={1.16} castShadow />
              <directionalLight position={[-3.5, 1.4, -2]} intensity={0.38} />
              <Center position={[0, -0.1, 0]}>
                <BodyScene procedure={procedure} stage={stage} />
              </Center>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.44}
                maxPolarAngle={Math.PI / 1.68}
                minAzimuthAngle={-0.58}
                maxAzimuthAngle={0.58}
                autoRotate
                autoRotateSpeed={0.1}
              />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-neutral-light backdrop-blur">
            Modelo humano anatómico interactivo
          </div>
        </div>

        <div className="border-t border-secondary/15 p-5 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Contorno corporal</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-white">{current.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral">
            Vista educativa con proporciones humanas, prendas clínicas y marcas quirúrgicas para explicar zonas de tratamiento sin prometer resultados exactos.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-light">Procedimiento</p>
            <div className="flex flex-wrap gap-2">
              {procedureOrder.map((id) => (
                <button
                  key={id}
                  onClick={() => setProcedure(id)}
                  className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    procedure === id
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-white/10 bg-white/5 text-neutral-light hover:border-secondary/50'
                  }`}
                >
                  {PROCEDURES[id].label}
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
            <p><span className="font-semibold text-white">Lectura:</span> {stage === 'before' ? current.before : current.after}</p>
            <p><span className="font-semibold text-white">Objetivo:</span> {current.goal}</p>
            <p><span className="font-semibold text-white">Evaluación:</span> {current.evaluation}</p>
            <p><span className="font-semibold text-white">Límite:</span> {current.limits}</p>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-md border border-secondary/20 bg-secondary/10 p-3 text-xs leading-relaxed text-neutral-light">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: current.color }} />
            Simulación orientativa. La indicación real depende de valoración médica presencial, anatomía, antecedentes y expectativas.
          </div>
        </div>
      </div>
    </article>
  )
}
