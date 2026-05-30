'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, Line } from '@react-three/drei'
import { Suspense } from 'react'

function FacialProfile() {
  const profilePoints = [
    [0, 0.6, 0.35],
    [0.08, 0.5, 0.35],
    [0.12, 0.4, 0.35],
    [0.1, 0.3, 0.35],
    [0.05, 0.2, 0.35],
    [0.0, 0.1, 0.35],
    [-0.02, 0.0, 0.35],
    [0.0, -0.1, 0.35],
    [0.05, -0.2, 0.35],
    [0.1, -0.3, 0.35],
    [0.15, -0.4, 0.35],
    [0.18, -0.5, 0.35],
    [0.2, -0.6, 0.35],
  ] as [number, number, number][]

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#F7F3EA" metalness={0.1} roughness={0.7} transparent opacity={0.4} />
      </mesh>

      <mesh position={[0.08, 0.45, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#AA8D57" emissive="#AA8D57" emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.18, 0.2, 0.38]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#AA8D57" emissive="#AA8D57" emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.2, -0.2, 0.38]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#AA8D57" emissive="#AA8D57" emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>

      <Line points={profilePoints} color="#AA8D57" opacity={0.4} transparent lineWidth={1} />

      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.3]} />
        <meshStandardMaterial color="#AA8D57" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.3, 0.03, 0.3]} />
        <meshStandardMaterial color="#AA8D57" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.03, 0.5, 0.3]} />
        <meshStandardMaterial color="#AA8D57" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

export function FacialProfileViewer() {
  return (
    <div className="relative h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 2.2], fov: 35 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={0.8} />
          <directionalLight position={[-2, 1, 2]} intensity={0.3} />
          <Center>
            <FacialProfile />
          </Center>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate
            autoRotateSpeed={0.5}
            minAzimuthAngle={-0.5}
            maxAzimuthAngle={0.5}
          />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#A59F90] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[#AA8D57]/20">
        Arrastra para rotar • Puente nasal • Punta • Ángulo nasolabial
      </div>
    </div>
  )
}
