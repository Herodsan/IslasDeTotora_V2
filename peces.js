var scene,camera,renderer;
let moviendoMouse = false;
let ultimaX = 0;
let luzDir2;
let grupoIsla;
let water = null;
const loader = new THREE.GLTFLoader();

let mixers = [];
let clock = new THREE.Clock();

function cargarModelo(ruta, x, y, z, sx, sy, sz, rotY = 0, callback = null) {
  loader.load(ruta, function(gltf) {
    const modelo = gltf.scene;
    modelo.position.set(x, y, z);
    modelo.scale.set(sx, sy, sz);
    modelo.rotation.y = rotY;

    if (gltf.animations && gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(modelo);
      gltf.animations.forEach((clip) => {
        const accion = mixer.clipAction(clip);
        accion.setLoop(THREE.LoopRepeat);
        accion.play();
      });
      mixers.push(mixer);
    }
    if(callback){
      callback(modelo, gltf);
    } else {
      scene.add(modelo);
    }
  });
}

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  

  renderer.domElement.addEventListener("mousedown", function(event){
      moviendoMouse = true;
      ultimaX = event.clientX;
  });
  renderer.domElement.addEventListener("mouseup", function(){
      moviendoMouse = false;
  });
  renderer.domElement.addEventListener("mousemove", function(event){
      if(moviendoMouse && grupoIsla){
          let movimiento = event.clientX - ultimaX;
          grupoIsla.rotation.y += movimiento * 0.01;
          ultimaX = event.clientX;
      }
  });

  renderer.domElement.addEventListener("touchstart", function(event){
      moviendoMouse = true;
      ultimaX = event.touches[0].clientX;
  }, { passive: true });

  renderer.domElement.addEventListener("touchmove", function(event){
      if(moviendoMouse && grupoIsla){
          let nuevaX = event.touches[0].clientX;
          let movimiento = nuevaX - ultimaX;
          grupoIsla.rotation.y += movimiento * 0.01;
          ultimaX = nuevaX;
      }
      event.preventDefault();
  }, { passive: false });

  renderer.domElement.addEventListener("touchend", function(){
      moviendoMouse = false;
  });

  renderer.domElement.style.touchAction = "none";

    const luzAmbiental = new THREE.AmbientLight(0xffffff, 3);
    scene.add(luzAmbiental);

    luzDir2 = new THREE.DirectionalLight(0xffffff, 0.8); 
    luzDir2.position.set(10, 20, 10);
    scene.add(luzDir2);

    grupoIsla = new THREE.Group();
    scene.add(grupoIsla);

    cargarModelo("99ezanimation.glb", 3.5, 0, 0, 1, 1, 1, -98 * Math.PI / 180, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });
    cargarModelo("99ezanimation.glb", 3.5, 0.3, 0, 1, 1, 1, 50 * Math.PI / 180, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });
    cargarModelo("99ezanimation.glb", 3.5, 0.3, 0, 1, 1, 1, 180 * Math.PI / 180, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });


    cargarModelo("pez3.glb", 2.5, -0.4, 1.5, 1, 1, 1, 0, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });
    cargarModelo("pez3.glb", 4.0, -0.4, -1.0, 1, 1, 1, 150 * Math.PI / 180, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });
    cargarModelo("pez3.glb", 1.5, -0.4, -2.0, 1, 1, 1, 250 * Math.PI / 180, function(modeloCargado) {
      grupoIsla.add(modeloCargado);
    });

  
  cambiarAmbiente("noche");

}
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixers.forEach((mixer) => mixer.update(delta));

  if (water) {
    water.material.uniforms['time'].value += 0.6 / 60.0;
  }
  if (grupoIsla) {
    grupoIsla.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}
init();
animate();