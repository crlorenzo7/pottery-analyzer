class View3D{
    scene=null;
    camera=null;
    renderer=null;
    cameraBG=null;
    sceneBG=null;
    composer=null;
    objeto=null;
    wireframe=null;
    cameraControl=null;
    view=2;
    viewBack=true;
    constructor(){};
    _clear(){
        cancelAnimationFrame(this.id);// Stop the animation
        app.visor.renderer.domElement.addEventListener('dblclick', null, false);
        for (let i = app.visor.scene.children.length - 1; i >= 0; i--) {
            const object = app.visor.scene.children[i];
            if (object.type === 'Mesh') {
                object.geometry.dispose();
                object.material.dispose();
                app.visor.scene.remove(object);
            }
            
        }
        for (let i = app.visor.sceneBG.children.length - 1; i >= 0; i--) {
            const object = app.visor.sceneBG.children[i];
            if (object.type === 'Mesh') {
                object.geometry.dispose();
                object.material.dispose();
                app.visor.sceneBG.remove(object);
            }
            
        }
        app.visor.camera=app.visor.cameraBG=app.visor.renderer=app.visor.objeto=app.visor.cameraControl=app.visor.scene=app.visor.sceneBG=null;
    }
    init() {
        console.log($('#'+visorFunctions.contenedor).width());
        app.visor.renderer = new THREE.WebGLRenderer();

    

        function signedVolumeOfTriangle(p1, p2, p3) {
            var v321 = p3.x*p2.y*p1.z;
            var v231 = p2.x*p3.y*p1.z;
            var v312 = p3.x*p1.y*p2.z;
            var v132 = p1.x*p3.y*p2.z;
            var v213 = p2.x*p1.y*p3.z;
            var v123 = p1.x*p2.y*p3.z;
            return (-v321 + v231 + v312 - v132 - v213 + v123)/6;
        }
        
        function calculateVolume(object){
            var volumes = 0;
        
            //object.legacy_geometry = new THREE.Geometry().fromBufferGeometry(object.geometry);
        
            for(var i = 0; i < object.geometry.faces.length; i++){
                var Pi = object.geometry.faces[i].a;
                var Qi = object.geometry.faces[i].b;
                var Ri = object.geometry.faces[i].c;
        
                var P = new THREE.Vector3(object.geometry.vertices[Pi].x, object.geometry.vertices[Pi].y, object.geometry.vertices[Pi].z);
                var Q = new THREE.Vector3(object.geometry.vertices[Qi].x, object.geometry.vertices[Qi].y, object.geometry.vertices[Qi].z);
                var R = new THREE.Vector3(object.geometry.vertices[Ri].x, object.geometry.vertices[Ri].y, object.geometry.vertices[Ri].z);
                volumes += signedVolumeOfTriangle(R, Q, P);
            }
        
            return Math.abs(volumes);
        }

        function rotarPunto(punto, paso, total) {
            var anguloDeg = (360.0 / total);
            var angulo = anguloDeg * ((Math.PI) / 180);
            var nuevoPunto = [];
            nuevoPunto.push(((punto[0] * Math.cos(angulo)) + (punto[2] * Math.sin(angulo))));
            nuevoPunto.push(punto[1]);
            nuevoPunto.push((-(punto[0] * Math.sin(angulo)) + (punto[2] * Math.cos(angulo))))
            return nuevoPunto;
        }
        
        function generalPerfilRotacion(perfil, paso, total) {
            var nuevoPerfil = [];
            for (var i = 0; i < perfil.length; i++) {
                if (!(perfil[i][0] == 0.0) || !(perfil[i][2] == 0.0)) {
                    var punto = rotarPunto(perfil[i], paso, total);
                    nuevoPerfil.push(punto);
                }
            }
            return nuevoPerfil;
        }

        function crearObjeto(datos){
            var perfil = datos;
            var perfilSinTapas = [];
            var perfilSinTapasFull=[];
            var tapas = [];
            var tapasfull=[];
            console.log(perfil);
            //var buscando=true;
            var indexAltoMaximo=0;
            for (i = 0; i < perfil.length; i++) {
                if (!(perfil[i][0] == 0.0) || !(perfil[i][2] == 0.0)) {
                    perfilSinTapas.push(perfil[i]);
                   
                    if(perfil[i][1] > perfil[indexAltoMaximo][1]){
                        indexAltoMaximo=i;
                    }
                    
                    /*if(i<perfil.length-1){
                        if(perfil[i][1]<=perfil[i+1][1] && buscando){
                            perfilSinTapasFull.push(perfil[i]);
                        }else{
                            buscando=false;
                        }
                    }*/
                } 
            }

           

            for(i=perfil.length-1;i>=indexAltoMaximo;i--){
                if (!(perfil[i][0] == 0.0) || !(perfil[i][2] == 0.0)) {
                    perfilSinTapasFull.push(perfil[i]);
                }
            }
            
            tapas.push(perfil[0]);
            tapas.push(perfil[perfil.length-1]);
            var tapa2full=[0.0,perfilSinTapasFull[perfilSinTapasFull.length-1][1],0.0];
            tapasfull.push(perfil[perfil.length-1]);
            tapasfull.push(tapa2full);
            console.log(tapas);
            console.log(tapasfull);
            var geometria = new THREE.Geometry();
            var geometriaCapacidad=new THREE.Geometry();
            var pasadas = 30
            var perfilSize=perfil.length;
            var perfilSizeCapacidad=perfilSinTapasFull.length;
            var totalpuntos = (pasadas * perfilSize);
            var totalpuntosCapacidad=(pasadas*perfilSizeCapacidad);
            console.log(totalpuntos);
            for (var i = 0; i < (pasadas+1); i++) {
                if(i==0){
                    for (var k = 0; k < perfilSizeCapacidad; k++) {
                        geometriaCapacidad.vertices.push(new THREE.Vector3(perfilSinTapasFull[k][0], perfilSinTapasFull[k][1], perfilSinTapasFull[k][2]));
                    }
                    for (var k = 0; k < perfilSize; k++) {
                        geometria.vertices.push(new THREE.Vector3(perfilSinTapas[k][0], perfilSinTapas[k][1], perfilSinTapas[k][2]));
                    }
                }else{
                    var nuevoPerfilCapacidad=generalPerfilRotacion(perfilSinTapasFull,i,pasadas);
                    var nuevoPerfil=generalPerfilRotacion(perfilSinTapas,i,pasadas);
                    for (var k = 0; k < perfilSizeCapacidad; k++) {
                        geometriaCapacidad.vertices.push(new THREE.Vector3(nuevoPerfilCapacidad[k][0], nuevoPerfilCapacidad[k][1], nuevoPerfilCapacidad[k][2]));
                    }
                    for (var k = 0; k < perfilSize; k++) {
                        geometria.vertices.push(new THREE.Vector3(nuevoPerfil[k][0], nuevoPerfil[k][1], nuevoPerfil[k][2]));
                    }
                    perfilSinTapasFull=nuevoPerfilCapacidad;
                    perfilSinTapas=nuevoPerfil;
                }

                for(var j=(i*perfilSize);j<(i*perfilSize)+perfilSize-1;j++ ){
                    if(i>0){
                        var color = new THREE.Color(0xFFFFFF);
                        var normal = new THREE.Vector3(0, 1, 0);
                        var cara1=new THREE.Face3((j)%totalpuntos,((j)+perfilSize)%totalpuntos,((j)+1)%totalpuntos,normal,color,0);
                        var cara2=new THREE.Face3(((j)+1)%totalpuntos,((j)+perfilSize)%totalpuntos,((j)+perfilSize+1)%totalpuntos,normal,color,0);

                        geometria.faces.push(cara1);
                        geometria.faces.push(cara2);
                        
                    }
                }

                for(var j=(i*perfilSizeCapacidad);j<(i*perfilSizeCapacidad)+perfilSizeCapacidad-1;j++ ){
                    if(i>0){
                        var color = new THREE.Color(0xFFFFFF);
                        var normal = new THREE.Vector3(0, 1, 0);
                        var cara1=new THREE.Face3((j)%totalpuntosCapacidad,((j)+perfilSizeCapacidad)%totalpuntosCapacidad,((j)+1)%totalpuntosCapacidad,normal,color,0);
                        var cara2=new THREE.Face3(((j)+1)%totalpuntosCapacidad,((j)+perfilSizeCapacidad)%totalpuntosCapacidad,((j)+perfilSizeCapacidad+1)%totalpuntosCapacidad,normal,color,0);

                        geometriaCapacidad.faces.push(cara1);
                        geometriaCapacidad.faces.push(cara2);
                        
                    }
                }
                
            }
            if(tapasfull.length>0){
                geometriaCapacidad.vertices.push(new THREE.Vector3(0.0, tapasfull[0][1], 0.0));
                for (var i = 0; i < pasadas; i++) {
                    var color = new THREE.Color(0xFFFFFF);
                    var normal = new THREE.Vector3(1, 1, 1);
                    var face = new THREE.Face3( ((i * perfilSizeCapacidad)+0) % totalpuntosCapacidad,(geometriaCapacidad.vertices.length - 1),((i * perfilSizeCapacidad)+perfilSizeCapacidad + 0) % totalpuntosCapacidad, normal, color, 0);
                    geometriaCapacidad.faces.push(face);
                }
        
                geometriaCapacidad.vertices.push(new THREE.Vector3(0.0, tapasfull[1][1], 0.0));
                for (var i = 0; i < pasadas; i++) {
                    var color = new THREE.Color(0xFFFFFF);
                    var normal = new THREE.Vector3(1, 1, 1);
                    var face = new THREE.Face3(((i * perfilSizeCapacidad)+perfilSizeCapacidad + perfilSinTapasFull.length-1) % totalpuntosCapacidad,(geometriaCapacidad.vertices.length - 1),((i * perfilSizeCapacidad)+perfilSinTapasFull.length-1) % totalpuntosCapacidad, normal, color, 0);
                    geometriaCapacidad.faces.push(face);
                }
            }

            if(tapas.length>0){
                geometria.vertices.push(new THREE.Vector3(0.0, tapas[0][1], 0.0));
                for (var i = 0; i < pasadas; i++) {
                    var color = new THREE.Color(0xFFFFFF);
                    var normal = new THREE.Vector3(1, 1, 1);
                    var face = new THREE.Face3( ((i * perfilSize)+0) % totalpuntos,(geometria.vertices.length - 1),((i * perfilSize)+perfilSize + 0) % totalpuntos, normal, color, 0);
                    geometria.faces.push(face);
                }
        
                geometria.vertices.push(new THREE.Vector3(0.0, tapas[1][1], 0.0));
                for (var i = 0; i < pasadas; i++) {
                    var color = new THREE.Color(0xFFFFFF);
                    var normal = new THREE.Vector3(1, 1, 1);
                    var face = new THREE.Face3(((i * perfilSize)+perfilSize + perfilSinTapas.length-1) % totalpuntos,(geometria.vertices.length - 1),((i * perfilSize)+perfilSinTapas.length-1) % totalpuntos, normal, color, 0);
                    geometria.faces.push(face);
                }
            }
        
            geometria.computeFaceNormals();
            geometria.computeVertexNormals();

            geometriaCapacidad.computeFaceNormals();
            geometriaCapacidad.computeVertexNormals();

            var materialMesh = new THREE.MeshPhongMaterial();
            if(visorFunctions.figura.textura!=null){
                var texture = new THREE.TextureLoader().load(visorFunctions.figura.textura);
                var materialColor3 = new THREE.MeshPhongMaterial()
                materialColor3.map = texture;
                materialColor3.depthTest = false;
                materialColor3.side=THREE.DoubleSide;
                materialMesh=materialColor3;
            }  
        
            var objetoCapacidad=new THREE.Mesh(geometriaCapacidad,materialMesh);
            app.visor.objeto = new THREE.Mesh(geometria, materialMesh);
            app.visor.objeto.name="figura";
            app.visor.objeto.castShadow = true;
            geometriaCapacidad.computeBoundingBox();
            geometria.computeBoundingBox();

            //normal
            var bb = geometria.boundingBox;
            var object3DWidth  = bb.max.x - bb.min.x;
            var object3DHeight = bb.max.y - bb.min.y;
            var object3DDepth  = bb.max.z - bb.min.z;

            //capacidad
            if(visorFunctions.figura.altura==0){
                var bbc = geometriaCapacidad.boundingBox;
                var object3DWidthc  = bbc.max.x - bbc.min.x;
                var object3DHeightc = bbc.max.y - bbc.min.y;
                var object3DDepthc = bbc.max.z - bbc.min.z;

                //aplicar escala
                var cmpp=0;
                if(visorFunctions.ppcm!=null){
                    cmpp=(1/(visorFunctions.ppcm*1.0));
                }else{
                    cmpp=(visorFunctions.alturaReferencia/(object3DHeight*1.0));
                }

                var ccvx=cmpp**3;
                console.log(ccvx);

                console.log(app.visor.objeto);
                console.log(objetoCapacidad);
                
                console.log('ancho: '+(object3DWidth*cmpp)+' , alto: '+(object3DHeight*cmpp));
                console.log('ancho: '+(object3DWidthc*cmpp)+' , alto: '+(object3DHeightc*cmpp));
                visorFunctions.figura.altura=Utils.time._round((object3DHeight*cmpp),2);
                visorFunctions.figura.volumen=Utils.time._round((ccvx*calculateVolume(app.visor.objeto)),2);
                visorFunctions.figura.anchura=Utils.time._round((object3DWidth*cmpp),2);
                visorFunctions.figura.capacidad=Utils.time._round((ccvx*calculateVolume(objetoCapacidad)),2);
            }
            console.log(visorFunctions.figura);
            $('#datos-figura .linea[data-prop="alto"] .value').html(visorFunctions.figura.altura);
            $('#datos-figura .linea[data-prop="diametro"] .value').html(visorFunctions.figura.anchura);
            $('#datos-figura .linea[data-prop="volumen-material"] .value').html(visorFunctions.figura.volumen);
            $('#datos-figura .linea[data-prop="capacidad"] .value').html(visorFunctions.figura.capacidad);

            console.log(visorFunctions.figura);

            var max = geometria.boundingBox.max,
                min = geometria.boundingBox.min;
            var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
            var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
            var faces = geometria.faces;

            geometria.faceVertexUvs[0] = [];

            for (var i = 0; i < faces.length ; i++) {

                var v1 = geometria.vertices[faces[i].a], 
                    v2 = geometria.vertices[faces[i].b], 
                    v3 = geometria.vertices[faces[i].c];

                geometria.faceVertexUvs[0].push([
                    new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);
            }
            geometria.uvsNeedUpdate = true;
            app.visor.wireframe = new THREE.WireframeHelper( app.visor.objeto, 0x00ff00 );
            app.visor.wireframe.name="wireframe";
            //if(app.visor.view==0 || app.visor.view==1){
                app.visor.scene.add(app.visor.objeto);
            //}
            //if(app.visor.view==0 || app.visor.view==2){
                app.visor.scene.add(app.visor.wireframe);
            //}
            //camara.lookAt(objeto.position);
            //modelo.scale.multiplyScalar(0.2);
        }
    
        function addControlGui(controlObject) {
            var gui = new dat.GUI();
            gui.add(controlObject, 'rotationSpeed', -0.01, 10);
            gui.add(controlObject, 'opacity', 0.1, 1);
            gui.add(controlObject, 'radius', 1.0, 30.0);
            gui.addColor(controlObject, 'color');
        }
    
        function addCube(width, height, deep) {
            var cubeGeometry = new THREE.CubeGeometry(width, height, deep);
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: "blue"
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.name = "cuboAzul";
            cube.castShadow = true;
            cube.material.transparent = true;
            app.visor.scene.add(cube);
        }
    
        function addFloor(width, deep) {
            var texture = new THREE.TextureLoader().load('static/img/suelo1.jpg');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 80, 80 );
            var planeGeometry = new THREE.PlaneGeometry(width, deep);
            var planeMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff
            });
            planeMaterial.map=texture;
            planeMaterial.specular = new THREE.Color(0xffffff);
            //planeMaterial.shininess=80;
    
            var plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            plane.name = "suelo";
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.y = -2;
    
            app.visor.scene.add(plane);
    
        }
    
        function addLight(color, position, tipo, nombre) {
            var Light = null;
            if (tipo == 'direccional') {
                Light = new THREE.DirectionalLight(color, 1.0);
            }
            if (tipo == 'ambiental') {
                Light = new THREE.AmbientLight(color,15.0);
            }
            if (tipo == 'spot') {
                Light = new THREE.SpotLight(color);
            }
            if(tipo=='hemi'){
                Light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.5);
            }
            if (position != null) {
                Light.position.set(position.x, position.y, position.z);
                if(tipo!='hemi'){
                    Light.castShadow = true;
                }
            }
            Light.name = nombre;
            app.visor.scene.add(Light);
        }
    
        function addSphere(radio, alto, ancho, material, name) {
            var sphereGeometry = new THREE.SphereGeometry(radio, alto, ancho);
            //var sphereMaterial = new THREE.MeshNormalMaterial();
            var earthMesh = new THREE.Mesh(sphereGeometry, material);
            earthMesh.name = name;
            earthMesh.castShadow = true;
            earthMesh.position.y=-60;
            app.visor.scene.add(earthMesh);
        }
    
        function createEarthMaterial() {
            var texture = new THREE.TextureLoader().load('static/img/sky.jpg');
            
            /*var normalMap = new THREE.TextureLoader().load('static/img/EarthNormal.png');
            var specularMap = new THREE.TextureLoader().load('static/img/EarthSpec.png');*/
            var materialTierra = new THREE.MeshPhongMaterial(/*{map:texture}*/);
    
            materialTierra.color = new THREE.Color(0xffffff);
            materialTierra.side=THREE.DoubleSide;
            /*materialTierra.normalMap = normalMap;
            materialTierra.specularMap = specularMap;*/
            materialTierra.specular = new THREE.Color(0x262626);
            return materialTierra;
        }
    
    
    
        function createCloudMaterial() {
            var texture = new THREE.TextureLoader().load('static/img/nubes.png');
            texture.premultiplyAlpha = true;
            var materialNubes = new THREE.MeshBasicMaterial();
    
            materialNubes.map = texture;
            materialNubes.transparent = true;
    
            return materialNubes;
        }
        app.visor.sceneBG = new THREE.Scene();
        app.visor.scene = new THREE.Scene();
    
        var texture = new THREE.TextureLoader().load('static/img/galaxy.png');
        var materialColor3 = new THREE.MeshBasicMaterial()
        materialColor3.map = texture;
        materialColor3.depthTest = false;
        var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor3);
    
        bgPlane.scale.set($('#'+visorFunctions.contenedor).width() * 2, $('#'+visorFunctions.contenedor).height() * 2, 1);
        bgPlane.position.z = -100;
        console.log(bgPlane);
    
    
        app.visor.renderer = new THREE.WebGLRenderer();
        app.visor.renderer.setClearColor(0x000000, 1.0);
        app.visor.renderer.setSize($('#'+visorFunctions.contenedor).width(), $('#'+visorFunctions.contenedor).height());
        app.visor.renderer.shadowMap.enabled = true;
        app.visor.renderer.antialias = true;
    
        app.visor.renderer.shadowMapSoft = true;
        app.visor.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
        app.visor.camera = new THREE.PerspectiveCamera(45, $('#'+visorFunctions.contenedor).width() / $('#'+visorFunctions.contenedor).height(), 0.1, 1000000);
        app.visor.camera.position.x = 0;
        app.visor.camera.position.y = 600;
        app.visor.camera.position.z = 900;
        app.visor.camera.lookAt(app.visor.scene.position);
    
    
        app.visor.cameraBG = new THREE.OrthographicCamera(-$('#'+visorFunctions.contenedor).width(), $('#'+visorFunctions.contenedor).width(), $('#'+visorFunctions.contenedor).height(), -$('#'+visorFunctions.contenedor).height(), -1000000, 1000000);
        app.visor.cameraBG.position.z = 50;
    
        app.visor.cameraControl = new THREE.OrbitControls(app.visor.camera,document.getElementById(visorFunctions.contenedor));
    
        document.getElementById(visorFunctions.contenedor).appendChild(app.visor.renderer.domElement);
    
        var clock = new THREE.Clock();
        //addCube(6, 4, 6);
        //addFloor(8000,8000);
        var materialTierra = createEarthMaterial();
        //var materialNubes = createCloudMaterial();
        //var materialColor4 = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff0000) });
        //materialColor4.transparent = true;
        //materialColor4.opacity = 1;
        addSphere(4000, 400, 400, materialTierra, 'tierra');
        console.log(visorFunctions.figura);
        crearObjeto(visorFunctions.figura.datos);
        //addSphere(5 * 1.02, 100, 100, materialNubes, 'nubes');
        //addSphere(5 * 1.01, 100, 100, materialColor4, 'ozono');
        addLight(0xffffff, { x: 0, y: 1900, z: 0 }, 'hemi', 'luzSolar');
        //addLight(0x111111, null, 'ambiental', 'luzAmbiental');
        app.visor.sceneBG.add(bgPlane);
    
        //addControlGui(control);
    
        var bgPass = new THREE.RenderPass(app.visor.sceneBG, app.visor.cameraBG);
        var renderPass = new THREE.RenderPass(app.visor.scene, app.visor.camera);
        renderPass.clear = false;
    
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;
    
        app.visor.composer = new THREE.EffectComposer(app.visor.renderer);
        app.visor.composer.renderTarget1.stencilBuffer = true;
        app.visor.composer.renderTarget2.stencilBuffer = true;
        app.visor.composer.addPass(bgPass);
        app.visor.composer.addPass(renderPass);
        app.visor.composer.addPass(effectCopy);
    
        if(visorFunctions.figura.textura!=null){
            initTextura(visorFunctions.figura.textura);
        }
        render();
    
        function render() {
            //scene.getObjectByName('tierra').rotation.y = control.rotationSpeed;
            //scene.getObjectByName('nubes').rotation.y = control.rotationSpeed;
            //scene.getObjectByName('ozono').material.opacity = 1;
            
            switch(app.visor.view){
                case 0: app.visor.scene.getObjectByName('figura').visible=true;
                        app.visor.scene.getObjectByName('wireframe').visible=true;break;
                case 1: app.visor.scene.getObjectByName('figura').visible=true;
                        app.visor.scene.getObjectByName('wireframe').visible=false;break;
                case 2: app.visor.scene.getObjectByName('figura').visible=false;
                        app.visor.scene.getObjectByName('wireframe').visible=true;break;
            }

            if(app.visor.viewBack){
                app.visor.scene.getObjectByName('tierra').visible=true;
            }else{
                app.visor.scene.getObjectByName('tierra').visible=false;
            }
            app.visor.renderer.autoClear = false;
            requestAnimationFrame(render);
    
            app.visor.composer.render();
            app.visor.renderer.domElement.toDataURL( 'image/png' )
        }

        function initTextura(img){
            new THREE.TextureLoader().load(img,function(texture){
                
                var material = new THREE.MeshPhongMaterial( { map: texture } );
                material.side=THREE.DoubleSide;
                app.visor.scene.getObjectByName('figura').material=material;
                app.visor.scene.getObjectByName('figura').material.needsUpdate = true;
                app.visor.scene.getObjectByName('figura').geometry.uvsNeedUpdate = true;
            });
        }

        function changeTextura(){
            console.log('cambiando-textura');
            
                var img=$(this).attr('data-value');
                visorFunctions.figura.textura=img;
            
            new THREE.TextureLoader().load(img,function(texture){
                
                var material = new THREE.MeshPhongMaterial( { map: texture } );
                material.side=THREE.DoubleSide;
                app.visor.scene.getObjectByName('figura').material=material;
                app.visor.scene.getObjectByName('figura').material.needsUpdate = true;
                app.visor.scene.getObjectByName('figura').geometry.uvsNeedUpdate = true;
            });
            /*texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 80, 80 );*/
            
        }

        function descargarModelo(){
            var titulo=$('#visor header .titulo-modelo').html().trim();
            render();
            var image = app.visor.renderer.domElement.toDataURL('image/png');
            console.log(image);
            saveImage(image.replace('image/png', 'image/octet-stream'), titulo+".png");
            
        }

        function saveImage(url,name){
            var link = document.createElement('a');
            
            document.body.appendChild(link); //Firefox requires the link to be in the body
            link.download = name;
            link.href = url;
            link.click();
            document.body.removeChild(link); //remove the link when done
            
        }

        function savePly(){
            var exporter = new THREE.PLYExporter();
            //var scenePly=app.visor.scene.clone(new THREE.Scene);
            //scenePly.add(app.visor.objeto);

            var scenePly = new THREE.Scene();
            scenePly.add(app.visor.objeto.clone());
            
            
            var data = exporter.parse( scenePly);
            
            var file = new File([data], "modelo.ply", {type: "application/octet-stream"});
            var blobUrl = (URL || webkitURL).createObjectURL(file);
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.download = "modelo.ply";
            link.href = blobUrl;
            link.click();
            document.body.removeChild(link);
        }

        function saveModel(){
            render();
            visorFunctions.figura.imagen = app.visor.renderer.domElement.toDataURL('image/png');
            var modelo=new PotteryFile();
            var figure=new Figure(visorFunctions.figura);
            modelo.tipo="modelo";
            modelo.titulo=visorFunctions.figura.titulo;
            modelo.idUsuario=app.user.getNick();
            modelo.figura=figure.toJson();
            delete modelo.figura.titulo;
            modelo.next=0;
            modelo.idPadre=app.filesystem.getCurrentNode().id;
            modelo.id=app.filesystem.getCurrentNode().id+'_'+app.filesystem.getCurrentNode().next;
            app.filesystem.addFile(modelo);
            app._getModelos();
            Api._saveFile(modelo).done(
                
            ).fail(
                err=> console.log(err)
            );
        }

        function updateModel(){
            render();
            visorFunctions.figura.imagen = app.visor.renderer.domElement.toDataURL('image/png');
            var id=$('#vcanvas').attr('data-model');
            var modelo=new PotteryFile();
            var figure=new Figure(visorFunctions.figura);
            modelo.tipo="modelo";
            modelo.idUsuario=app.user.getNick();
            modelo.titulo=visorFunctions.figura.titulo;
            modelo.figura=figure.toJson();
            delete modelo.figura.titulo;
            modelo.next=0;
            modelo.idPadre=app.filesystem.getCurrentNode().id;
            modelo.id=id;
            app.filesystem.updateFile(modelo);
            app._getModelos();
            Api._updateFile(modelo).done(
                data => app.gesModelos._update(data.modelo)
            )
        }

        function selectView(item,action){
            $(item).siblings().attr('data-estado','inactivo');
            $(item).attr('data-estado','activo');
            var view=0;
            switch(action){
                case 'solid':view=1;break;
                case 'point':view=2;break;
            }
            app.visor.view=view;
        }

        function analizarBoton(){
            var action=$(this).attr('data-action');

            switch(action){
                case 'cerrar':visorFunctions._close();break;
                case 'save': saveModel();break;
                case 'save_and_update': updateModel();break;
                case 'download': descargarModelo();break;
                case 'downloadPly':savePly();break;
                case 'export-csv': ;break;
                case 'solid-point':
                case 'solid':
                case 'point': selectView(this,action);break;
            }
        }
        $('#visor').unbind();
        $('#visor .texturas .item').unbind();
        $('#visor .titulo-modelo').unbind();
        $('#visor [data-type="boton"]').unbind();
        $('#visor .texturas .item').click(changeTextura);
        $('#visor [data-type="boton"]').click(analizarBoton);
        $('#visor .titulo-modelo').keypress(
            function(e){
                console.log('hola1');
                if(e.which==13){
                    console.log('hola2');
                    visorFunctions._setTitulo($(this).html().trim());
                }
                $(this).focusout();
        });

        $('#visor').keypress(function(e){
            
            if(String.fromCharCode(e.which)=='3'){
                app.visor.viewBack=true;
            } 
            if(String.fromCharCode(e.which)=='4'){
                app.visor.viewBack=false;
            } 
        })
        
    }
}