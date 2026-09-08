THREE.DefaultLoadingManager.onProgress = function(url, cargados, total){
    const porcentaje = Math.round((cargados / total) * 100);
    document.getElementById("porcentajeCarga").innerText = "Cargando... " + porcentaje + "%";
};

THREE.DefaultLoadingManager.onLoad = function(){
    const pantalla = document.getElementById("pantallaCarga");
    pantalla.classList.add("oculto");
    setTimeout(() => { pantalla.style.display = "none"; }, 600);
};

let tiempo = 0;
let anguloBarco = 120*(Math.PI/180);
let barco;
let barco2;
let controls;
let paginaCultura = 0;
let destinoLook = new THREE.Vector3(); 
let animCamara = {
    activa: false,
    inicio: new THREE.Vector3(),
    objetivo: new THREE.Vector3(),
    lookInicio: new THREE.Vector3(),
    lookObjetivo: new THREE.Vector3(),
    tiempo: 0,
    duracion: 1.5
};
let water;
let luzDir2;
let luzNoche = [];
const cacheModelos = {};
const cultura = [
{
    titulo: "Origen del pueblo Uru",
    texto: "Los Uros son un pueblo originario asentado en la bahía de Puno, cuya historia se remonta a épocas preincas, con presencia en la región desde hace más de 3.000 años. Se consideran a sí mismos ''hombres del agua'' (Kot'suña), uno de los pocos pueblos cuya vida entera gira en torno al lago Titicaca. Su lengua original, el uruquilla, se fue perdiendo con el tiempo por el contacto con los aimaras, y hoy se comunican principalmente en aimara y español.",
    fuente: "Ministerio de Cultura del Perú",
    imagen: "imagenes/tour-lago-titicaca-2.webp",
    cam: { x: 0, y: 1, z: 12 },
    look: { x: 0, y: 0, z: 0 }
},
{
    titulo: "Viviendas flotantes",
    texto: "Las islas de los Uros se construyen apilando capas sucesivas de totora: primero bloques de raíces entrelazadas, llamados 'khili', y luego capas de tallos tejidos en direcciones cruzadas para dar firmeza a la superficie. Sobre esta base flotante se levantan las viviendas, hechas también de totora tejida en esteras. Como el material se pudre con la humedad, cada isla requiere mantenimiento constante, agregando nuevas capas de totora fresca por encima.",
    fuente: "Tectónica (tectonica.archi) / BDPI Ministerio de Cultura",
    imagen: "imagenes/3160669315_bfedb08cc1_b.jpg",
    cam: { x: 19, y: 1, z: 0 },
    look: { x: 20, y: -1, z: -10 }
},
{
    titulo: "Barcos de totora",
    texto: "Los barcos de totora, también llamados balsas, se construyen con el mismo material que las islas: tallos de totora secos, entrelazados y amarrados con técnicas transmitidas de generación en generación. Son livianos, flotan con facilidad y se han usado durante siglos para pescar, cazar aves del lago y trasladarse entre islas. Hoy en día también cumplen un rol importante en el turismo, llevando visitantes a recorrer el archipiélago.",
    fuente: "Machu Picchu Sacred (machupicchusacred.com)",
    imagen: "imagenes/images.jpg",
    cam: { x: -26, y: 1, z: 0 },
    look: { x: -22, y: 0, z: -2 }
  },
{
    titulo: "Mirador de las Islas Uros",
    texto: "Los miradores son estructuras elevadas, construidas con madera y totora, desde donde se puede observar la disposición de las islas flotantes y la inmensidad del lago Titicaca —el lago navegable más alto del mundo, a más de 3.800 metros de altura. Son puntos clave para entender cómo la comunidad organiza su vida sobre el agua, y uno de los lugares más visitados por los turistas que llegan al archipiélago.",
    fuente: "Isla de los Uros / GoChile",
    imagen: "imagenes/mirador.jpg",
    cam: { x: -22, y: 1.5, z: 23 },
    look: { x: -21, y: 1, z: 19 }
  },
{
    titulo: "Pez elaborado con Totora",
    texto: "La pesca ha sido, junto con la caza de aves, una de las principales actividades de subsistencia del pueblo Uro desde tiempos ancestrales. Las figuras de peces tejidas en totora representan esta tradición y forman parte de las artesanías que los Uros elaboran hoy en día, tanto para uso propio como para compartir su cultura con los visitantes que llegan a las islas.",
    fuente: "BDPI Ministerio de Cultura / Machu Picchu Sacred",
    imagen: "imagenes/pez.jpg",
    cam: { x: 8.52, y: 1.80, z: 36.66 },
    look: { x: 20, y: -0.5, z: 24 }
  },
{
    titulo: "Arco de Bienvenida",
    texto: "Al llegar a las islas flotantes, es común encontrar arcos construidos con totora que dan la bienvenida a los visitantes. Estas estructuras reflejan el mismo dominio técnico que los Uros aplican en la construcción de sus viviendas y embarcaciones, y se han convertido en uno de los símbolos más reconocibles del turismo en el archipiélago.",
    fuente: "BDPI Ministerio de Cultura / Machu Picchu Sacred",
    imagen: "imagenes/arco.jpg",
    cam: { x: -4, y: 1, z: 12 },
    look: { x: -3, y: 0, z: 0 }
},
{
    titulo: "La totora",
    texto: "La totora es una planta acuática que crece en las aguas del Titicaca y constituye el recurso más importante para la vida de los Uros: con ella construyen las islas flotantes, las viviendas, las balsas, e incluso la usan como alimento. Se considera 'el alma de su cultura', ya que sin este material la forma de vida tradicional del pueblo Uru sobre el agua no habría sido posible durante siglos.",
    fuente: "Exode.es (exode.es)",
    imagen: "imagenes/totora.jpg",
    cam: { x: -18, y: 0, z: 42 }, 
    look: { x: -15, y: -0.5, z: 40 }
}
];

const loader = new THREE.GLTFLoader();
function cargarModelo(ruta, x, y, z, sx, sy, sz, rotY = 0, callback = null) {
  if (cacheModelos[ruta]) {
    const modelo = cacheModelos[ruta].clone();
    modelo.position.set(x, y, z);
    modelo.scale.set(sx, sy, sz);
    modelo.rotation.y = rotY;
    scene.add(modelo);
    if (callback) callback(modelo);
    return;
  }
  loader.load(ruta, function(gltf) {
    const modelo = gltf.scene;
    modelo.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.85;
        child.material.metalness = 0.0;
      }
    });
    cacheModelos[ruta] = modelo;
    const instancia = modelo.clone();
    instancia.position.set(x, y, z);
    instancia.scale.set(sx, sy, sz);
    instancia.rotation.y = rotY;
    scene.add(instancia);
    if (callback) callback(instancia);
  });
}

function moverCamara(){
    animCamara.inicio.copy(camera.position);
    animCamara.objetivo.set(cultura[paginaCultura].cam.x,cultura[paginaCultura].cam.y,cultura[paginaCultura].cam.z);
    animCamara.lookInicio.copy(destinoLook);
    animCamara.lookObjetivo.set(cultura[paginaCultura].look.x,cultura[paginaCultura].look.y,cultura[paginaCultura].look.z);
    animCamara.tiempo = 0;
    animCamara.activa = true;
}
function cameraReset(){
    animCamara.inicio.copy(camera.position);
    animCamara.objetivo.set(-6, 3, 17);
    animCamara.lookInicio.copy(destinoLook);
    animCamara.lookObjetivo.set(0, 0, 0);
    animCamara.tiempo = 0;
    animCamara.activa = true;
}
function easeInOut(t){
    return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function actualizarInfo(){
    const panel = document.getElementById("panelInfo");
    panel.classList.remove("izquierda", "derecha");
    if(paginaCultura % 2 === 0){
        panel.classList.add("derecha");
    }else{
        panel.classList.add("izquierda");
    }
    document.getElementById("tituloInfo").innerHTML = cultura[paginaCultura].titulo;
    document.getElementById("imagenInfo").src = cultura[paginaCultura].imagen;
    document.getElementById("textoInfo").innerHTML = cultura[paginaCultura].texto;
    document.getElementById("fuenteInfo").innerHTML = "Fuente: " + cultura[paginaCultura].fuente; 
    const btnSiguiente = document.getElementById("btnSiguiente");
    btnSiguiente.style.display =
    paginaCultura === cultura.length - 1 ? "none" : "inline-block";
    
}
function mostrarCultura(){
    document.getElementById("inicioInfo").style.display = "none";
    document.getElementById("panelInfo").style.display = "block";
    document.getElementById("botonesInfo").style.display = "flex"; 
    paginaCultura = 0;
    actualizarInfo();
    moverCamara();
}
function siguienteInfo(){
    if(paginaCultura < cultura.length - 1){
        paginaCultura++;
        actualizarInfo();
        moverCamara();
    }
}
function anteriorInfo(){
    if(paginaCultura > 0){
        paginaCultura--;
        actualizarInfo();
        moverCamara();
    }
    else{
        document.getElementById("panelInfo").style.display = "none";
        document.getElementById("botonesInfo").style.display = "none";
        document.getElementById("inicioInfo").style.display = "block";
        cameraReset();
    }
}

function crearLuzNoche(x, y, z){
    const luz = new THREE.PointLight(0xff6a1f, 0, 8);
    luz.position.set(x, y, z);
    scene.add(luz);
    luzNoche.push(luz);
}

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  camera.position.set(-6, 3, 17);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth,window.innerHeight);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.getElementById("contenedor3D").appendChild(renderer.domElement);  
 
  let luzAmbiental = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(luzAmbiental);
  
  luzDir2 = new THREE.DirectionalLight(0xffffff, 1.2); 
  luzDir2.position.set(10, 20, 10);
  scene.add(luzDir2);

  // isla Medio
  cargarModelo("islaMedio.glb", 0, -1.8, -1.5, 1, 1, 1,-98 * Math.PI / 180);
  cargarModelo("barcoDoble.glb",-15, 0, 10,2, 2, 2,3,function(modelo){barco2 = modelo;});
  cargarModelo("barco3.glb",0, -2, 9,0.5, 0.5, 0.5,3,function(modelo){barco = modelo;});

  // isla izquierda adelante
  cargarModelo("islaFrenteIzq.glb", -25, -1.8, 17, 1, 1, 1,-62 * Math.PI / 180);

  // isla derecha adelante
  cargarModelo("islaFrenteDer.glb", 17, -1.8, 25, 1, 1, 1, -152 * Math.PI / 180);

  // isla izquierda
  cargarModelo("islaIzq.glb", -20.5, -1.8, -12, 1, 1, 1, -98 * Math.PI / 180);
  cargarModelo("barco3.glb",-22, -2, -4.5,0.7, 0.7, 0.7,120 * Math.PI / 180);

  // isla derecha
  cargarModelo("islaDer.glb", 24, -1.8, -10, 1, 1, 1, -98 * Math.PI / 180);

  crearLuzNoche(0, 2, -1.5);      // isla medio
  crearLuzNoche(-25, -1.3, 17);      // isla frente izq
  crearLuzNoche(17, -1.3, 25);       // isla frente der
  crearLuzNoche(-20.5, -1.3, -12);   // isla izq
  crearLuzNoche(24, -1.3, -10);      // isla der
  // totora 
  cargarModelo("planta.glb", -13.5, -2,39, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -14, -2,38.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -14.5, -2,38, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15, -2,37.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -15.5, -2,37, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -16, -2,36.5, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -16.5, -2,36, 0.4, 0.3, 0.4, 1);
  cargarModelo("planta.glb", -17, -2,35.5, 0.4, 0.3, 0.4, 1);
 
  const aguaGeometry = new THREE.PlaneGeometry(400, 400);
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
    //   waterColor: 0x0e2a3d,
      waterColor: 0x164a5c, 
      distortionScale: 1.8,
      fog: scene.fog !== undefined
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = -2;
  scene.add(water);


  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 5;
  controls.maxDistance = 70;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  cambiarAmbiente("noche");
  
}
function animate() {
  
 if(animCamara.activa){
    animCamara.tiempo += 0.016;
    let t = animCamara.tiempo / animCamara.duracion;
    if(t >= 1){
        t = 1;
        animCamara.activa = false;
    }
    const e = easeInOut(t);
    camera.position.lerpVectors(animCamara.inicio,animCamara.objetivo,e);

    destinoLook.lerpVectors(animCamara.lookInicio,animCamara.lookObjetivo,e);
  }
  camera.lookAt(destinoLook);
  requestAnimationFrame(animate);

 tiempo += 0.02;
  if (water) {
    water.material.uniforms['time'].value += 0.6 / 60.0;
  }

  if (barco) {
    anguloBarco -= 0.002;
    barco.position.x = Math.cos(anguloBarco) * 16;
    barco.position.z = Math.sin(anguloBarco) * 14;
    barco.position.y = -2 + Math.sin(tiempo * 2) * 0.08;
    barco.rotation.y = -anguloBarco + 5;
}
  if (barco2) {
  barco2.position.x += 0.025;
  barco2.position.y = -2.4 + Math.sin(tiempo * 2) * 0.08;
  if (barco2.position.x > 30) {
    barco2.position.x = -18;
  }
}
controls.target.copy(destinoLook);
controls.update();

if(camera.position.y < -1){
    camera.position.y = -1;
}

  renderer.render(scene, camera);
}
init();
animate();