var scene,camera,renderer;
let tiempo = 0;
let luzDir2;
let barco, barco2;
function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 3.5, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  
  configurarArrastre(renderer, function(movimiento){
      if (barco2) barco2.rotation.y += movimiento * 0.01;
  });
  const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(luzAmbiental);
  luzDir2 = new THREE.DirectionalLight(0xffffff, 1.2); 
  luzDir2.position.set(10, 20, 10); 
  scene.add(luzDir2);
  const luzPunt = new THREE.PointLight(0xffffff, 0.5);
  luzPunt.position.set(0, 5, 5);
  scene.add(luzPunt);
  cargarModelo("planta.glb", -2, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 9, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, 0, -1, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", 8, 0, -3, 0.3, 0.3, 0.3, 3);
  cargarModelo("planta.glb", -1.5, 0, -3, 0.3, 0.3, 0.3, 3);
  cargarModelo("barcoDoble.glb",3.5, -0.5, 1,2.3, 2.3, 2.3,5.5,function(modelo){barco2 = modelo;});
  cargarModelo("barco3.glb",-20, 0, -6,0.8, 0.7, 0.7,3,function(modelo){barco = modelo;});
  crearAgua();
  cambiarAmbiente("noche");
}
function animate() {
  requestAnimationFrame(animate);
  tiempo += 0.02;
  actualizarAgua();
  if (barco) {
  barco.position.x += 0.08;
  barco.position.y = 0 + Math.sin(tiempo * 2) * 0.08;
  if (barco.position.x > 30) {
    barco.position.x = -18;
  }
}
if(barco2){
    barco2.rotation.y += 0.01;
}
  renderer.render(scene, camera);
}
init();
animate();