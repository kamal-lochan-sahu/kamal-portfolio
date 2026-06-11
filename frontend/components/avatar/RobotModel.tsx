'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props { talking?: boolean; excited?: boolean }

export default function RobotModel({ talking = false, excited = false }: Props) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef  = useRef<THREE.Mesh>(null)
  const eyeLRef  = useRef<THREE.Mesh>(null)
  const eyeRRef  = useRef<THREE.Mesh>(null)
  const antRef   = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!groupRef.current) return
    const t = Date.now() * 0.001

    // Idle float
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.08

    // Head slight look-around when idle
    if (headRef.current && !talking) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.2
    }

    // Eye glow pulse
    const pulse = 0.8 + Math.sin(t * 2) * 0.4
    if (eyeLRef.current) {
      (eyeLRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse
    }
    if (eyeRRef.current) {
      (eyeRRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse
    }

    // Antenna bob
    if (antRef.current) {
      antRef.current.rotation.z = Math.sin(t * 2) * 0.08
    }

    // Excited bounce
    if (excited) {
      groupRef.current.rotation.z = Math.sin(t * 8) * 0.06
    }

    // Talking head nod
    if (talking && headRef.current) {
      headRef.current.rotation.x = Math.sin(t * 5) * 0.06
    }
  })

  return (
    <group ref={groupRef} scale={0.85}>

      {/* ── ANTENNA ── */}
      <group ref={antRef} position={[0, 1.28, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
          <meshStandardMaterial color="#1A2235" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* ── HEAD ── */}
      <mesh ref={headRef} position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[0.55, 0.48, 0.48]} />
        <meshStandardMaterial color="#0F1624" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Head cyan edge glow strips */}
      <mesh position={[0, 0.78, 0.245]}>
        <boxGeometry args={[0.52, 0.45, 0.01]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLRef} position={[-0.14, 0.8, 0.25]}>
        <boxGeometry args={[0.1, 0.06, 0.02]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.5} />
      </mesh>
      <mesh ref={eyeRRef} position={[0.14, 0.8, 0.25]}>
        <boxGeometry args={[0.1, 0.06, 0.02]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1.5} />
      </mesh>

      {/* Mouth — thin cyan line */}
      <mesh position={[0, 0.67, 0.25]}>
        <boxGeometry args={[0.18, 0.018, 0.02]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
      </mesh>

      {/* ── BODY ── */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.58, 0.7, 0.36]} />
        <meshStandardMaterial color="#0F1624" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, 0.16, 0.19]}>
        <boxGeometry args={[0.32, 0.32, 0.02]} />
        <meshStandardMaterial color="#1A2235" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Chest core glow */}
      <mesh position={[0, 0.16, 0.21]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={1.5} />
      </mesh>

      {/* ── ARMS ── */}
      <mesh position={[-0.38, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.58, 12]} />
        <meshStandardMaterial color="#0F1624" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.38, 0.22, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.58, 12]} />
        <meshStandardMaterial color="#0F1624" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Arm joint rings */}
      <mesh position={[-0.38, 0.47, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.09, 0.015, 8, 16]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0.38, 0.47, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.09, 0.015, 8, 16]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.6} />
      </mesh>

      {/* ── HANDS ── */}
      <mesh position={[-0.38, -0.08, 0]}>
        <boxGeometry args={[0.14, 0.14, 0.1]} />
        <meshStandardMaterial color="#1A2235" metalness={0.9} />
      </mesh>
      <mesh position={[0.38, -0.08, 0]}>
        <boxGeometry args={[0.14, 0.14, 0.1]} />
        <meshStandardMaterial color="#1A2235" metalness={0.9} />
      </mesh>

      {/* ── LEGS ── */}
      <mesh position={[-0.16, -0.55, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 12]} />
        <meshStandardMaterial color="#0F1624" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.16, -0.55, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 12]} />
        <meshStandardMaterial color="#0F1624" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.16, -0.84, 0.04]}>
        <boxGeometry args={[0.16, 0.1, 0.26]} />
        <meshStandardMaterial color="#1A2235" metalness={0.8} />
      </mesh>
      <mesh position={[0.16, -0.84, 0.04]}>
        <boxGeometry args={[0.16, 0.1, 0.26]} />
        <meshStandardMaterial color="#1A2235" metalness={0.8} />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight position={[0, 0.78, 0.5]} color="#00E5FF" intensity={0.8} distance={1.5} />
    </group>
  )
}
