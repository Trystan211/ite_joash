import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8b4513); // Dark yellow-orange
scene.fog = new THREE.Fog(0x705d3d, 5, 40); // Yellowish fog, darker atmosphere

// Camera and Renderer Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(10, 10, 30); // Adjust camera to see Mjolnir
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls Setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Sand Floor - Make it smaller
const sand = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40), // Smaller floor (reduce size)
  new THREE.MeshStandardMaterial({ color: 0xd2b48c }) // Sandy color
);
sand.rotation.x = -Math.PI / 2;
scene.add(sand);

// Lights
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.4); // Soft ambient light
scene.add(ambientLight);

// Sunlight - Directional light
const sunlight = new THREE.DirectionalLight(0xffaa66, 0.8);
sunlight.position.set(10, 20, -5);
scene.add(sunlight);

// Spotlight to emphasize Mjolnir
const spotlight = new THREE.SpotLight(0x88ccff, 2); // Light to emphasize Mjolnir
spotlight.position.set(0, 10, 10); // Position above Mjolnir
spotlight.target.position.set(0, 1, 0); // Focus on Mjolnir
spotlight.angle = Math.PI / 4;
scene.add(spotlight);

// Load Mjolnir Model
const loader = new GLTFLoader(); // Define the loader here
let mjolnirPosition = { x: 0, y: 1, z: 0 }; // Mjolnir position

loader.load(
  'https://trystan211.github.io/ite_joash/mjolnir_thors_hammer.glb',
  (gltf) => {
    const mjolnir = gltf.scene;
    mjolnir.position.set(mjolnirPosition.x, -1, mjolnirPosition.z); // Center position (adjust height to be above the ground)
    mjolnir.scale.set(0.5, 0.5, 0.5); // Scale it down to fit the scene
    scene.add(mjolnir);
  },
  undefined,
  (error) => console.error('Error loading Mjolnir model:', error)
);

// Small Black Stones
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

for (let i = 0; i < 50; i++) {
  const x = Math.random() * 40 - 20;
  const z = Math.random() * 40 - 20;

  const stone = new THREE.Mesh(
    new THREE.SphereGeometry(Math.random() * 0.5, 16, 16),
    stoneMaterial
  );
  stone.position.set(x, 0.2, z);
  scene.add(stone);
}

// Tall Pointy Rocks
const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0x666666,
  roughness: 0.9,
  metalness: 0.1
});

for (let i = 0; i < 10; i++) {
  const x = Math.random() * 40 - 20;
  const z = Math.random() * 40 - 20;

  const tallRock = new THREE.Mesh(
    new THREE.ConeGeometry(Math.random() * 1 + 1, Math.random() * 10 + 5, 8),
    rockMaterial
  );
  tallRock.position.set(x, Math.random() * 2, z);
  scene.add(tallRock);
}

// Yellow-Orange Orbiting Particles (Faster Movement)
const particleCount = 2000; // Increased particle count
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
const velocities = []; // Angular velocities (increased for faster movement)

for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2; // Random starting angle
  const distance = Math.random() * 15 + 5; // Distance from the center
  const y = Math.random() * 10 + 2; // Height above the ground

  positions.push(
    Math.cos(angle) * distance + mjolnirPosition.x, // X
    y,                                              // Y
    Math.sin(angle) * distance + mjolnirPosition.z  // Z
  );
  velocities.push(0.005 * (Math.random() > 0.5 ? 1 : -1)); // Increased angular velocity for faster movement
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33, // Yellow-orange
  size: 0.125, // 2x smaller
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Random Flickering Blue Lights
const blueLights = [];
const blueLightMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff });

for (let i = 0; i < 100; i++) { // Increased number of flickering lights
  const light = new THREE.PointLight(0x88ccff, 0, 10);
  light.position.set(
    Math.random() * 40 - 20,
    Math.random() * 10 + 1,
    Math.random() * 40 - 20
  );
  scene.add(light);
  blueLights.push(light);
}

// Animation Loop
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles for orbiting motion
  const positions = particlesGeometry.attributes.position.array;
  const velocities = particlesGeometry.attributes.velocity.array;

  for (let i = 0; i < particleCount; i++) {
    const xIndex = i * 3;
    const zIndex = xIndex + 2;

    const x = positions[xIndex] - mjolnirPosition.x;
    const z = positions[zIndex] - mjolnirPosition.z;

    const angle = Math.atan2(z, x) + velocities[i]; // Adjust for faster orbit
    const distance = Math.sqrt(x * x + z * z);

    positions[xIndex] = Math.cos(angle) * distance + mjolnirPosition.x;
    positions[zIndex] = Math.sin(angle) * distance + mjolnirPosition.z;
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Flickering lights
  blueLights.forEach((light) => {
    light.intensity = Math.random() > 0.8 ? Math.random() * 3 : 0; // Randomly flicker on and off
  });

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

