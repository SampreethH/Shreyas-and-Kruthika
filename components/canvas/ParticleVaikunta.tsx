"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const dustVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBoost;
  attribute float aSeed;
  attribute float aSize;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    float t = uTime * (0.05 + aSeed * 0.08);
    // Slow upward drift with lazy curls, wrapped inside the volume.
    p.y = mod(p.y + t * 3.0, 9.0) - 1.0;
    p.x += sin(t * 2.0 + aSeed * 40.0) * 0.35;
    p.z += cos(t * 1.7 + aSeed * 23.0) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (1.5 + aSeed * 3.0) + aSeed * 90.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 + uBoost) * (26.0 / -mv.z);
  }
`;

const dustFrag = /* glsl */ `
  uniform float uBoost;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    // Antique gold motes that read against the ivory marble.
    vec3 col = mix(vec3(0.62, 0.44, 0.12), vec3(0.95, 0.8, 0.45), vTwinkle);
    gl_FragColor = vec4(col * (1.0 + uBoost), a * (0.35 + vTwinkle * 0.55));
  }
`;

const smokeVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const smokeFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12 + uSeed * 10.0;
    // Thin column at the base that widens and curls as it rises.
    float sway = (fbm(vec2(uv.y * 2.0 - t, uSeed)) - 0.5) * uv.y * 0.9;
    float width = mix(0.03, 0.32, pow(uv.y, 0.8));
    float column = smoothstep(width, 0.0, abs(uv.x - 0.5 - sway));
    float wisps = fbm(vec2(uv.x * 3.0 + sway * 2.0, uv.y * 4.0 - t * 2.5));
    float a = column * smoothstep(0.25, 0.75, wisps) * smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.45, uv.y);
    gl_FragColor = vec4(vec3(0.62, 0.57, 0.52), a * 0.28);
  }
`;

function GoldDust({ count }: { count: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 9 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
      seed[i] = Math.random();
      size[i] = 0.6 + Math.random() * 1.8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 }, uBoost: { value: 0 } }),
    [],
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uPixelRatio.value = state.viewport.dpr;
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={dustVert}
        fragmentShader={dustFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function Incense({ position, seed }: { position: [number, number, number]; seed: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed } }), [seed]);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={position}>
      <planeGeometry args={[1.6, 4.5]} />
      <shaderMaterial
        ref={mat}
        vertexShader={smokeVert}
        fragmentShader={smokeFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function petalGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.09, 0.06, 0.08, 0.2, 0, 0.26);
  s.bezierCurveTo(-0.08, 0.2, -0.09, 0.06, 0, 0);
  return new THREE.ShapeGeometry(s, 8);
}

function LotusPetals({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(petalGeometry, []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 9,
        z: (Math.random() - 0.5) * 8 + 1,
        speed: 0.12 + Math.random() * 0.2,
        spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(1.6),
        phase: Math.random() * 100,
      })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    data.forEach((p, i) => {
      p.y -= p.speed * dt;
      if (p.y < -1.2) p.y = 8.5;
      dummy.position.set(p.x + Math.sin(t * 0.5 + p.phase) * 0.6, p.y, p.z + Math.cos(t * 0.4 + p.phase) * 0.4);
      dummy.rotation.set(t * p.spin.x + p.phase, t * p.spin.y, t * p.spin.z);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  const colors = useMemo(() => {
    const palette = ["#f4a6b8", "#ff9f43", "#f6c6d0", "#e8577a"].map((c) => new THREE.Color(c));
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) palette[i % palette.length].toArray(arr, i * 3);
    return arr;
  }, [count]);

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.6} emissive="#5a1a20" emissiveIntensity={0.35} />
    </instancedMesh>
  );
}

export default function ParticleVaikunta({ lite = false }: { lite?: boolean }) {
  return (
    <group>
      <GoldDust count={lite ? 500 : 1400} />
      <LotusPetals count={lite ? 18 : 40} />
      <Incense position={[-3.55, 3.65, 1.4]} seed={0.31} />
      <Incense position={[3.55, 3.65, 1.4]} seed={0.77} />
    </group>
  );
}
