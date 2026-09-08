var scene,camera,renderer;
let luzDir2;
let grupoIsla = null;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  

  configurarArrastre(renderer, function(movimiento){
      if (grupoIsla) grupoIsla.rotation.y += movimiento * 0.01;
  });

    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(luzAmbiental);

    luzDir2 = new THREE.DirectionalLight(0xffffff, 0.8); 
    luzDir2.position.set(10, 20, 10);
    scene.add(luzDir2);

    const luzPunt = new THREE.PointLight(0xffffff, 0.5);
    luzPunt.position.set(0, 5, 5);
    scene.add(luzPunt);
  
    cargarModelo("islaArco.glb", 3.5, 0.3, 0, 0.8, 0.8, 0.8, -98 * Math.PI / 180, function(modeloCargado) {
      grupoIsla = modeloCargado;
    });

  crearAgua();
  cambiarAmbiente("noche");
}
function animate() {
  requestAnimationFrame(animate);
  actualizarAgua();
  if (grupoIsla) {
    grupoIsla.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}
init();
animate();