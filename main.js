// Reduced Flickering Lights around Mjolnir
const flickeringLights = [];
const lightCount = 5; // Reduced to half
const lightRadius = 10;

for (let i = 0; i < lightCount; i++) {
  const angle = (i / lightCount) * Math.PI * 2;
  const x = mjolnirPosition.x + Math.cos(angle) * lightRadius;
  const z = mjolnirPosition.z + Math.sin(angle) * lightRadius;
  const y = mjolnirPosition.y + 2 + Math.random() * 2;

  const light = new THREE.PointLight(0x33ccff, 0, 20); // Lightning blue
  light.position.set(x, y, z);
  scene.add(light);
  flickeringLights.push(light);
}

// Yellow-Orange Orbiting Particles
const particleCount = 6000; // Number of particles
const particlesGeometry = new THREE.BufferGeometry();
const positions = [];
const velocities = [];

for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 45 + 5; // Adjusted range 5 to 50
  const y = Math.random() * 12 + 2;

  positions.push(
    Math.cos(angle) * distance + mjolnirPosition.x,
    y,
    Math.sin(angle) * distance + mjolnirPosition.z
  );
  velocities.push(0.002 * (Math.random() > 0.5 ? 1 : -1)); // Random angular velocity
}

particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffaa33,
  size: 0.25,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
