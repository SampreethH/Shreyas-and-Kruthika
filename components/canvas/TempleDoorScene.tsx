"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial, PerspectiveCamera } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, GodRays, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { doorMaps, marbleTexture, tripundraTexture } from "@/lib/doorTexture";
import { gate } from "@/lib/gateState";
import ParticleVaikunta from "./ParticleVaikunta";

const LEAF_W = 1.6;
const LEAF_H = 4.8;
const LEAF_D = 0.16;
const GAP = 0.012;
const OPEN_ANGLE = 1.75;

const damp = THREE.MathUtils.damp;

function DoorLeaf({ side }: { side: "left" | "right" }) {
  const pivot = useRef<THREE.Group>(null);
  const maps = useMemo(() => doorMaps(side), [side]);
  const dir = side === "left" ? 1 : -1;

  // Real 3D studs on the leaf so the relief catches light at grazing angles.
  const studs = useMemo(() => {
    const pts: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      pts.push([-LEAF_W / 2 + 0.09, 0.3 + r * 0.53]);
      pts.push([LEAF_W / 2 - 0.09, 0.3 + r * 0.53]);
    }
    return pts;
  }, []);
  const studRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    if (!pivot.current) return;
    // Doors swing inward, away from the viewer, with a slight overshoot-free ease.
    const target = dir * gate.progress * OPEN_ANGLE;
    pivot.current.rotation.y = damp(pivot.current.rotation.y, target, 4, dt);
    if (studRef.current && !studRef.current.userData.ready) {
      studs.forEach(([x, y], i) => {
        dummy.position.set(x, y - LEAF_H / 2, LEAF_D / 2 + 0.02);
        dummy.updateMatrix();
        studRef.current!.setMatrixAt(i, dummy.matrix);
      });
      studRef.current.instanceMatrix.needsUpdate = true;
      studRef.current.userData.ready = true;
    }
  });

  const hingeX = side === "left" ? -(LEAF_W + GAP / 2) : LEAF_W + GAP / 2;

  return (
    <group ref={pivot} position={[hingeX, LEAF_H / 2, 0]}>
      <group position={[dir * (LEAF_W / 2), 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[LEAF_W, LEAF_H, LEAF_D]} />
          <meshStandardMaterial attach="material-0" color="#7a5414" metalness={1} roughness={0.45} />
          <meshStandardMaterial attach="material-1" color="#7a5414" metalness={1} roughness={0.45} />
          <meshStandardMaterial attach="material-2" color="#7a5414" metalness={1} roughness={0.45} />
          <meshStandardMaterial attach="material-3" color="#7a5414" metalness={1} roughness={0.45} />
          <meshStandardMaterial
            attach="material-4"
            map={maps.map}
            bumpMap={maps.bumpMap}
            bumpScale={6}
            roughnessMap={maps.roughnessMap}
            metalness={1}
            roughness={0.55}
            envMapIntensity={1.4}
          />
          <meshStandardMaterial attach="material-5" color="#3b2608" metalness={0.9} roughness={0.6} />
        </mesh>
        <instancedMesh ref={studRef} args={[undefined, undefined, studs.length]}>
          <sphereGeometry args={[0.045, 12, 8]} />
          <meshStandardMaterial color="#e8c56a" metalness={1} roughness={0.25} />
        </instancedMesh>
        {/* Door ring handle near the meeting edge */}
        <mesh position={[-dir * (LEAF_W / 2 - 0.22), -0.1, LEAF_D / 2 + 0.06]}>
          <torusGeometry args={[0.13, 0.022, 12, 32]} />
          <meshStandardMaterial color="#f3d27a" metalness={1} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Pillar({ x }: { x: number }) {
  const profile = useMemo(() => {
    // Lathe profile: base, banded shaft, bell capital.
    const p: THREE.Vector2[] = [];
    const add = (r: number, y: number) => p.push(new THREE.Vector2(r, y));
    add(0, 0);
    add(0.48, 0);
    add(0.48, 0.25);
    add(0.38, 0.32);
    add(0.38, 0.5);
    for (let i = 0; i < 6; i++) {
      const y = 0.6 + i * 0.75;
      add(0.3, y);
      add(0.34, y + 0.06);
      add(0.34, y + 0.12);
      add(0.3, y + 0.18);
    }
    add(0.3, 5.0);
    add(0.42, 5.15);
    add(0.5, 5.35);
    add(0.5, 5.5);
    add(0, 5.5);
    return p;
  }, []);
  return (
    <mesh position={[x, 0, 0.35]} castShadow receiveShadow>
      <latheGeometry args={[profile, 32]} />
      <meshStandardMaterial color="#b8892b" metalness={0.95} roughness={0.32} envMapIntensity={1.2} />
    </mesh>
  );
}

function Deepam({ x }: { x: number }) {
  const light = useRef<THREE.PointLight>(null);
  const flame = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 100, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime + seed;
    const flicker = 0.85 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05 + Math.random() * 0.06;
    if (light.current) light.current.intensity = 6 * flicker;
    if (flame.current) flame.current.scale.set(1, flicker * 1.1, 1);
  });
  const stand = useMemo(() => {
    const p = [
      [0, 0],
      [0.32, 0],
      [0.3, 0.06],
      [0.1, 0.12],
      [0.06, 0.6],
      [0.12, 0.66],
      [0.06, 0.72],
      [0.06, 1.05],
      [0.26, 1.12],
      [0.3, 1.2],
      [0, 1.18],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    return p;
  }, []);
  return (
    <group position={[x, 0, 1.4]}>
      <mesh castShadow>
        <latheGeometry args={[stand, 24]} />
        <meshStandardMaterial color="#c99a3a" metalness={1} roughness={0.28} />
      </mesh>
      <mesh ref={flame} position={[0, 1.33, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={[6, 3.2, 1]} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 1.45, 0]} color="#ff9a3c" distance={6} decay={1.6} />
    </group>
  );
}

function Lintel() {
  const tripundra = useMemo(tripundraTexture, []);
  return (
    <group>
      {/* Jambs */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (LEAF_W + 0.26), 2.7, 0.05]} receiveShadow>
          <boxGeometry args={[0.5, 5.4, 0.5]} />
          <meshStandardMaterial color="#9c7224" metalness={0.95} roughness={0.38} />
        </mesh>
      ))}
      {/* Lintel beam */}
      <mesh position={[0, 5.15, 0.05]}>
        <boxGeometry args={[4.9, 0.7, 0.55]} />
        <meshStandardMaterial color="#a77b27" metalness={0.95} roughness={0.35} />
      </mesh>
      {/* Tripundra plaque for Sri Nanjundeshwara */}
      <mesh position={[0, 5.15, 0.34]}>
        <circleGeometry args={[0.42, 48]} />
        <meshStandardMaterial color="#7A1C1C" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 5.15, 0.35]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshBasicMaterial map={tripundra} transparent toneMapped={false} color={[1.6, 1.6, 1.6]} />
      </mesh>
      {/* Gopuram tiers rising above */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 5.75 + i * 0.55, -0.1 - i * 0.05]}>
          <boxGeometry args={[6.4 - i * 1.25, 0.5, 0.6]} />
          <meshStandardMaterial color={i % 2 ? "#8a6420" : "#b8892b"} metalness={0.95} roughness={0.35} />
        </mesh>
      ))}
      {/* Kalasham */}
      <mesh position={[0, 7.95, -0.25]}>
        <latheGeometry
          args={[
            [
              [0, 0],
              [0.28, 0.05],
              [0.36, 0.3],
              [0.2, 0.55],
              [0.12, 0.7],
              [0.18, 0.8],
              [0.04, 1.05],
              [0, 1.1],
            ].map(([r, y]) => new THREE.Vector2(r, y)),
            32,
          ]}
        />
        <meshStandardMaterial color="#f0c75e" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Walls() {
  const marble = useMemo(() => marbleTexture(4), []);
  const mat = <meshStandardMaterial map={marble} color="#f3eadb" roughness={0.42} metalness={0} envMapIntensity={0.6} />;
  return (
    <group>
      <mesh position={[-8.11, 4, -0.2]}>
        <boxGeometry args={[12, 12, 0.3]} />
        {mat}
      </mesh>
      <mesh position={[8.11, 4, -0.2]}>
        <boxGeometry args={[12, 12, 0.3]} />
        {mat}
      </mesh>
      <mesh position={[0, 8.2, -0.25]}>
        <boxGeometry args={[4.3, 5.4, 0.3]} />
        {mat}
      </mesh>
      {/* Inner corridor toward the sanctum */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.2, 3, -5]}>
          <boxGeometry args={[0.3, 6, 10]} />
          <meshStandardMaterial color="#9c7f55" roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Sanctum({ onSun }: { onSun: (m: THREE.Mesh) => void }) {
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame((state, dt) => {
    const p = gate.progress;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
    // Warm amber lamplight through the doorway (tone-mapped, so it never clips to white).
    if (glow.current) glow.current.color.setRGB(0.95 * pulse, 0.66 * pulse, 0.36 * pulse);
    if (light.current) light.current.intensity = damp(light.current.intensity, 1.5 + p * 6, 3, dt);
    // Ease the exposure down as the camera moves through the doorway.
    state.gl.toneMappingExposure = damp(state.gl.toneMappingExposure, 0.88 - gate.push * 0.18, 3, dt);
  });
  return (
    <group>
      <mesh position={[0, 2.4, -7]}>
        <planeGeometry args={[4.4, 6]} />
        <meshBasicMaterial ref={glow} />
      </mesh>
      <mesh ref={onSun} position={[0, 2.6, -5]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color={[0.95, 0.72, 0.42]} transparent opacity={0.75} />
      </mesh>
      <pointLight ref={light} position={[0, 2.5, -1.5]} color="#ffc98a" distance={12} decay={1.6} />
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 3.05, 0), []);
  useFrame((_, dt) => {
    const push = gate.push;
    const z = THREE.MathUtils.lerp(9.6, -2.2, push);
    const y = THREE.MathUtils.lerp(2.35, 2.55, push);
    const tilt = 1 - push;
    camera.position.x = damp(camera.position.x, gate.tiltX * 0.9 * tilt, 3, dt);
    camera.position.y = damp(camera.position.y, y + gate.tiltY * 0.45 * tilt, 3, dt);
    camera.position.z = damp(camera.position.z, z, 2.5, dt);
    look.z = damp(look.z, push > 0 ? -6 : 0, 2, dt);
    camera.lookAt(look);
  });
  return null;
}

function Effects({ sun, lite }: { sun: THREE.Mesh; lite: boolean }) {
  const offset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);
  // Phones: bloom only. God rays and aberration cost the most fill-rate.
  if (lite)
    return (
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.97} luminanceSmoothing={0.15} intensity={0.7} />
        <Vignette eskil={false} offset={0.3} darkness={0.32} />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={lite ? 0 : 4} autoClear={false}>
      <GodRays
        sun={sun}
        samples={lite ? 30 : 60}
        density={0.96}
        decay={0.94}
        weight={0.25}
        exposure={0.14}
        clampMax={1}
        kernelSize={KernelSize.SMALL}
        blur
      />
      <Bloom mipmapBlur luminanceThreshold={0.97} luminanceSmoothing={0.15} intensity={0.7} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={offset} radialModulation={false} modulationOffset={0} />
      <Vignette eskil={false} offset={0.3} darkness={0.32} />
    </EffectComposer>
  );
}

function Scene({ lite }: { lite: boolean }) {
  const [sun, setSun] = useState<THREE.Mesh | null>(null);
  const floorMarble = useMemo(() => marbleTexture(10), []);
  return (
    <>
      <PerspectiveCamera makeDefault fov={lite ? 52 : 42} position={[0, 2.35, 9.6]} near={0.1} far={60} />
      <CameraRig />
      <color attach="background" args={["#f6efe2"]} />
      <fog attach="fog" args={["#f6efe2", 12, 34]} />

      {/* Soft daylight in an ivory marble mandapa */}
      <hemisphereLight args={["#fff8ec", "#d9c6a0", 0.85]} />
      <ambientLight intensity={0.3} color="#fff4e0" />
      <spotLight position={[0, 9, 7]} angle={0.5} penumbra={0.8} intensity={60} color="#ffe2b0" castShadow />
      <spotLight position={[-6, 4, 6]} angle={0.6} penumbra={1} intensity={14} color="#ffd8a0" />
      <spotLight position={[6, 4, 6]} angle={0.6} penumbra={1} intensity={14} color="#ffd8a0" />

      <Environment resolution={128} frames={1}>
        {/* Cream sky so the gold reflects a bright mandapa, not a dark void */}
        <color attach="background" args={["#c8b083"]} />
        <Lightformer form="rect" intensity={4} color="#fff3dc" position={[0, 6, 6]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ff9f43" position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ff9f43" position={[6, 2, 3]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={4} color="#fff3d6" position={[0, 3, -6]} scale={3} />
      </Environment>

      <DoorLeaf side="left" />
      <DoorLeaf side="right" />
      <Lintel />
      <Walls />
      <Pillar x={-2.85} />
      <Pillar x={2.85} />
      <Deepam x={-3.55} />
      <Deepam x={3.55} />
      <Sanctum onSun={setSun} />
      <ParticleVaikunta lite={lite} />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        {lite ? (
          <meshStandardMaterial map={floorMarble} color="#f1e7d5" roughness={0.28} metalness={0} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            blur={[300, 80]}
            mixBlur={1}
            mixStrength={0.9}
            depthScale={1}
            minDepthThreshold={0.6}
            maxDepthThreshold={1.4}
            map={floorMarble}
            color="#efe5d2"
            metalness={0}
            roughness={0.6}
            mirror={0.35}
          />
        )}
      </mesh>

      {sun && <Effects sun={sun} lite={lite} />}
    </>
  );
}

export default function TempleDoorScene({ lite = false, onCreated }: { lite?: boolean; onCreated?: () => void }) {
  return (
    <Canvas
      shadows={lite ? false : { type: THREE.PCFShadowMap }}
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.88;
        onCreated?.();
      }}
    >
      <Suspense fallback={null}>
        <Scene lite={lite} />
      </Suspense>
    </Canvas>
  );
}
