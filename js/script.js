AOS.init();

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('nav-list');
hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
});

// Close menu on link click (mobile UX)
document.querySelectorAll('#nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navList.classList.remove('active');
        }
    });
});

// Three.js Background Effect
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('bg-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create particles
    createParticles();
    
    // Create floating geometric shapes
    createFloatingShapes();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Mouse movement listener
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Window resize listener
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
}

function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        
        // Update only the color values to #8c00ff
        colors[i * 3] = 140/255;     // Red (0x8c)
        colors[i * 3 + 1] = 0/255;   // Green (0x00)
        colors[i * 3 + 2] = 255/255; // Blue (0xff)
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function createFloatingShapes() {
    const hexGeometry = new THREE.CylinderGeometry(15, 15, 5, 6);
    const hexMaterial = new THREE.MeshPhongMaterial({
        color: 0x944bf3, // Update hex color
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    
    const hex1 = new THREE.Mesh(hexGeometry, hexMaterial);
    hex1.position.set(-50, 0, -50);
    hex1.rotation.x = Math.PI / 2;
    scene.add(hex1);
    
    const hex2 = new THREE.Mesh(hexGeometry, hexMaterial);
    hex2.position.set(50, 0, -50);
    hex2.rotation.x = Math.PI / 2;
    scene.add(hex2);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (particleSystem) {
        particleSystem.rotation.x = time * 0.1 + mouseY;
        particleSystem.rotation.y = time * 0.05 + mouseX;
    }
    
    scene.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            child.position.y += Math.sin(time + index) * 0.1;
        }
    });
    
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', init);

// Keep existing fade-in and menu code
document.addEventListener("DOMContentLoaded", function() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15
    };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }
});
