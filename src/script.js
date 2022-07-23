import './style.css'
import * as THREE from 'three'
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// Variables
let camera, scene, sectionMeshes, renderer
// Vars for models
let model1,  model2, model3;
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Objects
const objects = [];

const objectsDistance = 5;

const parameters = {
  materialColor: 'purple'
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Load Models
function loadModel(url) {
  return new Promise(resolve => {
    new GLTFLoader().load(url, resolve);
  })
}




// Call init function
init();
// Init function
function init() {
    // Creating Scene
    scene = new THREE.Scene();


const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 2)

for(let i = 0; i < particlesCount; i++){
    //X
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    //Y
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 4
    //Z
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeomerty = new THREE.BufferGeometry()
particlesGeomerty.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Material 
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
//Point 
const particles = new THREE.Points(particlesGeomerty, particlesMaterial)
scene.add(particles)
   
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const ambient = new THREE.SpotLight('white', 5);
    ambient.castShadow = true;
    ambient.position.set(0, 100, 10)
    ambient.shadow.bias = -0.0001;
    ambient.shadow.mapSize.width = 1024 * 4;
    ambient.shadow.mapSize.height = 1024 * 4;
    scene.add(ambient);

    // Count Of objects
    const count = 3;
    
    // Loading Models
    let p1 = loadModel('/models/apple_iphone_13_pro_max/scene.gltf').then(result => {  model1 = result.scene.children[0]; });
    
    let p2 = loadModel('/models/apple_macbook_pro/scene.gltf').then(result => {  model2 = result.scene.children[0]; });
   
    let p3 = loadModel('models/web_development/scene.gltf').then(result => {  model3 = result.scene.children[0]; });

  

    // Return promise for render
  Promise.all([p1,p2, p3]).then(() => {
    
    for ( let i = 0; i < count; i ++ ) {
      
      const t = i / count * 2 * Math.PI;
      
      // X POSITION
      model1.position.x = 0
      
      model2.position.x = 0
      
      model3.position.x = 0
      
      model1.scale.set(0.5, 0.5, 0.5)
      
      model2.scale.set(0.05, 0.05, 0.05);

      model3.scale.set(0.4, 0.4, 0.4)


      //Setting object Position 
      model2.rotation.z = 3.8
      model2.rotation.x = -2
      model3.rotation.z = -1
      // model5.rotation.z = 1.6
      // model5.rotation.y = 1.6

      model3.position.y = -objectsDistance * .17
      model2.position.y = -objectsDistance * 1.3
      model1.position.y = -objectsDistance * 2.3
      // model1.position.y = -objectsDistance * 3
     
      sectionMeshes = [model3, model2, model1]
      scene.add(model3, model2, model1 )
      objects.push(model3, model2, model1);

      
    
    }
    
    
 });

 

    // Renderer
    renderer = new THREE.WebGLRenderer( { 
      antialias: true,
      canvas: canvas,
      //Seeing through canvas
      alpha: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.physicallyCorrectLights = true;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ReinhardToneMapping;
    // renderer.toneMappingExposure = 3
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFShadowMap
    document.body.appendChild( renderer.domElement );
    
}
//PLAIN JS------------------------

// STICKY NAV
window.onscroll = function() {stickyNav()};

var navbar = document.getElementById("appbar");
var scrollIcon = document.getElementById("scroll")

var sticky = navbar.offsetTop;

function stickyNav() {
  
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    scrollIcon.style.display = "none";
  } else {
    navbar.classList.remove("sticky");
    scrollIcon.style.display = "block";
  }
}
//-----------------------------
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameraGroup.add(camera)

// Resizing Event
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


// Listen for cursor
const cursor = {}
cursor.x = 0;
cursor.y = 0;

//  Scroll
let scrollY = window.scrollY

let currentSection = 0;

window.addEventListener('scroll', () => {
   
    scrollY = window.scrollY
    //Adding spin to objects on scroll
    const newSection = Math.round(scrollY / sizes.height);
    

    if(newSection != currentSection){
        currentSection = newSection
        //Animation for object
        gsap.to(
            sectionMeshes[currentSection].rotation, {
                duration: 1.5,
                ease: 'power2.inOut',
                // x: '+=1',
                // y: '+=3',
                z: '+=6.3'
            }
        )
    }

});

//Click
window.addEventListener('click', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5
    
});
// Mouse Move 
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = e.clientY / sizes.height - 0.5
});

// Clock for animate 
const clock = new THREE.Clock()
let previousTime = 0
//Setting value for different frame rates

const  animate = () => {
    
    // Elapse Time
    const elapsedTime = clock.getElapsedTime()
    // Delta time
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.y = -scrollY / sizes.height * objectsDistance

    renderer.render( scene, camera );
    window.requestAnimationFrame( animate );

}
animate();