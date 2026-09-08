var scene,camera,renderer;
let totoras = [];
let luzDir2;

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(0, 4, 8);
  camera.lookAt(0, 0, 0);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  

  configurarArrastre(renderer, function(movimiento){
      totoras.forEach(function(totora){
          totora.rotation.y += movimiento * 0.01;
      });
  });
  
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(luzAmbiental);

    luzDir2 = new THREE.DirectionalLight(0xffffff, 0.8); 
    luzDir2.position.set(10, 20, 10);
    scene.add(luzDir2);

  cargarModelo("planta.glb", 7, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 6, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 5, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 4, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 4, -1, 0, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 3, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 2, -1, 1, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});
  cargarModelo("planta.glb", 1, -1, 2, 0.7, 0.7, 0.7, 3,function(modelo){totoras.push(modelo)});

  crearAgua();
  cambiarAmbiente("noche");

}
function animate() {
  requestAnimationFrame(animate);
  actualizarAgua();
  totoras.forEach(totora => {
    totora.rotation.y += 0.01;
});
  renderer.render(scene, camera);
}
init();
animate();