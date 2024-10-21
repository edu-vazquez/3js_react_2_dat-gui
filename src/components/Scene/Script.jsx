import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

//Global variables
let currentRef = null;

let gui = new dat.GUI;

/* EJEMPLO
const objetos3D = {
  cubos: 2
}

gui.add(objetos3D, 'cubos')
  .min(1)
  .max(10)
  .step(1)
  .name('No. de cubos')
  .onFinishChange(()=>{
    console.log(objetos3D.cubos)
  })
*/

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100)

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// CUBE
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ wireframe: true})
);
scene.add(cube);

// CUBE GUI
const cubeAux = {
  scaleXYZ: 1,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  color: 0xffffff,
  segments: 1,
};

const positions = gui.addFolder("Positions")
positions.add(cube.position, 'x')
  .min(-1)
  .max(1)
  .step(0.05)
  .name("position x");

positions.add(cube.position, 'y')
  .min(-1)
  .max(1)
  .step(0.05)
  .name("position y");

positions.add(cube.position, 'z')
  .min(-1)
  .max(1)
  .step(0.05)
  .name("position z");

const scale = gui.addFolder("Scale");
const scaleXYZ = scale.addFolder('X, Y, Z')
scaleXYZ.add(cubeAux, 'scaleX')
  .min(-1)
  .max(2)
  .step(0.05)
  .name('Scale x')
  .onChange(()=>{
    cube.scale.x = cubeAux.scaleX;
  });
scaleXYZ.add(cubeAux, 'scaleY')
  .min(-1)
  .max(2)
  .step(0.05)
  .name('Scale y')
  .onChange(()=>{
    cube.scale.y = cubeAux.scaleY;
  });
scaleXYZ.add(cubeAux, 'scaleZ')
  .min(-1)
  .max(2)
  .step(0.05)
  .name('Scale z')
  .onChange(()=>{
    cube.scale.z = cubeAux.scaleZ;
  });


scale.add(cubeAux, 'scaleXYZ', {'small': 0.5, 'medium': 1, 'big': 2})
  .onChange(() => {
    cube.scale.setScalar(cubeAux.scaleXYZ);
    cubeAux.scaleX = cubeAux.scaleXYZ;
    cubeAux.scaleY = cubeAux.scaleXYZ;
    cubeAux.scaleZ = cubeAux.scaleXYZ;
  });

const color = gui.addFolder("Color")
color.addColor(cubeAux, 'color')
  .onChange(() => {
  cube.material.color.set(cubeAux.color);
});

const segments = gui.addFolder("Segments")
segments.add(cubeAux, 'segments')
  .min(1).max(10)
  .name("segments")
  .step(1)
  .onChange(() => {
    cube.geometry.dispose(); // Liberar recursos de la geometría
    cube.geometry = new THREE.BoxGeometry(
      cubeAux.scaleX,
      cubeAux.scaleY,
      cubeAux.scaleZ,
      cubeAux.segments,
      cubeAux.segments,
      cubeAux.segments,
    );  
});


//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.traverse((object) => {
    // Limpiar geometrías
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Limpiar materiales
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    // Limpiar texturas
    if (object.material && object.material.map) {
      object.material.map.dispose();
    }

    if (gui) {
      gui.destroy(); // Esto destruye la GUI
      gui = null;    // Elimina la referencia
    }

  });
  currentRef.removeChild(renderer.domElement);
};
