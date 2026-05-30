'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'

const MODES = [
  { name: 'Aumento', volume: 0.6, posY: 0.05 },
  { name: 'Reducción', volume: 0.35, posY: -0.02 },
  { name: 'Levantamiento', volume: 0.5, posY: 0.12 },
]

function BreastModel({ modeIndex }: { modeIndex: number }) {
  const mode = MODES[modeIndex]

  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.55, 0.7, 8, 16]} />
        <meshStandardMaterial color="#F7F3EA" metalness={0.1} roughness={0.7} transparent opacity={0.7} />
      </mesh>

      <mesh position={[-0.32, mode.posY, 0.32]}>
        <sphereGeometry args={[mode.volume * 0.55, 24, 24]} />
        <meshStandardMaterial
          color="#E4D5A5"
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh position={[0.32, mode.posY, 0.32]}>
        <sphereGeometry args={[mode.volume * 0.55, 24, 24]} />
        <meshStandardMaterial
          color="#E4D5A5"
          metalness={0.2}
          roughness={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#F7F3EA" metalness={0.1} roughness={0.8} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export function BreastHarmonyViewer() {
  const [modeIndex, setModeIndex] = useState(0)

  return (
    <div className="relative h-[400px] w-full">
      <Canvas camera={{ position: [1.8, 0.3, 2], fov: 40 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} />
          <Center>
            <BreastModel modeIndex={modeIndex} />
          </Center>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.6}
            autoRotate
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {MODES.map((mode, i) => (
          <button
            key={mode.name}
            onClick={() => setModeIndex(i)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
              i === modeIndex
                ? 'bg-[#AA8D57] text-white border-[#AA8D57]'
                : 'border-[#AA8D57]/30 bg-white/80 backdrop-blur-sm hover:bg-[#AA8D57]/10'
            }`}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  )
}
