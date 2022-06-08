import './style.css'

import * as THREE from "three";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, window.innerWidth/window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#cover"),alpha:true,
});
const controls = new OrbitControls(camera, renderer.domElement)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(1000);

renderer.render(scene,camera);


/////

var loader = new STLLoader()
loader.load(
    'models/case.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:0x080a0d}))
        mesh.rotateX(Math.PI);
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

loader = new FontLoader();

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const geometry = new TextGeometry( 'Hello three.js!', {
		font: font,
		size: 7,
		height: 1,
		curveSegments: 12,

	} );
    geometry.computeBoundingBox();
    const txtMesh = new THREE.Mesh(geometry,[new THREE.MeshStandardMaterial({color:0xe0e0e0}),new THREE.MeshStandardMaterial({color:0x999999})]);
    txtMesh.rotateX(-Math.PI/2);
    txtMesh.position.y = 1.5;
    txtMesh.position.x = new THREE.Box3().setFromObject( txtMesh ).max.x/2*-1;
    txtMesh.position.z = new THREE.Box3().setFromObject( txtMesh ).max.z/2*-1;


    scene.add(txtMesh);
} );

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight,pointLight);

function animate(){
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

animate();