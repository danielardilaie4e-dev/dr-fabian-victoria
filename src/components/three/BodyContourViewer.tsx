'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

const ZONES = [
  { name: 'Abdomen', position: [0, -0.3, 0.5], color: '#AA8D57' },
  { name: 'Cintura', position: [0.5, -0.1, 0.4], color: '#AA8D57' },
  { name: 'Espalda', position: [-0.5, -0.1, -0.3], color: '#AA8D57' },
  { name: 'Brazos', position: [0.8, 0.1, 0], color: '#AA8D57' },
  { name: 'Muslos', position: [0.4, -0.7, 0.3], color: '#AA8D57' },
]

function TorsoModel({ hoveredZone }: { hoveredZone: string | null }) {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <capsuleGeometry args={[0.5, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={hoveredZone === 'Abdomen' ? '#AA8D57' : '#F7F3EA'}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {ZONES.map((zone) => (
        <mesh key={zone.name} position={zone.position as [number, number, number]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={hoveredZone === zone.name ? '#AA8D57' : '#E4D5A5'}
            emissive={hoveredZone === zone.name ? '#AA8D57' : '#000000'}
            emissiveIntensity={hoveredZone === zone.name ? 0.3 : 0}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#F7F3EA" metalness={0.1} roughness={0.8} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function BodyContourViewer() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  return (
    <div className="relative h-[400px] w-full">
      <Canvas camera={{ position: [1.5, 0.3, 2], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} />
          <Center>
            <TorsoModel hoveredZone={hoveredZone} />
          </Center>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {ZONES.map((zone) => (
          <button
            key={zone.name}
            onMouseEnter={() => setHoveredZone(zone.name)}
            onMouseLeave={() => setHoveredZone(null)}
            className="px-3 py-1.5 text-xs rounded-full border border-[#AA8D57]/30 bg-white/80 backdrop-blur-sm hover:bg-[#AA8D57]/10 transition-colors"
          >
            {zone.name}
          </button>
        ))}
      </div>
    </div>
  )
}
