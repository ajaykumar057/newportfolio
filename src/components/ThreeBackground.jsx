import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particle geometry
    const particlesCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color('#1DB954'); // Spotify Green
    const color2 = new THREE.Color('#06b6d4'); // Cyan
    const color3 = new THREE.Color('#a855f7'); // Purple

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Positions
      positions[i] = (Math.random() - 0.5) * 12; // X
      positions[i + 1] = (Math.random() - 0.5) * 12; // Y
      positions[i + 2] = (Math.random() - 0.5) * 10; // Z

      // Colors mix
      const rand = Math.random();
      let mixedColor;
      if (rand < 0.33) {
        mixedColor = color1.clone().lerp(color2, Math.random());
      } else if (rand < 0.66) {
        mixedColor = color2.clone().lerp(color3, Math.random());
      } else {
        mixedColor = color3.clone().lerp(color1, Math.random());
      }

      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Particle Texture (Circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const texture = new THREE.CanvasTexture(canvas);

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.05,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    // Points mesh
    const particleField = new THREE.Points(geometry, material);
    scene.add(particleField);

    // Floating large glowing orbs (mesh meshes)
    const orbs = [];
    const orbGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const orbColors = [0x1DB954, 0x06b6d4, 0xa855f7];

    for (let i = 0; i < 3; i++) {
      const orbMat = new THREE.MeshBasicMaterial({
        color: orbColors[i],
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending
      });
      const orb = new THREE.Mesh(orbGeom, orbMat);
      orb.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      scene.add(orb);
      orbs.push({
        mesh: orb,
        speedX: (Math.random() - 0.5) * 0.003,
        speedY: (Math.random() - 0.5) * 0.003,
        speedZ: (Math.random() - 0.5) * 0.003
      });
    }

    // Mouse responsiveness
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate particle field slowly
      particleField.rotation.y = elapsedTime * 0.02;
      particleField.rotation.x = elapsedTime * 0.01;

      // Mouse inertia tracking
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      particleField.position.x = targetX * 2;
      particleField.position.y = -targetY * 2;

      // Animate large glowing orbs
      orbs.forEach((orbObj) => {
        orbObj.mesh.position.x += orbObj.speedX;
        orbObj.mesh.position.y += orbObj.speedY;
        orbObj.mesh.position.z += orbObj.speedZ;

        // Boundary checks
        if (Math.abs(orbObj.mesh.position.x) > 5) orbObj.speedX *= -1;
        if (Math.abs(orbObj.mesh.position.y) > 4) orbObj.speedY *= -1;
        if (Math.abs(orbObj.mesh.position.z) > 3) orbObj.speedZ *= -1;

        orbObj.mesh.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    const requestRef = { current: requestAnimationFrame(animate) };

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      orbGeom.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#050505]"
    />
  );
};

export default ThreeBackground;
