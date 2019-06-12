var Utils={
    http:{
        ajaxRequest:function(url,metodo,variables={}){
            headers={}
            if(DB.isLogged()){
                headers['Authorization']='Bearer '+DB.getToken();
            }
            return $.ajax({
                url:url,
                method:metodo,
                data:variables,
                headers:headers
            });
        },
        ajaxRequestJSON:function(url,metodo,variables={}){
            headers={}
            if(DB.isLogged()){
                headers['Authorization']='Bearer '+DB.getToken();
            }
            return $.ajax({
                url:url,
                method:metodo,
                data:JSON.stringify(variables),
                processData:false,
                contentType: 'application/json',
            });
        }
    },
    templates:{
        loadTemplate:function(template,continer,datos={},clase='',cb=[]){
            return new Promise(function(resolve,reject){
                $.get(template+'?v='+timestamp).done(function(data){
                    var html=ejs.render(data,datos);
                    if(clase!=''){
                        $('.'+clase).html(html);
                    }else{
                        $('#'+continer).html(html);
                    }
                    if(cb.length>0){
                        if(cb.length>1){
                            resolve(Utils.templates.loadMultipleTemplate(cb));
                        }else{
                            resolve(Utils.templates.loadTemplate(cb.template,cb.continer,cb.datos,cb.clase,cb.cb));
                        }
                    }else{
                        resolve('ok');
                    }
                    
                }).fail(function(err){
                    reject(err);
                })
            });
        },
        loadMultipleTemplate:function(cargas){
            var promesas=[];
            for(var i=0;i<cargas.length;i++){
                var promesa=Utils.templates.loadTemplate(cargas[i].template,cargas[i].continer,cargas[i].datos,cargas[i].clase,cargas[i].cb);
                promesas.push(promesa);
            }
            return Promise.all(promesas);
        },
        include:function(template,continer,datos={},tipo='html'){
            $.get(template+'?v='+timestamp).done(function(data){
                if(tipo=='html'){
                    var html=ejs.render(data,datos);
                    $(continer).html(html);
                    actions.load();
                    
                }
            }).fail(function(err){
                reject(err);
            });
        }
    },
    formato:{
        normalizarCadena:function(cadena){
            return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        }
    },
    formularios:{
        confirmarPassword:function(c1,c2){
            if(c1.value != c2.value) {
                c2.setCustomValidity("las contraseñas no coinciden");
            } else {
                c2.setCustomValidity('');
            }
        },
        validarPassword:function(c1){
            var patrones=[
                { patron:/\d/, nombre:'decimal'},
                { patron:/[A-Z]/,nombre:'mayuscula'},
                { patron:/[a-z]/,nombre:'minuscula'},
                { patron:/\W/,nombre:'otros'},
                { patron:/\s/,nombre:'espacios'}
            ];
            var valido=true;
            for(var i=0;i<patrones.length && valido;i++){
                if(i==patrones.length-1){
                    if(patrones[i].patron.test(c1.value)){
                        c1.setCustomValidity('la contraseña no puede contener espacios');
                        valido=false;
                    }
                }else{
                    if(!patrones[i].patron.test(c1.value)){
                        c1.setCustomValidity('la contraseña debe contener numeros, mayusculas, minusculas y caracteres extraños');
                        valido=false;
                    }
                }
            }
            if(valido==true){
                c1.setCustomValidity('');
            }
        },
        formArrayToJSON:function(serializedArray){
            var datos={};
            for(var i=0;i<serializedArray.length;i++){
                datos[serializedArray[i]['name']]=serializedArray[i]['value'];
            }
            return datos;
        }
    },
    time:{
        _round:function(n,d){
            var m=10^d;
            return Math.round(n*m)/m;
        },
        _stampToDateString:function(time){
            console.log(time);
            var date=new Date(Math.round(time*1000));
            var options={
                year:"numeric",
                month:"2-digit",
                day:"2-digit",
                hour:"2-digit",
                minute:"2-digit"
            }
    
            return date.toLocaleTimeString('es-Es',options);
        },
        _parseHour:function(segundos) {
            var horas = 0;
            var minutos = 0;
            var segundos = segundos;
            if (segundos >= 3600) {
                horas = Math.floor(segundos / 3600);
                segundos = (segundos % 3600);
            }
            if (segundos >= 60) {
                minutos = Math.floor(segundos / 60);
                segundos = (segundos % 60);
            }
        
            if (horas != 0) {
                var str_h = horas + '';
                if (horas < 10) {
                    str_h = '0' + horas;
                }
            }
            var str_m = minutos + '';
            if (minutos < 10) {
                str_m = '0' + minutos;
            }
            var str_s = segundos + '';
            if (segundos < 10) {
                str_s = '0' + segundos;
            }
        
            if (horas == 0) {
                cadena_final = str_m + ':' + str_s;
            } else {
                cadena_final = str_h + ':' + str_m + ':' + str_s;
            }
        
            return cadena_final;
        }
    },
    _placeContextMenu(event,tag){
        var height=window.innerHeight;
        var width=window.innerWidth;
        var x=event.clientX;
        var y=event.clientY;

        var orientacion={vertical:true,horizontal:true};
        if(y>(height/2)){ orientacion.vertical=false;}
        if(x>(width/2)){ orientacion.horizontal=false;}

        if(orientacion.horizontal){ $('#'+tag).css('left',x+'px');}else{ $('#'+tag).css('right',(width-x)+'px');}
        if(orientacion.vertical){ $('#'+tag).css('top',y+'px');}else{ $('#'+tag).css('bottom',(height-y)+'px');}
    }

}
