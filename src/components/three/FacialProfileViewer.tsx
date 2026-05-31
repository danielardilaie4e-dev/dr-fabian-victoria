'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

type FaceModeId = 'rhinoplasty' | 'tip' | 'chin' | 'neck'
type StageId = 'before' | 'after'

const SKIN = '#d8a184'
const SKIN_LIGHT = '#e7b496'
const GOLD = '#AA8D57'
const SOFT_GOLD = '#f1d99d'

const MODES: Record<
  FaceModeId,
  {
    label: string
    title: string
    before: string
    after: string
    goal: string
    when: string
    evaluation: string
    limits: string
  }
> = {
  rhinoplasty: {
    label: 'Rinoplastia',
    title: 'Dorso nasal y continuidad del perfil',
    before: 'La vista inicial muestra un dorso más alto y una transición menos continua hacia la punta.',
    after: 'La simulación suaviza el dorso y conserva soporte para una lectura natural del perfil.',
    goal: 'Armonizar el dorso nasal con la punta y el resto del rostro, manteniendo una lectura natural y funcional.',
    when: 'Se considera cuando hay giba, desviación estética, desproporción nasal o molestias funcionales que requieren valoración.',
    evaluation: 'Se revisan piel, cartílagos, hueso nasal, respiración, tabique, simetría facial y expectativas de cambio.',
    limits: 'El modelo no muestra función respiratoria, grosor de piel, inflamación ni cicatrización interna.',
  },
  tip: {
    label: 'Punta',
    title: 'Rotación y proyección de punta',
    before: 'La vista inicial muestra una punta más descendida y un ángulo nasolabial cerrado.',
    after: 'La simulación eleva la punta con moderación y mejora el ángulo nasolabial.',
    goal: 'Ajustar soporte, rotación y definición de la punta sin perder proporción con el dorso y los labios.',
    when: 'Se considera cuando la punta cae, tiene poca definición o domina la percepción del perfil.',
    evaluation: 'Se analizan cartílagos alares, piel, soporte septal, base nasal, sonrisa y equilibrio nasolabial.',
    limits: 'La simulación no anticipa edema, rigidez temporal ni refinamientos que dependen de la calidad de piel.',
  },
  chin: {
    label: 'Mentón',
    title: 'Balance nariz-labios-mentón',
    before: 'Un mentón retraído puede hacer que la nariz se perciba con mayor proyección.',
    after: 'La simulación adelanta la referencia del mentón y mejora el balance del tercio inferior.',
    goal: 'Mejorar el balance del tercio inferior para que nariz, labios y mentón se lean en conjunto.',
    when: 'Se considera cuando el mentón es retraído o poco definido y altera la armonía del perfil.',
    evaluation: 'Se revisan oclusión dental, mandíbula, piel, cuello, proporciones faciales y alternativas quirúrgicas o no quirúrgicas.',
    limits: 'El modelo no define indicación dental, necesidad ortognática ni tipo de implante o avance.',
  },
  neck: {
    label: 'Cuello',
    title: 'Línea mandibular y cuello',
    before: 'La vista inicial muestra una transición mentón-cuello suave y poco definida.',
    after: 'La simulación define mejor el ángulo cervical y la continuidad mandibular.',
    goal: 'Mejorar la transición entre mentón, mandíbula y cuello para una línea cervical más definida.',
    when: 'Se considera cuando hay grasa localizada, laxitud leve o pérdida de definición en el ángulo cuello-mentón.',
    evaluation: 'Se valoran piel, grasa submentoniana, bandas musculares, mandíbula, edad, peso estable y expectativas.',
    limits: 'La simulación no muestra flacidez severa, bandas dinámicas, inflamación ni calidad de cicatrización.',
  },
}

const modeOrder: FaceModeId[] = ['rhinoplasty', 'tip', 'chin', 'neck']

function getProfile(mode: FaceModeId, stage: StageId): [number, number][] {
  const after = stage === 'after'

  const dorsum = after && mode === 'rhinoplasty' ? -0.1 : 0
  const bridgeSoftening = after && mode === 'rhinoplasty' ? -0.045 : 0
  const tipX = after && (mode === 'rhinoplasty' || mode === 'tip') ? -0.055 : 0
  const tipY = after && mode === 'tip' ? 0.065 : 0
  const chin = after && mode === 'chin' ? 0.13 : 0
  const jaw = after && mode === 'neck' ? 0.055 : 0
  const neck = after && mode === 'neck' ? -0.095 : 0

  return [
    [-0.38, 0.67],
    [-0.12, 0.79],
    [0.18, 0.72],
    [0.28 + bridgeSoftening, 0.52],
    [0.42 + dorsum, 0.34],
    [0.64 + tipX, 0.16 + tipY],
    [0.49 + tipX * 0.42, 0.03],
    [0.43, -0.1],
    [0.35 + chin, -0.27],
    [0.27 + chin + jaw, -0.45],
    [0.1 + neck + chin * 0.33, -0.68],
    [-0.12 + neck * 0.45, -0.86],
    [-0.37, -0.74],
    [-0.52, -0.38],
    [-0.55, 0.12],
    [-0.38, 0.67],
  ]
}

function toCurve(points: [number, number][], z = 0.14): [number, number, number][] {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, z)),
    false,
    'centripetal',
    0.35,
  )

  return curve.getPoints(96).map((point) => [point.x, point.y, point.z])
}

function profileToShape(points: [number, number][]) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    'centripetal',
    0.4,
  )
  const smoothPoints = curve.getPoints(140)
  const shape = new THREE.Shape()
  const [first, ...rest] = smoothPoints
  shape.moveTo(first.x, first.y)
  rest.forEach((point) => shape.lineTo(point.x, point.y))
  return shape
}

function Landmark({ position, active }: { position: [number, number, number]; active: boolean }) {
  return (
    <mesh position={position} scale={active ? 1 : 0.72}>
      <sphereGeometry args={[0.033, 36, 24]} />
      <meshStandardMaterial
        color={active ? GOLD : SOFT_GOLD}
        emissive={active ? GOLD : '#000000'}
        emissiveIntensity={active ? 0.38 : 0}
        roughness={0.44}
        transparent
        opacity={active ? 1 : 0.44}
      />
    </mesh>
  )
}

function FaceSurface({ mode, stage, modelScale }: { mode: FaceModeId; stage: StageId; modelScale: number }) {
  const beforePoints = useMemo(() => getProfile(mode, 'before'), [mode])
  const afterPoints = useMemo(() => getProfile(mode, 'after'), [mode])
  const renderedPoints = stage === 'after' ? afterPoints : beforePoints
  const shape = useMemo(() => profileToShape(renderedPoints), [renderedPoints])
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSize: 0.018,
        bevelThickness: 0.022,
        bevelSegments: 14,
        curveSegments: 36,
      }),
    [shape],
  )

  return (
    <group position={[-0.03, 0.16, -0.08]} scale={modelScale} rotation={[0, 0.02, 0]}>
      <mesh geometry={geometry} position={[0, 0, -0.11]} castShadow receiveShadow>
        <meshPhysicalMaterial color={SKIN} roughness={0.78} transparent opacity={0.72} depthWrite={false} />
      </mesh>

      <mesh position={[-0.43, 0.2, 0.06]} rotation={[0, 0, 0.16]} scale={[0.1, 0.17, 0.035]}>
        <sphereGeometry args={[1, 44, 30]} />
        <meshStandardMaterial color="#c88f79" roughness={0.78} transparent opacity={0.7} depthWrite={false} />
      </mesh>

      <mesh position={[-0.3, -0.95, -0.01]} rotation={[0, 0, -0.08]} scale={[0.16, 0.42, 0.15]}>
        <capsuleGeometry args={[0.42, 0.72, 32, 48]} />
        <meshStandardMaterial color={SKIN_LIGHT} roughness={0.82} transparent opacity={0.48} depthWrite={false} />
      </mesh>

      <mesh position={[-0.43, 0.58, 0.0]} rotation={[0, 0, -0.08]} scale={[0.24, 0.36, 0.06]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color="#332724" roughness={0.85} transparent opacity={0.28} depthWrite={false} />
      </mesh>

      <mesh position={[0.17, 0.36, 0.15]} scale={[0.035, 0.014, 0.006]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#3a2925" roughness={0.55} transparent opacity={0.72} />
      </mesh>

      <Line points={toCurve(beforePoints, 0.145)} color="#f1d6a2" transparent opacity={0.48} lineWidth={2} />
      {stage === 'after' && <Line points={toCurve(afterPoints, 0.17)} color={GOLD} transparent opacity={0.95} lineWidth={3} />}

      <Line
        points={[
          [0.24, 0.48, 0.19],
          [0.43, 0.29, 0.19],
          [0.64, 0.15, 0.19],
        ]}
        color={mode === 'rhinoplasty' ? GOLD : '#f7efe2'}
        transparent
        opacity={mode === 'rhinoplasty' ? 0.9 : 0.38}
        lineWidth={mode === 'rhinoplasty' ? 3 : 1}
      />

      {mode === 'tip' && stage === 'after' && (
        <Line
          points={[
            [0.47, 0.0, 0.21],
            [0.66, 0.18, 0.21],
          ]}
          color={GOLD}
          transparent
          opacity={0.9}
          lineWidth={3}
        />
      )}

      {mode === 'neck' && stage === 'after' && (
        <Line
          points={[
            [0.29, -0.45, 0.21],
            [0.08, -0.68, 0.21],
            [-0.12, -0.8, 0.21],
          ]}
          color={GOLD}
          transparent
          opacity={0.9}
          lineWidth={3}
        />
      )}

      {[
        [0.27, 0.48, 0.21],
        [0.42, 0.32, 0.21],
        [0.64, 0.14, 0.21],
        [0.48, 0.02, 0.21],
        [0.36, -0.28, 0.21],
        [0.28, -0.46, 0.21],
      ].map((position, index) => {
        const active =
          mode === 'rhinoplasty'
            ? index < 3
            : mode === 'tip'
              ? index >= 2 && index <= 3
              : mode === 'chin'
                ? index >= 4
                : index >= 4

        return <Landmark key={index} position={position as [number, number, number]} active={active} />
      })}
    </group>
  )
}

function FacialModel({ mode, stage, modelScale }: { mode: FaceModeId; stage: StageId; modelScale: number }) {
  return (
    <group rotation={[0, -0.04, 0]} position={[0.02, 0.0, 0]}>
      <FaceSurface mode={mode} stage={stage} modelScale={modelScale} />
    </group>
  )
}

function FacialScene({ mode, stage }: { mode: FaceModeId; stage: StageId }) {
  const { viewport } = useThree()
  const modelScale = viewport.aspect < 1 ? 0.72 : 0.83

  return <FacialModel mode={mode} stage={stage} modelScale={modelScale} />
}

export function FacialProfileViewer() {
  const [mode, setMode] = useState<FaceModeId>('rhinoplasty')
  const [stage, setStage] = useState<StageId>('after')
  const current = MODES[mode]

  return (
    <article className="overflow-hidden rounded-lg border border-secondary/20 bg-[#111111]/80 shadow-2xl shadow-black/20">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)]">
        <div className="relative min-h-[510px] bg-[radial-gradient(circle_at_50%_48%,rgba(170,141,87,0.2),rgba(17,17,17,0)_54%)]">
          <Canvas camera={{ position: [0, 0.02, 4.75], fov: 30 }} dpr={[1, 1.7]}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 3.5, 4]} intensity={1.08} />
              <directionalLight position={[-3, 1, -2]} intensity={0.32} />
              <Center position={[0, 0.24, 0]}>
                <FacialScene mode={mode} stage={stage} />
              </Center>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2.45}
                maxPolarAngle={Math.PI / 1.78}
                minAzimuthAngle={-0.32}
                maxAzimuthAngle={0.32}
                autoRotate
                autoRotateSpeed={0.075}
              />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-xs text-neutral-light backdrop-blur">
            Perfil humano anatómico interactivo
          </div>
        </div>

        <div className="border-t border-secondary/15 p-5 lg:border-l lg:border-t-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Perfil facial</p>
          <h3 className="mt-2 font-serif text-2xl font-bold text-white">{current.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral">
            Vista lateral con cráneo, nariz, labios, mentón, cuello y puntos de referencia para explicar equilibrio facial de forma clara y sobria.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-light">Procedimiento</p>
            <div className="flex flex-wrap gap-2">
              {modeOrder.map((id) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                    mode === id
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
            <p><span className="font-semibold text-white">Lectura:</span> {stage === 'before' ? current.before : current.after}</p>
            <p><span className="font-semibold text-white">Objetivo:</span> {current.goal}</p>
            <p><span className="font-semibold text-white">Evaluación:</span> {current.evaluation}</p>
            <p><span className="font-semibold text-white">Límite:</span> {current.limits}</p>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-md border border-secondary/20 bg-secondary/10 p-3 text-xs leading-relaxed text-neutral-light">
            <span className="h-3 w-3 rounded-full bg-[#AA8D57]" />
            Simulación educativa. No reemplaza fotografía clínica, análisis respiratorio ni diagnóstico quirúrgico presencial.
          </div>
        </div>
      </div>
    </article>
  )
}
