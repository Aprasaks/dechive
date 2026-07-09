'use client';

import * as React from 'react';
import * as THREE from 'three';

const HELIX_HEIGHT = 9.5;
const HELIX_RADIUS = 1.05;
const TURNS = 3.5;
const POINTS_PER_STRAND = 720;
const RUNGS = 48;
const RUNG_DOTS = 4;
const FPS = 30;
const FRAME_MS = 1000 / FPS;

function makeGlowTexture(inner: string, outer: string) {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    return new THREE.Texture();
  }

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.22, outer);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function makeSquareTexture(color: string) {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    return new THREE.Texture();
  }

  context.shadowColor = color;
  context.shadowBlur = 5;
  context.fillStyle = color;
  context.fillRect(size * 0.3, size * 0.3, size * 0.4, size * 0.4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function helixPoint(t: number, phase: number) {
  const angle = t * TURNS * Math.PI * 2 + phase;
  return new THREE.Vector3(
    Math.cos(angle) * HELIX_RADIUS,
    t * HELIX_HEIGHT,
    Math.sin(angle) * HELIX_RADIUS,
  );
}

function buildStrand(group: THREE.Group, phase: number, texture: THREE.Texture, color: number, size: number, opacity: number) {
  const positions = new Float32Array(POINTS_PER_STRAND * 3);

  for (let index = 0; index < POINTS_PER_STRAND; index += 1) {
    const t = index / (POINTS_PER_STRAND - 1);
    const point = helixPoint(t, phase);
    positions[index * 3] = point.x + (Math.random() - 0.5) * 0.12;
    positions[index * 3 + 1] = point.y + (Math.random() - 0.5) * 0.08;
    positions[index * 3 + 2] = point.z + (Math.random() - 0.5) * 0.12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);
}

function buildNodes(
  group: THREE.Group,
  phase: number,
  texture: THREE.Texture,
  color: number,
  count: number,
  size: number,
  opacity: number,
) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const t = (index + Math.random() * 0.6) / count;
    const point = helixPoint(t, phase);
    positions.set([
      point.x + (Math.random() - 0.5) * 0.18,
      point.y + (Math.random() - 0.5) * 0.1,
      point.z + (Math.random() - 0.5) * 0.18,
    ], index * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);
  return material;
}

function buildDust(group: THREE.Group, texture: THREE.Texture, color: number, count: number, size: number, spread: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = 1.2 + Math.pow(Math.random(), 0.7) * spread;
    const angle = Math.random() * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.random() * (HELIX_HEIGHT + 2.5) - 1;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    size,
    map: texture,
    color,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(geometry, material));
}

function buildParticleLinks(group: THREE.Group) {
  const count = 56;
  const positions = new Float32Array(count * 2 * 3);

  for (let index = 0; index < count; index += 1) {
    const t = index / count;
    const strandPoint = helixPoint(t, index % 2 === 0 ? 0 : Math.PI);
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.8 + Math.random() * 2.2;
    const dustPoint = new THREE.Vector3(
      Math.cos(angle) * radius,
      strandPoint.y + (Math.random() - 0.5) * 0.7,
      Math.sin(angle) * radius,
    );

    positions.set([strandPoint.x, strandPoint.y, strandPoint.z, dustPoint.x, dustPoint.y, dustPoint.z], index * 6);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  group.add(new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xd9c09a,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  ));
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.LineSegments) {
      child.geometry.dispose();

      const material = child.material;
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

export default function KnowledgeHelixScene() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x0a0c11, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c11, 0.045);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 3.2, 12);
    camera.lookAt(0, 3.6, 0);

    const group = new THREE.Group();
    group.position.y = -HELIX_HEIGHT / 2 + 2.2;
    scene.add(group);

    const whiteGlow = makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,242,218,0.78)');
    const goldGlow = makeGlowTexture('rgba(255,242,215,1)', 'rgba(232,185,100,0.82)');
    const whiteSquare = makeSquareTexture('rgba(255,244,226,1)');
    const goldSquare = makeSquareTexture('rgba(235,200,130,1)');
    const textures = [whiteGlow, goldGlow, whiteSquare, goldSquare];

    buildStrand(group, 0, whiteGlow, 0xffffff, 0.15, 0.95);
    buildStrand(group, Math.PI, goldGlow, 0xffd99b, 0.16, 0.92);

    const rungPositions = new Float32Array(RUNGS * 2 * 3);
    for (let index = 0; index < RUNGS; index += 1) {
      const t = index / (RUNGS - 1);
      const pointA = helixPoint(t, 0);
      const pointB = helixPoint(t, Math.PI);
      rungPositions.set([pointA.x, pointA.y, pointA.z, pointB.x, pointB.y, pointB.z], index * 6);
    }
    const rungGeometry = new THREE.BufferGeometry();
    rungGeometry.setAttribute('position', new THREE.BufferAttribute(rungPositions, 3));
    group.add(new THREE.LineSegments(
      rungGeometry,
      new THREE.LineBasicMaterial({
        color: 0xfff0d0,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ));

    const rungDotPositions = new Float32Array(RUNGS * RUNG_DOTS * 3);
    let dotCursor = 0;
    for (let index = 0; index < RUNGS; index += 1) {
      const t = index / (RUNGS - 1);
      const pointA = helixPoint(t, 0);
      const pointB = helixPoint(t, Math.PI);
      for (let dot = 0; dot < RUNG_DOTS; dot += 1) {
        const scale = (dot + 1) / (RUNG_DOTS + 1);
        rungDotPositions[dotCursor] = pointA.x + (pointB.x - pointA.x) * scale;
        rungDotPositions[dotCursor + 1] = pointA.y + (pointB.y - pointA.y) * scale;
        rungDotPositions[dotCursor + 2] = pointA.z + (pointB.z - pointA.z) * scale;
        dotCursor += 3;
      }
    }
    const rungDotGeometry = new THREE.BufferGeometry();
    rungDotGeometry.setAttribute('position', new THREE.BufferAttribute(rungDotPositions, 3));
    group.add(new THREE.Points(rungDotGeometry, new THREE.PointsMaterial({
      size: 0.075,
      map: whiteGlow,
      color: 0xffffff,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })));

    buildParticleLinks(group);

    const nodesWhiteMaterial = buildNodes(group, 0, whiteGlow, 0xffffff, 62, 0.46, 1);
    const nodesGoldMaterial = buildNodes(group, Math.PI, goldGlow, 0xffdf9e, 52, 0.44, 0.96);

    buildDust(group, whiteSquare, 0xfff4df, 260, 0.07, 4.8);
    buildDust(group, goldSquare, 0xe0b878, 190, 0.07, 4.6);
    buildDust(group, whiteGlow, 0xffffff, 42, 0.2, 5.2);

    const ringsGroup = new THREE.Group();
    ringsGroup.position.y = -0.25;
    group.add(ringsGroup);
    for (let ring = 0; ring < 7; ring += 1) {
      const radius = 0.62 + ring * 0.48;
      const count = 90 + ring * 34;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2;
        positions[index * 3] = Math.cos(angle) * radius;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = Math.sin(angle) * radius * 0.45;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      ringsGroup.add(new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 0.055,
        map: goldGlow,
        color: 0xf2d39d,
        transparent: true,
        opacity: 0.62 * Math.pow(0.74, ring),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })));
    }

    const baseGlowTexture = makeGlowTexture('rgba(255,246,225,1)', 'rgba(232,185,100,0.5)');
    const glowSpriteMaterial = new THREE.SpriteMaterial({
      map: baseGlowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowSprite = new THREE.Sprite(glowSpriteMaterial);
    glowSprite.scale.set(4.1, 1.6, 1);
    glowSprite.position.y = -0.15;
    group.add(glowSprite);
    textures.push(baseGlowTexture);

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;
    let lastFrame = 0;
    let running = true;
    const startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const render = (now: number) => {
      frameId = window.requestAnimationFrame(render);
      if (!running) return;
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      const elapsed = (now - startTime) / 1000;
      if (!reduceMotionQuery.matches) {
        group.rotation.y = elapsed * 0.1;
        nodesWhiteMaterial.opacity = 0.72 + Math.sin(elapsed * 1.8) * 0.24;
        nodesGoldMaterial.opacity = 0.68 + Math.sin(elapsed * 1.8 + 1.2) * 0.24;
        glowSpriteMaterial.opacity = 0.82 + Math.sin(elapsed * 1.1) * 0.1;
      }

      renderer.render(scene, camera);
    };

    const handleVisibilityChange = () => {
      running = !document.hidden;
      if (running) {
        lastFrame = 0;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      running = Boolean(entries[0]?.isIntersecting) && !document.hidden;
      if (running) {
        lastFrame = 0;
      }
    }, { threshold: 0.05 });

    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    resize();
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      disposeObject(group);
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-label="Animated abstract knowledge helix"
      role="img"
    />
  );
}
