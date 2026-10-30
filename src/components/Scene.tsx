import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// 1. Responsive Camera that locks strictly to origin center (0, 0, 0)
function ResponsiveCamera() {
  const { camera } = useThree();
  const size = window.innerWidth;
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;

    const isMobile = size < 768;
    const isDesktop = size >= 768 && size < 1200;

    // Keep Y height minimal/proportional so changes in aspect ratio don't shift the model up/down
    if (isMobile) {
      cam.fov = 5;
      cam.position.set(0, 3, 6);
    } else if (isDesktop) {
      cam.fov = 15;
      cam.position.set(0, 3, 3);
    } else {
      cam.fov = 10;
      cam.position.set(0, 3, 3);
    }

    // Force camera to point directly at the world center (0, 0, 0)
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// 2. 3D Model consuming cursor ref from outside
interface TiltModelProps {
  mousePositionRef: React.RefObject<{ x: number; y: number }>;
}

function TiltModel({ mousePositionRef }: TiltModelProps) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { scene } = useGLTF("/macbook_pro_14-inch_m5.glb");

  useFrame((_, delta) => {
    if (!groupRef.current || !mousePositionRef.current) return;

    const { x, y } = mousePositionRef.current;
    const targetRotationY = x * 0.25;
    const targetRotationX = -y * 0.15;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      4,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotationX,
      4,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      {/* Center component locks geometry bounding box to exact (0, 0, 0) */}
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
    </group>
  );
}

useGLTF.preload("/macbook_pro_14-inch_m5.glb");

// 3. Main Scene Canvas
export default function Scene() {
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePositionRef.current = { x, y };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <Canvas camera={{ position: [0, 3, 3], fov: 70 }}>
      <ResponsiveCamera />

      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <TiltModel mousePositionRef={mousePositionRef} />
      </Suspense>
    </Canvas>
  );
}
