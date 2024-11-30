import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8b4513); // Dark yellow-orange
scene.fog = new THREE.Fog(0x705d3d, 5, 40); // Yellowish fog, darker atmosphere

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(20, 10, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow map
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Sand Floor
const sand = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c }) // Sandy color
);
sand.rotation.x = -Math.PI / 2;
sand.receiveShadow = true; // Receive shadows
scene.add(sand);

// Lights
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.4);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffaa66, 0.8);
sunlight.position.set(10, 20, -5);
sunlight.castShadow = true; // Cast shadows
scene.add(sunlight);

// Flickering Light near Mjolnir
const mjolnirPosition = { x: 0, y: -0.5, z: 0 };
const flickeringLight = new THREE.PointLight(0xffcc33, 1.5, 10); // Warm yellow light
flickeringLight.position.set(mjolnirPosition.x, mjolnirPosition.y + 3, mjolnirPosition.z); // Hovering near Mjolnir
flickeringLight.castShadow = true; // Light casting shadows
scene.add(flickeringLight);

// Load Mjolnir Model
const loader = new GLTFLoader();
loader.load(
  'https://trystan211.github.io/ite_joash/mjolnir_thors_hammer.glb',
  (gltf) => {
    const mjolnir = gltf.scene;
    mjolnir.position.set(mjolnirPosition.x, mjolnirPosition.y, mjolnirPosition.z);
    mjolnir.scale.set(0.01, 0.01, 0.01); // Scale appropriately for the scene
    mjolnir.castShadow = true; // Cast shadows
    scene.add(mjolnir);
  },
  undefined,
  (error) => console.error('Error loading Mjolnir model:', error)
);

// Small Black Stones
const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

for (let i = 0; i < 50; i++) {
  const x = Math.random() * 60 - 30;
  const z = Math.random() * 60 - 30;

  const stone = new THREE.Mesh(
    new THREE.SphereGeometry(Math.random() * 0.5, 16, 16),
    stoneMaterial
  );
  stone.position.set(x, 0.2, z);
  stone.castShadow = true; // Cast shadows
  stone.receiveShadow = true; // Receive shadows
  scene.add(stone);
}

// Tall Pointy Rocks
const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0x666666,
  roughness: 0.9,
  metalness: 0.1
});

for (let i = 0; i < 10; i++) {
  const x = Math.random() * 50 - 25;
  const z = Math.random() * 50 - 25;

  const tallRock = new THREE.Mesh(
    new THREE.ConeGeometry(Math.random() * 1 + 1, Math.random() * 10 + 5, 8),
    rockMaterial
  );
  tallRock.position.set(x, Math.random() * 2, z);
  tallRock.castShadow = true; // Cast shadows
  scene.add(tallRock);
}

// Particle Group: Yellow-Orange Orbiting Particles
const particleCount = 2000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 25 + 10;
  const y = Math.random() * 10 + 2;

  positions.push(
    Math.cos(angle) * distance + mjolnirPosition.x,
    y,
    Math.sin(angle) * distance + mjolnirPosition.z
  );
  velocities.push(0.004 * (Math.random() > 0.5 ? 1 : -1)); // Faster orbit
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33, // Yellow-orange
  size: 0.1,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Closer Blue Particles
const closeParticleCount = 2000;
const closeParticlesGeometry = new THREE.BufferGeometry();
const closePositions = [];
const closeVelocities = [];

for (let i = 0; i < closeParticleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 8 + 3; // Adjust spread
  const y = Math.random() * 4 + 1;

  closePositions.push(
    Math.cos(angle) * distance + mjolnirPosition.x,
    y,
    Math.sin(angle) * distance + mjolnirPosition.z
  );
  closeVelocities.push(0.02 * (Math.random() > 0.5 ? 1 : -1));
}

closeParticlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(closePositions, 3));
closeParticlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(closeVelocities, 1));

const closeParticlesMaterial = new THREE.PointsMaterial({
  color: 0x3399ff, // Blue color
  size: 0.15,
  transparent: true,
  opacity: 0.8
});

const closeParticles = new THREE.Points(closeParticlesGeometry, closeParticlesMaterial);
scene.add(closeParticles);

// Animation Loop
const clock = new THREE.Clock();
let flickerCooldown = Math.random() * 2;
let flickerTimer = 0;

const animate = () => {
  flickerTimer += clock.getDelta();
  if (flickerTimer > flickerCooldown) {
    flickeringLight.intensity = Math.random() * 2.5;
    flickerCooldown = Math.random() * 1.5 + 0.3;
    flickerTimer = 0;
  }

  // Update Yellow-Orange Particles
  const positionsArray = particlesGeometry.attributes.position.array;
  const velocitiesArray = particlesGeometry.attributes.velocity.array;

  for (let i = 0; i < particleCount; i++) {
    const xIndex = i * 3;
    const zIndex = xIndex + 2;

    const x = positionsArray[xIndex] - mjolnirPosition.x;
    const z = positionsArray[zIndex] - mjolnirPosition.z;

    const angle = Math.atan2(z, x) + velocitiesArray[i];
    const distance = Math.sqrt(x * x + z * z);

    positionsArray[xIndex] = Math.cos(angle) * distance + mjolnirPosition.x;
    positionsArray[zIndex] = Math.sin(angle) * distance + mjolnirPosition.z;
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update Closer Blue Particles
  const closePositionsArray = closeParticlesGeometry.attributes.position.array;
  const closeVelocitiesArray = closeParticlesGeometry.attributes.velocity.array;

  for (let i = 0; i < closeParticleCount; i++) {
    const xIndex = i * 3;
    const zIndex = xIndex + 2;

    const x = closePositionsArray[xIndex] - mjolnirPosition.x;
    const z = closePositionsArray[zIndex] - mjolnirPosition.z;

    const angle = Math.atan2(z, x) + closeVelocitiesArray[i];
    const distance = Math.sqrt(x * x + z * z);

    closePositionsArray[xIndex] = Math.cos(angle) * distance + mjolnirPosition.x;
    closePositionsArray[zIndex] = Math.sin(angle) * distance + mjolnirPosition.z;
  }
  closeParticlesGeometry.attributes.position.needsUpdate = true;

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
