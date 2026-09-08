const texturasAmbiente = {
    // dia: "imagenes/dia.jpg",
    dia: "imagenes/g.jpg",
    atardecer: "imagenes/atardecer.jpg",
    noche: "imagenes/noche.jpg",
    nublado: "imagenes/nublado.jpg" 
};
const cacheTexturasAmbiente = {};
const loaderAmbiente = new THREE.TextureLoader();
let esferaCielo;

const rotacionCielo = -1.7;

function crearEsferaCielo(textura){
    textura.colorSpace = THREE.SRGBColorSpace;
    const geo = new THREE.SphereGeometry(500, 60, 40);
    geo.scale(-1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ map: textura });
    esferaCielo = new THREE.Mesh(geo, mat);
    esferaCielo.rotation.y = rotacionCielo;
    scene.add(esferaCielo);
}

function cambiarFondo(tipo){
    if (cacheTexturasAmbiente[tipo]) {
        if (esferaCielo) esferaCielo.material.map = cacheTexturasAmbiente[tipo];
        return;
    }
    loaderAmbiente.load(texturasAmbiente[tipo], function(textura){
        textura.colorSpace = THREE.SRGBColorSpace;
        cacheTexturasAmbiente[tipo] = textura;
        if (esferaCielo) {
            esferaCielo.material.map = textura;
            esferaCielo.material.needsUpdate = true;
        } else {
            crearEsferaCielo(textura);
        }
    });
}

function cambiarAmbiente(tipo){
    const config = {
        dia:       { exposure: 1.0,  luzColor: 0xffffff, luzInt: 0.3 },
        atardecer: { exposure: 0.9, luzColor: 0xffffff, luzInt: 0.1 },
        noche:     { exposure: 0.7, luzColor: 0x7d90c0, luzInt: 0.8 },
        nublado:   { exposure: 0.85, luzColor: 0xc9ccd1, luzInt: 0 }
    };
    const c = config[tipo];

    cambiarFondo(tipo);

    renderer.toneMappingExposure = c.exposure;
    luzDir2.color.set(c.luzColor);
    luzDir2.intensity = c.luzInt;

    if (water) {
        water.material.uniforms['sunColor'].value.set(c.luzColor);
        water.material.uniforms['sunDirection'].value.copy(luzDir2.position).normalize();
    }

    if (typeof luzNoche !== 'undefined') {
        const intensidad = (tipo === 'noche' || tipo ==='atardecer') ? 3 : 0;
        luzNoche.forEach(l => l.intensity = intensidad);
    }
}