import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, model, mixer;
const clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -1, 2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    loadModel();

    window.addEventListener('resize', onWindowResize);
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('./Roger.glb', function (gltf) {
        model = gltf.scene;

        // Adjust Position & Scale
        model.position.set(0, -1.05, 0.9);
        model.scale.set(3, 3, 3); // Small size

        scene.add(model);

        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y +=0.01;
    }

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}


init();
animate();