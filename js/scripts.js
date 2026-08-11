import * as THREE from 'three';
import { cos } from 'three/tsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 1, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#hero-canvas');

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x5f5f5f } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
const light = new THREE.DirectionalLight(0xffffff,3);
light.position.set(-3, 3, 6);
scene.add(light);

camera.position.z = 200;

function animate( time ) {
  cube.rotation.x = time/5000;
  cube.rotation.y = time/1000;
  cube.position.x = Math.cos(time/200);
  renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

//---------------------- Non-3D related stuff
document.getElementById('nav-button').addEventListener('click', toggleNav);
function toggleNav() {
  const hamburger = document.getElementById('nav-wrapper');
  hamburger.classList.toggle('active-sidebar');
}