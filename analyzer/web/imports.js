var timestamp=new Date().getTime();

const _IMPORTS_=[
    '/static/config.js',
    '/static/services/Api.js',
    '/static/services/db.js',
    '/static/models/BaseModel.js',
    '/static/models/User.js',
    '/static/models/PotteryFile.js',
    '/static/models/Figure.js',
    '/static/modules/access.js',
    '/static/modules/filesystem.js',
    '/static/modules/lienzo.js',
    '/static/modules/newModelAssistant.js',
    '/static/modules/imageProcessor.js',
    '/static/modules/view3D.js',
    '/static/actions/global/global.functions.js',
    '/static/actions/index/index.functions.js',
    '/static/actions/home/home.functions.js',
    '/static/actions/visor/visor.functions.js',
    '/static/actions/new-model/new-model.functions.js',
    '/static/actions/global/global.actions.js',
    '/static/actions/index/index.actions.js',
    '/static/actions/home/home.actions.js',
    '/static/actions/new-model/new-model.actions.js',
    '/static/lib/utils.js',
    '/static/actions.js',
]

function importar(url){
    var script=document.createElement('script');
    script.setAttribute('src',url+'?v='+timestamp)
    script.setAttribute('type',"text/javascript");
    script.onload = function(){
        console.log('Done '+url);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}

for(var i=0;i<_IMPORTS_.length;i++){
    importar(_IMPORTS_[i]);
}