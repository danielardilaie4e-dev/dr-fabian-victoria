'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Line } from '@react-three/drei'
import * as THREE from 'three'

const STEPS = [
  { label: 'Contacto', icon: '📋', desc: 'Agenda tu valoración por WhatsApp o formulario' },
  { label: 'Valoración', icon: '🔍', desc: 'Evaluación médica personalizada de tu caso' },
  { label: 'Planeación', icon: '📐', desc: 'Definición del plan quirúrgico y expectativas' },
  { label: 'Cirugía', icon: '⚕️', desc: 'Procedimiento en entorno clínico seguro' },
  { label: 'Recuperación', icon: '💚', desc: 'Seguimiento postoperatorio y cuidados' },
]

function StepRing({ active, total, index }: { active: number; total: number; index: number }) {
  const angle = (index / total) * Math.PI * 2
  const radius = 0.8
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const isActive = index <= active
  const isCurrent = index === active

  const nextAngle = ((index + 1) / total) * Math.PI * 2
  const nextX = Math.cos(nextAngle) * radius
  const nextZ = Math.sin(nextAngle) * radius
  const linePoints: [number, number, number][] = [[0, 0, 0], [nextX - x, 0, nextZ - z]]

  return (
    <group position={[x, 0, z]}>
      <mesh>
        <ringGeometry args={[0.06, 0.1, 24]} />
        <meshStandardMaterial
          color={isActive ? '#AA8D57' : '#E4D5A5'}
          transparent
          opacity={isCurrent ? 1 : 0.5}
          emissive={isCurrent ? '#AA8D57' : '#000000'}
          emissiveIntensity={isCurrent ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color={isActive ? '#AA8D57' : '#E4D5A5'} transparent opacity={isActive ? 1 : 0.3} />
      </mesh>
      {index < total - 1 && (
        <Line points={linePoints} color="#AA8D57" transparent opacity={isActive ? 0.3 : 0.1} lineWidth={1} />
      )}
    </group>
  )
}

function ProcessCircle({ active }: { active: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.75, 0.85, 64]} />
        <meshStandardMaterial color="#AA8D57" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {STEPS.map((_, i) => (
        <StepRing key={i} active={active} total={STEPS.length} index={i} />
      ))}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#AA8D57" emissive="#AA8D57" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function ProcessTimeline3D() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="relative">
      <div className="h-[350px] w-full">
        <Canvas camera={{ position: [1.2, 0.8, 1.8], fov: 40 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 3]} intensity={0.8} />
            <Center>
              <ProcessCircle active={activeStep} />
            </Center>
          </Suspense>
        </Canvas>
      </div>
      <div className="flex justify-center gap-2 flex-wrap px-4">
        {STEPS.map((step, i) => (
          <button
            key={step.label}
            onClick={() => setActiveStep(i)}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              i === activeStep
                ? 'bg-[#AA8D57] text-white shadow-lg'
                : i < activeStep
                  ? 'bg-secondary/20 text-[#221E1F]'
                  : 'bg-white border border-secondary/20 text-neutral'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-neutral max-w-md mx-auto">
        {STEPS[activeStep].desc}
      </div>
    </div>
  )
}
