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
scene.add(sand);

// Lights
const ambientLight = new THREE.AmbientLight(0xffcc88, 0.4);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight(0xffaa66, 0.8);
sunlight.position.set(10, 20, -5);
scene.add(sunlight);

// Load Mjolnir Model
const loader = new GLTFLoader();
let mjolnirPosition = { x: 0, y: -0.5, z: 0 };

loader.load(
  'https://trystan211.github.io/ite_joash/mjolnir_thors_hammer.glb',
  (gltf) => {
    const mjolnir = gltf.scene;

    mjolnir.position.set(mjolnirPosition.x, mjolnirPosition.y, mjolnirPosition.z);
    mjolnir.scale.set(0.01, 0.01, 0.01); // Scale appropriately for the scene
    mjolnir.castShadow = true; // Enable shadows for Mjolnir
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
  stone.castShadow = true; // Enable shadows for stones
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
  tallRock.castShadow = true; // Enable shadows for tall rocks
  scene.add(tallRock);
}

// Yellow-Orange Orbiting Particles
const particleCount = 2000; // Increased particle count
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
const velocities = []; // Angular velocities

for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2; // Random starting angle
  const distance = Math.random() * 15 + 5; // Distance from the center
  const y = Math.random() * 10 + 2; // Height above the ground

  positions.push(
    Math.cos(angle) * distance + mjolnirPosition.x, // X
    y,                                              // Y
    Math.sin(angle) * distance + mjolnirPosition.z  // Z
  );
  velocities.push(0.002 * (Math.random() > 0.5 ? 1 : -1)); // Random angular velocity
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33, // Yellow-orange
  size: 0.25, // 2x smaller
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Additional particles group closer to mjolnir
const closerParticleCount = 500; // More particles, closer to Mjolnir
const closerParticlesGeometry = new THREE.BufferGeometry();
const closerPositions = [];
const closerVelocities = [];

for (let i = 0; i < closerParticleCount; i++) {
  const angle = Math.random() * Math.PI * 2; // Random starting angle
  const distance = Math.random() * 5 + 1; // Closer distance from the center
  const y = Math.random() * 5 + 2; // Height above the ground

  closerPositions.push(
    Math.cos(angle) * distance + mjolnirPosition.x, // X
    y,                                              // Y
    Math.sin(angle) * distance + mjolnirPosition.z  // Z
  );
  closerVelocities.push(0.01 * (Math.random() > 0.5 ? 1 : -1)); // Faster angular velocity
}

closerParticlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(closerPositions, 3));
closerParticlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(closerVelocities, 1));

const closerParticlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33, // Yellow-orange
  size: 0.2, // Smaller particles
  transparent: true,
  opacity: 0.8
});

const closerParticles = new THREE.Points(closerParticlesGeometry, closerParticlesMaterial);
scene.add(closerParticles);

// Random Flickering Blue Lights
const blueLights = [];
const blueLightMaterial = new THREE.MeshStandardMaterial({ color: 0x88ccff });

for (let i = 0; i < 50; i++) { // Increased number of flickering lights
  const light = new THREE.PointLight(0x88ccff, 0, 10);
  light.position.set(
    Math.random() * 40 - 20,
    Math.random() * 10 + 1,
    Math.random() * 40 - 20
  );
  scene.add(light);
  blueLights.push(light);
}

// Flickering Light near Mjolnir
const flickeringLight = new THREE.PointLight(0xffcc33, 1.5, 10); // Warm yellow light
flickeringLight.position.set(mjolnirPosition.x, mjolnirPosition.y + 3, mjolnirPosition.z); // Hovering near Mjolnir
flickeringLight.castShadow = true; // Light casting shadows
scene.add(flickeringLight);

// Flickering Light Animation
let flickerCooldown = Math.random() * 2; // Random delay between flickers
let flickerTimer = 0;

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

    const angle = Math.atan2(z, x) + velocities[i];
    const distance = Math.sqrt(x * x + z * z);

    positions[xIndex] = Math.cos(angle) * distance + mjolnirPosition.x;
    positions[zIndex] = Math.sin(angle) * distance + mjolnirPosition.z;
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update closer particles for orbiting motion (faster)
  const closerPositions = closerParticlesGeometry.attributes.position.array;
  const closerVelocities = closerParticlesGeometry.attributes.velocity.array;

  for (let i = 0; i < closerParticleCount; i++) {
    const xIndex = i * 3;
    const zIndex = xIndex + 2;

    const x = closerPositions[xIndex] - mjolnirPosition.x;
    const z = closerPositions[zIndex] - mjolnirPosition.z;

    const angle = Math.atan2(z, x) + closerVelocities[i];
    const distance = Math.sqrt(x * x + z * z);

    closerPositions[xIndex] = Math.cos(angle) * distance + mjolnirPosition.x;
    closerPositions[zIndex] = Math.sin(angle) * distance + mjolnirPosition.z;
  }
  closerParticlesGeometry.attributes.position.needsUpdate = true;

  // Sporadic flickering effect
  flickerTimer += clock.getDelta(); // Increment timer
  if (flickerTimer > flickerCooldown) {
    flickeringLight.intensity = Math.random() * 2.5; // Random intensity between 0 and 2.5
    flickerCooldown = Math.random() * 1.5 + 0.3; // New random delay between 0.3s and 1.8s
    flickerTimer = 0; // Reset timer
  }

  // Random Blue Light Flicker Effect
  blueLights.forEach(light => {
    if (Math.random() > 0.98) {
      light.intensity = Math.random() * 1.5; // Random intensity flicker
    }
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
