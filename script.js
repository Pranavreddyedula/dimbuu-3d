const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.setZ(8);

// LIGHTING
const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5, 5, 5);
scene.add(light);

// TEXTURE LOADER
const loader = new THREE.TextureLoader();

const textures = [
  loader.load('menu1.jpg'),
  loader.load('menu2.jpg')
];

const planes = [];

// CREATE FLOATING CARDS
textures.forEach((texture, i) => {
  const geometry = new THREE.PlaneGeometry(4, 2.5);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.5,
    metalness: 0.3
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = (i - 0.5) * 6;
  mesh.position.y = 0;
  mesh.position.z = -2;

  scene.add(mesh);
  planes.push(mesh);
});

// PARTICLES BACKGROUND
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;

const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++){
  posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// MOUSE MOVE EFFECT
document.addEventListener('mousemove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  camera.position.x = x * 2;
  camera.position.y = -y * 2;
});

// CLICK ZOOM EFFECT
window.addEventListener('click', () => {
  planes.forEach(p => {
    p.scale.set(1.2, 1.2, 1.2);
    setTimeout(() => p.scale.set(1,1,1), 300);
  });
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  planes.forEach((p, i) => {
    p.rotation.y += 0.01;
    p.position.y = Math.sin(Date.now() * 0.001 + i) * 1.2;
  });

  particlesMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();

// RESIZE FIX
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
