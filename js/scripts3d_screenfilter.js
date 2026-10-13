import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { degToRad } from 'three/src/math/MathUtils.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#screen_filter');

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: canvas });

const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
	 1.0,  1.0,  1.0, // v3
	-1.0,  1.0,  1.0, // v4
	-1.0, -1.0,  1.0  // v5
] );
camera.position.z = 10;
// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

const texture = new THREE.TextureLoader().load( '../static/textures/water1normal.jpg' );
const water = new Water(geometry, {
    waterNormals: texture,
    waterColor: 0xff00ff
});
water.rotateX(degToRad(-70));
water.position.y = -1;
scene.add(water);

const composer = new EffectComposer(renderer);
// adding some passes
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
// const shaderPass = new ShaderPass();
// composer.addPass(shaderPass);
const outputPass = new OutputPass()
// composer.addPass(outputPass);
// function animate() {
//     composer.render(); // instead of renderer.render()
// }
// renderer.setAnimationLoop(animate);