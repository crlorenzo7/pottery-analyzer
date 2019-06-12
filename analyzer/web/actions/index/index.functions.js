var indexFunctions={
    sendSignupForm(form){
        var datos={};
        datosForm=Utils.formularios.formArrayToJSON($(form).serializeArray());
        delete datosForm.rpassword;
        datos['user']=JSON.stringify(datosForm);
        app.signup(datos);
    },

    sendLoginForm(form){
        var datos={};
        datosForm=Utils.formularios.formArrayToJSON($(form).serializeArray());
        datos['user']=JSON.stringify(datosForm);

        app.login(datos);
    }
}