'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  phase: number   // 0=appear 1=namaste 2=shrink
  progress: number // 0→1 within phase
}

export default function CartoonKamal({ phase, progress }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const leftArmRef  = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)

  // Skin tone, hair, clothing colors
  const skin   = '#C68642'
  const hair   = '#1a0800'
  const shirt  = '#1E3A8A'
  const pants  = '#1f2937'

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Phase 0: Float in
    if (phase === 0) {
      groupRef.current.position.y = -2 + progress * 2
      groupRef.current.scale.setScalar(progress)
    }

    // Phase 1: Namaste — arms come together, head bows
    if (phase === 1) {
      const t = progress
      if (leftArmRef.current)  leftArmRef.current.rotation.z  =  0.5 - t * 0.5
      if (leftArmRef.current)  leftArmRef.current.rotation.x  =  t * 0.8
      if (rightArmRef.current) rightArmRef.current.rotation.z = -0.5 + t * 0.5
      if (rightArmRef.current) rightArmRef.current.rotation.x =  t * 0.8
      if (headRef.current)     headRef.current.rotation.x      =  t * 0.15
    }

    // Phase 2: Shrink + move to corner
    if (phase === 2) {
      const s = 1 - progress * 0.85
      groupRef.current.scale.setScalar(s)
      groupRef.current.position.x =  progress * 4.5
      groupRef.current.position.y = -progress * 3.5
    }

    // Idle breath
    const breathe = Math.sin(Date.now() * 0.002) * 0.015
    if (phase === 1 && groupRef.current) {
      groupRef.current.position.y = breathe
    }
  })

  return (
    <group ref={groupRef} position={[0, -2, 0]}>

      {/* ── HEAD ── */}
      <mesh ref={headRef} position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>

      {/* Hair — top */}
      {[
        [0,    1.9,  0.05],
        [0.1,  1.88, 0.08],
        [-0.1, 1.88, 0.08],
        [0.18, 1.82, 0.12],
        [-0.18,1.82, 0.12],
        [0,    1.87, -0.05],
        [0.08, 1.91, -0.02],
        [-0.08,1.91, -0.02],
      ].map(([x,y,z], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]}>
          <sphereGeometry args={[0.1 - i * 0.004, 12, 12]} />
          <meshStandardMaterial color={hair} roughness={0.9} />
        </mesh>
      ))}

      {/* Eyes */}
      <mesh position={[-0.13, 1.58, 0.33]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.13, 1.58, 0.33]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.13, 1.58, 0.365]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color="#1a0800" />
      </mesh>
      <mesh position={[0.13, 1.58, 0.365]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color="#1a0800" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.13, 1.65, 0.32]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.018, 0.01]} />
        <meshStandardMaterial color={hair} />
      </mesh>
      <mesh position={[0.13, 1.65, 0.32]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.1, 0.018, 0.01]} />
        <meshStandardMaterial color={hair} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.5, 0.37]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.44, 0.35]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.37, 1.55, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0.37, 1.55, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.22, 16]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>

      {/* ── BODY ── */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.33, 0.85, 20]} />
        <meshStandardMaterial color={shirt} roughness={0.7} />
      </mesh>

      {/* Shirt collar detail */}
      <mesh position={[0, 1.05, 0.18]}>
        <boxGeometry args={[0.22, 0.14, 0.05]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>

      {/* ── LEGS ── */}
      <mesh position={[-0.14, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.65, 16]} />
        <meshStandardMaterial color={pants} roughness={0.8} />
      </mesh>
      <mesh position={[0.14, -0.12, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.11, 0.65, 16]} />
        <meshStandardMaterial color={pants} roughness={0.8} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.14, -0.5, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.28]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, -0.5, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.28]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* ── LEFT ARM ── */}
      <group ref={leftArmRef} position={[-0.42, 0.92, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.5, 14]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
        {/* Left hand */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>

      {/* ── RIGHT ARM ── */}
      <group ref={rightArmRef} position={[0.42, 0.92, 0]}>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.5, 14]} />
          <meshStandardMaterial color={shirt} />
        </mesh>
        {/* Right hand */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.1, 14, 14]} />
          <meshStandardMaterial color={skin} />
        </mesh>
      </group>

    </group>
  )
}
