const loader = new THREE.GLTFLoader();

function cargarModelo(ruta, x, y, z, sx, sy, sz, rotY = 0, callback = null) {
  loader.load(ruta, function(gltf) {
    const modelo = gltf.scene;
    modelo.position.set(x, y, z);
    modelo.scale.set(sx, sy, sz);
    modelo.rotation.y = rotY;
    scene.add(modelo);
    if (callback) callback(modelo);
  });
}

let water;
function crearAgua() {
  const aguaGeometry = new THREE.PlaneGeometry(200, 200);
  water = new THREE.Water(aguaGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
          'https://threejs.org/examples/textures/waternormals.jpg',
          function (textura) {
              textura.wrapS = textura.wrapT = THREE.RepeatWrapping;
          }
      ),
      sunDirection: luzDir2.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x0e2a3d,
      distortionScale: 1.8,
      fog: scene.fog !== undefined
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.1;
  scene.add(water);
}

function actualizarAgua() {
  if (water) {
    water.material.uniforms['time'].value += 0.6 / 60.0;
  }
}

function configurarArrastre(renderer, onArrastrar) {
  let moviendoMouse = false;
  let ultimaX = 0;

  renderer.domElement.addEventListener("mousedown", function(event){
      moviendoMouse = true;
      ultimaX = event.clientX;
  });
  renderer.domElement.addEventListener("mouseup", function(){
      moviendoMouse = false;
  });
  renderer.domElement.addEventListener("mousemove", function(event){
      if (moviendoMouse) {
          onArrastrar(event.clientX - ultimaX);
          ultimaX = event.clientX;
      }
  });
  renderer.domElement.addEventListener("touchstart", function(event){
      moviendoMouse = true;
      ultimaX = event.touches[0].clientX;
  }, { passive: false });
  renderer.domElement.addEventListener("touchmove", function(event){
      if (moviendoMouse) {
          const nuevaX = event.touches[0].clientX;
          onArrastrar(nuevaX - ultimaX);
          ultimaX = nuevaX;
      }
      event.preventDefault();
  }, { passive: false });
  renderer.domElement.addEventListener("touchend", function(){
      moviendoMouse = false;
  });
  renderer.domElement.addEventListener("touchcancel", function(){
      moviendoMouse = false;
  });

  renderer.domElement.style.touchAction = "none";
}