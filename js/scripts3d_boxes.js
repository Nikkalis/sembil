import * as THREE from 'three';
import { cos } from 'three/tsl';

const boxes = document.querySelectorAll('.modgrid_item');
console.log("MAKING 3D BOX");
console.log(boxes);
for (let box of boxes) {
    console.log(box);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(1, box.offsetWidth / box.offsetHeight, 0.1, 1000);

    const canvas = document.createElement('canvas');
    box.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });
    renderer.setSize(box.offsetWidth, box.offsetHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 3, 6);
    scene.add(light);

    camera.position.z = 200;
}