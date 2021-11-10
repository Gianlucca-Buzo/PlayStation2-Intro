import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { MeshBasicMaterial, SphereGeometry, TextureFilter, Vector3 } from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShaders } from 'three/examples/js/shaders/FXAAShader';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import  {Smoke } from "./smoke"

// Debug
const gui = new dat.GUI()

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


//Helpers
scene.add(new THREE.PointLightHelper(pointLight, 1));
scene.add(new THREE.GridHelper(50, 50));
scene.fog = new THREE.FogExp2(0x03544e, 0.001);

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


//Cloud
// let smokeMaterial,h, w, smokeParticles = [];
// const loader = new THREE.TextureLoader();

// loader.crossOrigin = '';

// loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/82015/blue-smoke.png',
//     function onLoad(texture) {
//         const smokeGeo = new THREE.PlaneBufferGeometry(300, 300);

//         smokeMaterial = new THREE.MeshLambertMaterial({
//             map: texture,
//             transparent: true
//         });

//         for (let p = 0, l = 350; p < l; p++) {
//             let particle = new THREE.Mesh(smokeGeo, smokeMaterial);

//             particle.position.set(
//                 Math.random() * 500 - 250,
//                 Math.random() * 500 - 250,
//                 Math.random() * 1000 - 100
//             );

//             particle.rotation.z = Math.random() * 360;
//             scene.add(particle);
//             smokeParticles.push(particle);
//         }

//     }
// );




//Fog
// let smokeParticles = []
// addParticles();
// addBackground();


// let cloudParticles = [];
// let loader = new THREE.TextureLoader();
// loader.load("blue_fog.png", function(texture){
//     let cloudGeo = new THREE.PlaneBufferGeometry(100,100);
//     let cloudMaterial = new THREE.MeshLambertMaterial({
//     map:texture,
//     transparent: true
// });
//     for(let p=0; p<50; p++) {
//         let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
//         cloud.position.set(1+p ,0,1+p
//         );
//     cloud.rotation.x = 1.16;
//     cloud.rotation.y = -0.12;
//     cloud.rotation.z = Math.random()*2*Math.PI;
//     cloud.material.opacity = 0.55;
//     cloudParticles.push(cloud);
//     scene.add(cloud);
//   }
// });
// loader.load("blue_fog.png", function(texture){
//     let cloudGeo = new THREE.PlaneBufferGeometry(500,500);
//     let cloudMaterial = new THREE.MeshLambertMaterial({
//         map: texture,
//         transparent: true,
//     })

//     for( let i = 0 ; i<50; i++){
//         let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
//         // cloud.position.set(Math.random()*800-400, 500, Math.random() * 500 - 500);
//         cloud.position.set(i,0,0);
//         cloud.rotation.x = 1.16;
//         cloud.rotation.y = -0.12;
//         cloud.rotation.z = Math.random()*2*Math.PI;
//         cloud.material.opacity = 0.55;
//         scene.add(cloud);
//     }
// });


//Bloom
// const renderScene = new RenderPass()
	
// const effectFXAA = new ShaderPass( THREE.FXAAShaders )
// // effectFXAA.uniforms.resolution.value.set( 1 / window.innerWidth, 1 / window.innerHeight )
	
// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
// bloomPass.threshold = 0.21
// bloomPass.strength = 1.2
// bloomPass.radius = 0.55
// bloomPass.renderToScreen = true
	
// const composer = new EffectComposer( renderer )
// composer.setSize( window.innerWidth, window.innerHeight )
	
// composer.addPass( renderScene )
// composer.addPass( effectFXAA )
// composer.addPass( bloomPass )
	
// renderer.gammaInput = true
// renderer.gammaOutput = true
// renderer.toneMappingExposure = Math.pow( 0.9, 4.0 ) 

//

/**
 * Animate
 */

const clock = new THREE.Clock()

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


    // evolveSmoke(clock.getDelta());
    
    // camera.layers.set(1);
    // composer.render();
    
    // renderer.clearDepth();
    // camera.layers.set(0);

    // Update Orbital Controls
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
    sphereGroup.add(sphere);
    scene.add(sphereGroup);
}

function createBox(boxGroup, boxGeometry){
    const material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.30, reflectivity: 1.0})
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

function addParticles() {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load('https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/clouds.png', texture => {
      const smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        map: texture,
        transparent: true
      });
      smokeMaterial.map.minFilter = THREE.LinearFilter;
      const smokeGeometry = new THREE.PlaneBufferGeometry(30, 30);

      const smokeMeshes = [];
      let limit = 30;

      while(limit--) {
        smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
        smokeMeshes[limit].position.set(Math.random() * (30-1) + 1, 0, 0);
        smokeMeshes[limit].rotation.z = 0.1;
        smokeParticles.push(smokeMeshes[limit]);
        scene.add(smokeMeshes[limit]);
      }
    });
  }

  function addBackground() {
    const textureLoader = new THREE.TextureLoader();
    const textGeometry = new THREE.PlaneBufferGeometry(10, 10);

    textureLoader.load('https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/background.jpg', texture => {
      const textMaterial = new THREE.MeshLambertMaterial({
        blending: THREE.AdditiveBlending,
        color: 0xffffff,
        map: texture,
        opacity: 1,
        transparent: true
      });
      textMaterial.map.minFilter = THREE.LinearFilter;
      const text = new THREE.Mesh(textGeometry, textMaterial);

      text.position.z = 0;
      scene.add(text);
    });
  }

  function evolveSmoke(delta) {

    let smokeParticlesLength = smokeParticles.length;

    while(smokeParticlesLength--) {
      smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
    }
  }

tick()