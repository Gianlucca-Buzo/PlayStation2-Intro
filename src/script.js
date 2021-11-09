import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Vector3 } from 'three'

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

// Materials

const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color(0x0033cc)

// Mesh
const greenSphereGroup = new THREE.Group();
const blueSphereGroup = new THREE.Group();
const pinkSphereGroup = new THREE.Group();
const redSphereGroup = new THREE.Group();
const blueSphere = createSphere(blueSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshBasicMaterial({color: 0x0033cc}))
const greenSphere = createSphere(greenSphereGroup, new THREE.SphereBufferGeometry(.5, 16, 16),new THREE.MeshToonMaterial({color: 0x00cc33,emissive: 0x00cc33, emissiveIntensity: 10}))
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
camera.position.y = 10
camera.position.z = 30
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
 function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

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

tick()