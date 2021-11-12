import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'dat.gui'
import { MeshBasicMaterial, SphereGeometry, TextureFilter, TextureLoader, Vector3 } from 'three'
import  {Smoke } from "./smoke"
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';



// Gui
var animationConfig = {restartSound: false,restartAnimation: false}
animationConfig.restartSound = async function(){
    play();
    return;
}

animationConfig.restartAnimation = async function(){
    startCameraAnimation()
    return;
}

const gui = new dat.GUI()
const folder = gui.addFolder("Animation");
folder.add(animationConfig,"restartSound");
folder.add(animationConfig,"restartAnimation");


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const sphereGeometry = new THREE.SphereBufferGeometry(.5, 16, 16);
const point = new THREE.Vector3(0,0,0);
const boxGeometry = new THREE.BoxGeometry(5,5,5);

// Materials
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0x0033cc)


// Mesh
const boxesGroup = new THREE.Group();
const box1 = createBox(boxesGroup,boxGeometry);
const box2 = createBox(boxesGroup,boxGeometry);
const box3 = createBox(boxesGroup,boxGeometry);
const box4 = createBox(boxesGroup,boxGeometry);
const box5 = createBox(boxesGroup,boxGeometry);
positionBoxes();

const greenSphereGroup = new THREE.Group();
const blueSphereGroup = new THREE.Group();
const pinkSphereGroup = new THREE.Group();
const redSphereGroup = new THREE.Group();
const greenSphere = createSphere(greenSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshBasicMaterial({color: 0x00cc33}))
const blueSphere = createSphere(blueSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshBasicMaterial({color: 0x0033cc}))
const pinkSphere = createSphere(pinkSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshBasicMaterial({color: 0xff66ff}))
const redSphere = createSphere(redSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshBasicMaterial({color: 0xcc0033}))


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 1
pointLight.position.z = 15
scene.add(pointLight)

// const pointLight2 = new THREE.PointLight(0xffffff, 1)
// pointLight2.position.x = 2
// pointLight2.position.y = 1
// pointLight2.position.z = 30
// scene.add(pointLight2)

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);


//Helpers
// scene.add(new THREE.PointLightHelper(pointLight, 1));
// scene.add(new THREE.GridHelper(50, 50));
// scene.fog = new THREE.FogExp2(0x03544e, 0.001);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 45
camera.position.z = 0
camera.rotation.set(-1.5,0,0)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Sound
function play(){
    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'background_audio.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
    });
}
// play();

/**
 * Animate
 */

const clock = new THREE.Clock()

var cameraY = camera.position.y;
var cameraX = camera.position.x;
var cameraZ = camera.position.z;
var cameraClock = new THREE.Clock();

var playstationFlag = false;
var sonyFlag = false;

//Text
var sonyText;
var playstationText;

function startCameraAnimation(){
    cameraClock = new THREE.Clock();
    play();
    if(sonyFlag){
        scene.remove(sonyText);
        sonyFlag = false;
    }
    if(playstationFlag){
        scene.remove(playstationText);
        playstationFlag = false;
    }
}

startCameraAnimation();


const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    greenSphereGroup.rotation.y = elapsedTime* 0.5;
    blueSphereGroup.rotation.y = elapsedTime*0.5+1.5;
    pinkSphereGroup.rotation.y = elapsedTime*0.5+3;
    redSphereGroup.rotation.y = elapsedTime*0.5+4.5;
    box1.rotation.y = elapsedTime*0.5;
    box2.rotation.y = elapsedTime*0.5;
    box3.rotation.y = elapsedTime*0.5;
    box4.rotation.y = elapsedTime*0.5;
    box5.rotation.y = elapsedTime*0.5;
    box1.rotation.x = elapsedTime*0.5;
    box2.rotation.x = elapsedTime*0.5;
    box3.rotation.x = elapsedTime*0.5;
    box4.rotation.x = elapsedTime*0.5;
    box5.rotation.x = elapsedTime*0.5;

    var cameraElapsedTime = cameraClock.getElapsedTime()*2;
    
    
    //Creates Sony Text
    if(cameraElapsedTime <= 5){
        camera.position.set(cameraX,cameraY - cameraElapsedTime, cameraZ);
        if(!sonyFlag){
            startSonyFont();
            sonyFlag = true;
        }
    }else{
        //Removes Sony Text
        if(cameraElapsedTime <= 7.5){
            camera.position.set(cameraX,cameraY - cameraElapsedTime, cameraZ);
            if(sonyFlag){
                scene.remove(sonyText);
                sonyFlag = false;
            }
        }else{
            //Stops the camera after the time
            if(cameraElapsedTime <= 28){
                camera.position.set(cameraX,cameraY - cameraElapsedTime, cameraZ);
            }else{
                startPlaystationFont();
            }
        }
    }
    controls.update()
    // Render
    renderer.render(scene, camera)
    

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    // window.requestAnimationFrame(rotateAboutPoint(sphere,point,new THREE.Vector3(0, 1, 0),.5,false))
}

function createSphere(sphereGroup,sphereGeometry,material){
    const sphere = new THREE.Mesh(sphereGeometry,material);
    sphere.position.set(15, 0, 0);
    sphere.scale.setScalar(0.8);
    sphere.material.blending = THREE.AdditiveBlending;
    sphereGroup.add(sphere);
    scene.add(sphereGroup);
}

function createBox(boxGroup, boxGeometry){
    const material = new THREE.MeshBasicMaterial({color: 0x4282CB, transparent: true, opacity: 0.20, reflectivity: 1.0})
    const box = new THREE.Mesh(boxGeometry,material);
    box.position.set(0, 0, 0);
    box.scale.setScalar(0.8);
    boxGroup.add(box);
    scene.add(boxGroup);
    return box;
}

function positionBoxes(){
    //Top Left
    box1.position.set(-20,10,-17);
    box1.rotation.set(1,1,1);

    //Top Right
    box2.position.set(10,10,-15);
    box2.rotation.set(1,0,1);

    //Bottom Left
    box3.position.set(-17,10,10);
    box3.rotation.set(1,1,0);

    //Bottom Right
    box4.position.set(16,10,10);
    box4.rotation.set(1,1.5,1);

    box5.position.set(-8,10,-8);
    box5.rotation.set(1,1,0.5);
    
}

function startPlaystationFont(){
    const fontLoader = new TTFLoader();
    fontLoader.load("PlaystationFont.ttf", function (json){
        const textGeometry = new TextGeometry("Playstation 2",{
            font: new Font(json),
            size: 3,
            height: 0
        })
        playstationText = new THREE.Mesh(textGeometry, new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xb4b4b4}));
        playstationText.rotation.set(4.75,0,0);
        playstationText.position.set(-10,0,0);
        scene.add(playstationText);
    });
}

function startSonyFont(){
    const fontLoader = new TTFLoader();
    fontLoader.load("Sony_Font.ttf", function (json){
        const textGeometry = new TextGeometry("Sony Computer Entertainment",{
            font: new Font(json),
            size: 2,
            height: 0.0
        })
        sonyText = new THREE.Mesh(textGeometry, new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xb4b4b4}));
        sonyText.rotation.set(4.75,0,0);
        sonyText.position.set(-20,15,0);
        scene.add(sonyText);
    });
}

tick();