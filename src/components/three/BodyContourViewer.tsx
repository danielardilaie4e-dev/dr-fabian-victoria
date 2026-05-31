'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

type ProcedureId = 'lipo' | 'abdomen' | 'waist' | 'thighs'
type StageId = 'before' | 'after'

const SKIN = '#c98f72'
const SKIN_LIGHT = '#e2ad8c'

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
    title: 'De volumen a transición anatómica',
    before: 'La vista inicial muestra mayor plenitud en abdomen y flancos, con una cintura poco definida.',
    after: 'La proyección ilustra una transición más limpia entre abdomen, cintura y cadera.',
    goal: 'Remodelar depósitos localizados de grasa y mejorar la continuidad del contorno; no es un método para bajar de peso.',
    when: 'Se considera cuando hay grasa localizada que persiste a pesar de hábitos saludables y la piel tiene capacidad razonable de retracción.',
    evaluation: 'Se revisan grosor de grasa, calidad de piel, asimetrías, cicatrices, peso estable y antecedentes médicos.',
    limits: 'El modelo no predice textura de piel, fibrosis, inflamación ni cambios propios de la recuperación.',
    color: '#d8b65f',
  },
  abdomen: {
    label: 'Abdominoplastia',
    title: 'Piel, ombligo y pared abdominal',
    before: 'La vista inicial resalta piel inferior redundante y proyección del tejido abdominal.',
    after: 'La proyección muestra un abdomen más plano y una referencia baja para el cierre quirúrgico.',
    goal: 'Retirar piel sobrante, mejorar la tensión del abdomen y tratar la pared muscular cuando existe separación o debilidad.',
    when: 'Suele considerarse después de embarazos, pérdidas importantes de peso o flacidez abdominal que no mejora con ejercicio.',
    evaluation: 'Se valoran piel excedente, ombligo, diástasis, hernias, cicatrices previas, seguridad anestésica y expectativas.',
    limits: 'La cicatriz, la posición final del ombligo y el grado de tensión dependen de la anatomía y de la valoración presencial.',
    color: '#d97864',
  },
  waist: {
    label: 'Cintura',
    title: 'Contorno 360 y flancos',
    before: 'La vista inicial muestra cómo los flancos pueden hacer que el contorno lateral se vea recto.',
    after: 'La proyección marca una cintura más continua entre espalda, abdomen y cadera.',
    goal: 'Mejorar la transición entre abdomen, espalda baja y cadera para que la silueta se lea como una unidad.',
    when: 'Se considera cuando los flancos o la espalda baja dominan el contorno y hay buen soporte de tejidos.',
    evaluation: 'Se revisan proporciones óseas, distribución de grasa, elasticidad, postura y equilibrio con cadera y glúteos.',
    limits: 'La cintura posible está limitada por costillas, pelvis, musculatura y calidad de piel.',
    color: '#e0bd68',
  },
  thighs: {
    label: 'Muslos',
    title: 'Transición cadera-muslo',
    before: 'La vista inicial muestra la continuidad entre pelvis, cadera y muslo superior.',
    after: 'La proyección suaviza la transición lateral conservando proporción y soporte.',
    goal: 'Afinar depósitos localizados y mejorar la continuidad visual entre cadera, muslo y rodilla.',
    when: 'Se considera cuando hay zonas focales de volumen y no predominan flacidez severa o problemas circulatorios.',
    evaluation: 'Se revisan simetría, drenaje, calidad de piel, celulitis, laxitud y relación con la cadera.',
    limits: 'El modelo no representa celulitis, edema, irregularidades de piel ni tiempos de recuperación.',
    color: '#e3c57a',
  },
}

const procedureOrder: ProcedureId[] = ['lipo', 'abdomen', 'waist', 'thighs']

function gaussian(value: number, center: number, width: number) {
  return Math.exp(-((value - center) ** 2) / (2 * width ** 2))
}

function adjustedRadius(baseRadius: number, y: number, procedure: ProcedureId, stage: StageId) {
  if (baseRadius < 0.05) return baseRadius

  const waist = gaussian(y, -0.18, 0.3)
  const abdomen = gaussian(y, -0.36, 0.34)
  const hip = gaussian(y, -0.82, 0.26)
  const thighRoot = gaussian(y, -1.08, 0.18)
  let radius = baseRadius

  if (stage === 'before') {
    if (procedure === 'lipo') radius += abdomen * 0.04 + waist * 0.035
    if (procedure === 'abdomen') radius += abdomen * 0.055
    if (procedure === 'waist') radius += waist * 0.055
    if (procedure === 'thighs') radius += hip * 0.025 + thighRoot * 0.035
  } else {
    if (procedure === 'lipo') radius -= abdomen * 0.02 + waist * 0.035
    if (procedure === 'abdomen') radius -= abdomen * 0.035
    if (procedure === 'waist') radius -= waist * 0.05
    if (procedure === 'thighs') radius -= hip * 0.018 + thighRoot * 0.03
  }

  return Math.max(baseRadius * 0.86, radius)
}

function getBodyProfile(procedure: ProcedureId, stage: StageId) {
  const anchors = [
    [0.0, -1.22],
    [0.16, -1.18],
    [0.34, -1.05],
    [0.46, -0.82],
    [0.42, -0.55],
    [0.34, -0.28],
    [0.36, 0.05],
    [0.42, 0.36],
    [0.53, 0.64],
    [0.58, 0.82],
    [0.3, 1.0],
    [0.12, 1.08],
    [0.0, 1.08],
  ]

  return anchors.map(([x, y]) => new THREE.Vector2(adjustedRadius(x, y, procedure, stage), y))
}

function smoothBodyProfile(profile: THREE.Vector2[], points = 112) {
  return new THREE.SplineCurve(profile).getPoints(points)
}

function outlinePoints(procedure: ProcedureId, stage: StageId): [number, number, number][] {
  const profile = smoothBodyProfile(getBodyProfile(procedure, stage), 96)
  const right = profile.map((point) => [point.x, point.y, 0.64] as [number, number, number])
  const left = [...profile].reverse().map((point) => [-point.x, point.y, 0.64] as [number, number, number])
  return [...right, ...left, right[0]]
}

function ellipseShape(cx: number, cy: number, rx: number, ry: number) {
  const shape = new THREE.Shape()
  shape.absellipse(cx, cy, rx, ry, 0, Math.PI * 2, false, 0)
  return shape
}

function abdomenShape() {
  const shape = new THREE.Shape()
  shape.moveTo(-0.36, -0.08)
  shape.bezierCurveTo(-0.48, -0.34, -0.4, -0.75, -0.18, -0.92)
  shape.bezierCurveTo(0, -1.02, 0.26, -0.9, 0.42, -0.68)
  shape.bezierCurveTo(0.46, -0.34, 0.34, -0.08, 0.16, 0.06)
  shape.bezierCurveTo(-0.04, 0.16, -0.22, 0.08, -0.36, -0.08)
  return shape
}

function createTreatmentShapes(procedure: ProcedureId) {
  if (procedure === 'lipo') {
    return [
      ellipseShape(0, -0.34, 0.44, 0.48),
      ellipseShape(-0.48, -0.23, 0.15, 0.44),
      ellipseShape(0.48, -0.23, 0.15, 0.44),
    ]
  }

  if (procedure === 'abdomen') return [abdomenShape()]

  if (procedure === 'waist') {
    return [ellipseShape(-0.48, -0.18, 0.13, 0.48), ellipseShape(0.48, -0.18, 0.13, 0.48)]
  }

  return [ellipseShape(-0.28, -1.08, 0.14, 0.36), ellipseShape(0.28, -1.08, 0.14, 0.36)]
}

function TorsoSurface({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const geometry = useMemo(() => {
    const lathe = new THREE.LatheGeometry(smoothBodyProfile(getBodyProfile(procedure, stage)), 128)
    lathe.computeVertexNormals()
    return lathe
  }, [procedure, stage])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={SKIN}
        roughness={0.76}
        clearcoat={0.08}
        sheen={0.18}
        transparent
        opacity={0.84}
        depthWrite={false}
      />
    </mesh>
  )
}

function HeadAndNeck() {
  return (
    <group>
      <mesh position={[0, 1.39, 0]} scale={[0.18, 0.24, 0.16]}>
        <sphereGeometry args={[1, 64, 40]} />
        <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.8} transparent opacity={0.76} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.12, 0]} scale={[0.085, 0.2, 0.085]}>
        <capsuleGeometry args={[0.55, 0.38, 28, 48]} />
        <meshPhysicalMaterial color={SKIN} roughness={0.8} transparent opacity={0.72} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Limbs({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const thighRadius = procedure === 'thighs' && stage === 'before' ? 0.135 : 0.118
  const thighLength = procedure === 'thighs' && stage === 'after' ? 0.86 : 0.82

  return (
    <group>
      {[-0.58, 0.58].map((x) => (
        <mesh key={`shoulder-${x}`} position={[x, 0.64, 0]} scale={[0.15, 0.13, 0.12]}>
          <sphereGeometry args={[1, 48, 28]} />
          <meshPhysicalMaterial color={SKIN} roughness={0.82} transparent opacity={0.68} depthWrite={false} />
        </mesh>
      ))}

      {[-0.7, 0.7].map((x) => (
        <mesh key={`arm-${x}`} position={[x, 0.1, 0.0]} rotation={[0.04, 0, x > 0 ? -0.13 : 0.13]}>
          <capsuleGeometry args={[0.085, 1.05, 28, 52]} />
          <meshPhysicalMaterial color={SKIN} roughness={0.82} transparent opacity={0.72} depthWrite={false} />
        </mesh>
      ))}

      {[-0.23, 0.23].map((x) => (
        <mesh key={`leg-${x}`} position={[x, -1.46, 0]} rotation={[0, 0, x > 0 ? -0.04 : 0.04]}>
          <capsuleGeometry args={[thighRadius, thighLength, 32, 56]} />
          <meshPhysicalMaterial color={SKIN} roughness={0.82} transparent opacity={0.78} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function SubtleChest() {
  return (
    <group>
      {[-0.23, 0.23].map((x) => (
        <mesh key={x} position={[x, 0.43, 0.36]} scale={[0.15, 0.12, 0.08]}>
          <sphereGeometry args={[1, 48, 28]} />
          <meshPhysicalMaterial color={SKIN_LIGHT} roughness={0.82} transparent opacity={0.38} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function TreatmentOverlay({ procedure, color }: { procedure: ProcedureId; color: string }) {
  const shapes = useMemo(() => createTreatmentShapes(procedure), [procedure])

  return (
    <group position={[0, 0, 0.67]}>
      {shapes.map((shape, index) => (
        <mesh key={`${procedure}-${index}`}>
          <shapeGeometry args={[shape, 56]} />
          <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.26} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function BodyGuides({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const current = PROCEDURES[procedure]
  const beforeOutline = useMemo(() => outlinePoints(procedure, 'before'), [procedure])
  const activeOutline = useMemo(() => outlinePoints(procedure, stage), [procedure, stage])

  return (
    <group>
      {stage === 'after' && (
        <Line points={beforeOutline} color="#f4dfc8" transparent opacity={0.2} lineWidth={1.25} />
      )}
      <Line points={activeOutline} color={stage === 'after' ? current.color : '#f4dfc8'} transparent opacity={0.72} lineWidth={1.6} />
      <Line
        points={[
          [0, 0.78, 0.69],
          [0, -0.94, 0.69],
        ]}
        color="#f8e1c5"
        transparent
        opacity={0.28}
        lineWidth={1}
      />
      <Line
        points={[
          [-0.54, 0.63, 0.66],
          [-0.22, 0.76, 0.7],
          [0, 0.79, 0.71],
          [0.22, 0.76, 0.7],
          [0.54, 0.63, 0.66],
        ]}
        color="#f8e1c5"
        transparent
        opacity={0.38}
        lineWidth={1.4}
      />
      <mesh position={[0, -0.34, 0.7]} scale={[0.028, 0.02, 0.008]}>
        <sphereGeometry args={[1, 32, 18]} />
        <meshStandardMaterial color="#8a5d50" roughness={0.75} transparent opacity={0.72} />
      </mesh>
    </group>
  )
}

function Clothing() {
  const bottom = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.39, -0.82)
    shape.lineTo(0.39, -0.82)
    shape.lineTo(0.18, -1.06)
    shape.quadraticCurveTo(0, -1.14, -0.18, -1.06)
    shape.closePath()
    return shape
  }, [])

  const top = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.43, 0.32)
    shape.quadraticCurveTo(-0.22, 0.24, 0, 0.28)
    shape.quadraticCurveTo(0.22, 0.24, 0.43, 0.32)
    shape.lineTo(0.39, 0.44)
    shape.quadraticCurveTo(0.18, 0.38, 0, 0.4)
    shape.quadraticCurveTo(-0.18, 0.38, -0.39, 0.44)
    shape.closePath()
    return shape
  }, [])

  return (
    <group position={[0, 0, 0.72]}>
      <mesh>
        <shapeGeometry args={[top]} />
        <meshStandardMaterial color="#7a5445" roughness={0.86} transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh>
        <shapeGeometry args={[bottom]} />
        <meshStandardMaterial color="#9b6a52" roughness={0.86} transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  )
}

function BodyModel({
  procedure,
  stage,
  modelScale,
}: {
  procedure: ProcedureId
  stage: StageId
  modelScale: number
}) {
  const activeProcedure = PROCEDURES[procedure]

  return (
    <group position={[0, -0.13, 0]} rotation={[0, -0.08, 0]} scale={modelScale}>
      <TorsoSurface procedure={procedure} stage={stage} />
      <SubtleChest />
      <HeadAndNeck />
      <Limbs procedure={procedure} stage={stage} />
      <TreatmentOverlay procedure={procedure} color={activeProcedure.color} />
      <BodyGuides procedure={procedure} stage={stage} />
      <Clothing />
    </group>
  )
}

function BodyScene({ procedure, stage }: { procedure: ProcedureId; stage: StageId }) {
  const { viewport } = useThree()
  const modelScale = viewport.aspect < 1 ? 0.62 : 0.74

  return <BodyModel procedure={procedure} stage={stage} modelScale={modelScale} />
}

export function BodyContourViewer() {
  const [procedure, setProcedure] = useState<ProcedureId>('lipo')
  const [stage, setStage] = useState<StageId>('after')
  const current = PROCEDURES[procedure]

  return (
    <article className="overflow-hidden rounded-lg border border-secondary/20 bg-[#111111]/95 shadow-2xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
        <div className="relative min-h-[520px] bg-[radial-gradient(circle_at_50%_48%,rgba(216,182,95,0.14),rgba(17,17,17,0)_58%)]">
          <Canvas camera={{ position: [0, -0.02, 5.05], fov: 33 }} dpr={[1, 1.7]} shadows>
            <Suspense fallback={null}>
              <ambientLight intensity={0.66} />
              <directionalLight position={[3.2, 4, 4]} intensity={1.12} castShadow />
              <directionalLight position={[-3.5, 1.4, -2]} intensity={0.34} />
              <Center position={[0, -0.04, 0]}>
                <BodyScene procedure={procedure} stage={stage} />
              </Center>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.42}
                maxPolarAngle={Math.PI / 1.74}
                minAzimuthAngle={-0.48}
                maxAzimuthAngle={0.48}
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
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Contorno corporal</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-white">{current.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral">
            Esta vista ayuda a ubicar zonas de tratamiento y cambios de contorno desde una perspectiva anatómica.
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

          <div className="mt-5 grid gap-3">
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Qué se busca</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{current.goal}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Cuándo se considera</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{current.when}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Qué se evalúa</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">{current.evaluation}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#171717]/95 p-4">
              <p className="text-sm font-semibold text-white">Lectura del modelo</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral">
                {stage === 'before' ? current.before : current.after} {current.limits}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
