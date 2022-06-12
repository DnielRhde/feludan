import './style.css'

import * as THREE from "three";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(10, (document.getElementById("cover").offsetWidth)/document.getElementById("cover").offsetHeight, 0.01, 1000000000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#cover"),alpha:true,antialias:true,
});
const controls = new OrbitControls(camera, renderer.domElement);
const maxx = 71.3/2+1;
const maxz = 148.6/2+1;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
var latestObj;
var latestObjPos;
var mousedown = false;
var texter = {
    0:{"text":"hejsa","position":{"x":0,"z":0}},
    1:{"text":"v2","position":{"x":0,"z":0}},
};

////public variabler
export {scene};
export {latestObj};
export {createText};
export {texter};


//////

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(document.getElementById("cover").offsetWidth, document.getElementById("cover").offsetHeight);
camera.position.setY(800);
camera.rotateX(Math.PI/2*-1);

renderer.render(scene,camera);

function createModel(){
    var loader = new STLLoader();

    loader.load(
        'models/case.stl',
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:0x080a0d}))
            mesh.rotateX(Math.PI);
            mesh.name = "planede";
            scene.add(mesh);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
}
createModel();


function createText(indx){
    const loader = new FontLoader()

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        console.log(indx);
        console.log(texter[indx]);
        const geometry = new TextGeometry( texter[indx].text, {
            font: font,
            size: 7,
            height: 0.5,
        } );
        geometry.computeBoundingBox();
        const txtMesh = new THREE.Mesh(geometry,[new THREE.MeshStandardMaterial({color:0xe0e0e0}),new THREE.MeshStandardMaterial({color:0x999999})]);
        txtMesh.rotateX(-Math.PI/2);
        txtMesh.name = "aa";
        const bounds = new THREE.Box3().setFromObject( txtMesh ).max;
        txtMesh.position.x = bounds.x/2*-1;
        txtMesh.position.z = 7/2;
        txtMesh.position.y = bounds.y/2*-1;

        const bound = new THREE.BoxBufferGeometry(bounds.x, bounds.z,7);
        const boundmat = new THREE.MeshBasicMaterial();
        boundmat.transparent = true;
        boundmat.opacity = 0.0;
        const cube = new THREE.Mesh(bound, boundmat);
        cube.position.y = bounds.y/2+1.5;

        cube.name = "text"+indx;
        cube.add(txtMesh);

        console.log(texter);
        cube.position.x = texter[indx].position.x;
        cube.position.z = texter[indx].position.z;

        scene.add(cube);
    } );
}

for (let i = 0; i < Object.keys(texter).length; i++) {
    createText(i);
}




const pointLight = new THREE.PointLight(0xffffff);
const pointLight2 = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);


pointLight.position.y=1000;
pointLight.position.x=37.5;
pointLight.position.z=75;
pointLight.intensity=1.3;
pointLight2.intensity=2;


scene.add(pointLight2);
scene.add(pointLight);
scene.add(ambientLight);


let x = maxx*-1; let y = maxz*-1; let width = maxx*2; let height = maxz*2; let radius = 10
        
let shape = new THREE.Shape();
shape.moveTo( x, y + radius );
shape.lineTo( x, y + height - radius );
shape.quadraticCurveTo( x, y + height, x + radius, y + height );
shape.lineTo( x + width - radius, y + height );
shape.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
shape.lineTo( x + width, y + radius );
shape.quadraticCurveTo( x + width, y, x + width - radius, y );
shape.lineTo( x + radius, y );
shape.quadraticCurveTo( x, y, x, y + radius );

const geometryEdge = new THREE.ShapeBufferGeometry( shape );
geometryEdge.rotateX(Math.PI/2);


////plane
const geometry = new THREE.PlaneGeometry( maxx*2*5, maxz*2*5 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, opacity:0, transparent:true} );
const plane = new THREE.Mesh( geometry, material );
plane.name = "planee";
plane.rotateX(Math.PI/2);
plane.position.y = 1.5;

const materialEdge = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, opacity:0,transparent:true} );
const planeEdge = new THREE.Mesh( geometryEdge, materialEdge );
///tilføh edge
const edges = new THREE.EdgesGeometry( geometryEdge );
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x32CD32 } ) );
//
planeEdge.position.y = 1.5;
line.position.y=1.5+1;
planeEdge.name = "pl";
line.name = "line";
scene.add( planeEdge );
scene.add( line );
scene.add(plane);



function mouseMove( event ) {
	pointer.x = ( event.clientX / document.getElementById("cover").offsetWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / document.getElementById("cover").offsetHeight ) * 2 + 1;
    if(mousedown == true){
        if(latestObj != null){
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            for (let i = 0; i < intersects.length; i++) {
                if(intersects[i].object.name == "planee"){

                    var helper = new THREE.BoxHelper(scene.getObjectByName(latestObj.object.name), 0xff0000);

                    var centerx = intersects[i].point.x;
                    var centerz = intersects[i].point.z;
                    scene.getObjectByName("line").visible = false;
                    if(centerx > 0){
                        if(centerx < maxx-helper.object.geometry.boundingBox.max.x){
                            scene.getObjectByName(latestObj.object.name).position.x = centerx;
                        }else{
                            scene.getObjectByName("line").visible = true;
                        }
                    } else{
                        if(centerx > maxx*-1+helper.object.geometry.boundingBox.max.x){
                            scene.getObjectByName(latestObj.object.name).position.x = centerx;
                        } else{
                            scene.getObjectByName("line").visible = true;
                        }
                    }
                    if(centerz > 0){
                        console.log(helper.object.geometry.boundingBox.max.y)
                        if(centerz < maxz-helper.object.geometry.boundingBox.max.z){
                            scene.getObjectByName(latestObj.object.name).position.z = centerz+helper.object.geometry.boundingBox.max.y/2;
                        }else{
                            scene.getObjectByName("line").visible = true;
                        }
                    } else{
                        if(centerz > maxz*-1+helper.object.geometry.boundingBox.max.z){
                            scene.getObjectByName(latestObj.object.name).position.z = centerz+helper.object.geometry.boundingBox.max.y/2;
                        }else{
                            scene.getObjectByName("line").visible = true;
                        }
                    }
                    
                }
            }
        }
    }
}
function mouseDown( event ) {
    
    mousedown = true;
    pointer.x = ( event.clientX / document.getElementById("cover").offsetWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / document.getElementById("cover").offsetHeight ) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    latestObjPos = null;
    latestObj=null;
    var noRotate = false;
    console.log(intersects);
    for (let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.name.includes("text")){
            latestObj = intersects[i];
            console.log(intersects[0]);
            var x1=intersects[i].point.x-intersects[i].object.position.x;
            var y1=intersects[i].point.y-intersects[i].object.position.y;
            var z1=intersects[i].point.z-intersects[i].object.position.z;
            latestObjPos = [x1,y1,z1];
        }

        if(intersects[i].object.name == "pl"){
            noRotate=true;
        }
    }

    console.log(noRotate);
    if(noRotate == false){
        controls.enableRotate = true;
    } else{
        controls.enableRotate = false;
    }

}
function mouseUp( event ) {
    mousedown = false;

    if(latestObj){
        const specifiedIndex = latestObj.object.name.split("text")[1];
        texter[specifiedIndex].position.x = latestObj.object.position.x;
        texter[specifiedIndex].position.z = latestObj.object.position.z;
    }
}

/////////////adding all scene objects to scene at once.


console.log(scene);
//////////////////

function animate(){
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

document.getElementById('cover').addEventListener('mousemove', mouseMove);
document.getElementById('cover').addEventListener('mousedown', mouseDown);
document.getElementById('cover').addEventListener('mouseup', mouseUp);

animate();