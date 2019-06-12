

function newModelActions(){
    $('#popup .boton-cerrar').unbind();
    $('#new-model-process [data-type="boton"]').unbind();
    $('#input-imagen').unbind();


    $('#new-model-process [data-type="boton"]').click(newModelFunctions.analizarAccion);
    $('#popup .boton-cerrar').click(newModelFunctions.analizarAccion);
    $('#input-imagen').change(newModelFunctions.changeSelectImage);
}