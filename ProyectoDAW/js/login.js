/* */
/* inicio: 
    funcion a la que se llama cuando la página está cargada
    inicializa el formulario y activa las funciones de validación
    de los campos en el momento
*/
function inicioLogin() {
    var peticion_http = null;

    $("span.help-block").hide();
    //11junio17  $("divMensaje").hide();
    $('#respServer').hide();

    // validacion online de los campos 
    $("#usuarioLogin").keyup(validarUsuarioLogin);
    $("#passLogin").keyup(validarPassLogin);

    /* boton registrar del formulario registro */
    $("#btnLogin").on('click', function(e) {
        /* evitamos el envio sin datos */
        e.preventDefault();

        // /*comprobamos que la validación de datos ha sido correcta
        //   antes de proceder al envio de datos */
        var enviarFormulario = validaFormLogin();
        // //
        if (enviarFormulario == true) {
            //peticion AJAX, ENVIO DE DATOS A  "registro.php", que hace la 
            //inserción en la BBDD.
            peticion_http = new XMLHttpRequest();
            if (peticion_http) {
                peticion_http.onload = procesarRespuestaLoguin;
                peticion_http.open("post", "php/login.php", true);
                peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var jsonn = crearJsonLoguin();
                console.log("JSON- DATOSLogin=>  " + jsonn);
                peticion_http.send("datosLogin=" + crearJsonLoguin());
            }

            /*creamos JSON, para envio a "login.php" */
            function crearJsonLoguin() {
                var objson = new Object();
                //
                objson.usuario = $('#usuarioLogin').val();
                objson.pass = $('#passLogin').val();
                //
                console.log("login.js:49, " + objson.usuario);

                return (JSON.stringify(objson));
            }

            /* PROCESAMOS la respuesta devuelta del servidor */
            function procesarRespuestaLoguin() {
                var objResp = JSON.parse(peticion_http.responseText);
                var respuesta = objResp.respuesta;
                // console.log("login.js:58, " + objResp.respuesta[0].usuario);
                if (respuesta.length > 0) {
                    // muestro y escondo botones de la barra superior
                    $('#userLogueado').show();
                    $('#loginEntradaUser').hide();
                    // muestro el nombre del usuario logueado
                    $('#user').html(objResp.respuesta[0].usuario);
                    $('#id_usuario').html(objResp.respuesta[0].id_usuario);
                    //
                    creaCookieLogin(document.getElementById("usuarioLogin").value);
                    guardaId(objResp.respuesta[0].id_usuario);
                    limpiaDatosLogin();
                    location.href = "index.html";
                } else {
                    // $('#usuarioLogin').val("");
                    // $('#passLogin').val("");
                    //11junio17  $('#divMensaje').removeClass("alert-success").addClass("alert-danger").show();
                    //
                    $("#usuarioLogin").parent().parent().attr("class", "form-group has-error has-feedback");
                    $("#usuarioLogin").parent().append('<span id="iconUser"class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    $("#passLogin").parent().parent().attr("class", "form-group has-error has-feedback");
                    $("#passLogin").parent().append('<span id="iconUser"class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    //11junio17  $('#mensajes').html("<span class='text-center'>Usuario y/o contraseña incorrectos. <br>Si no eres usuario todavía <a href='registroUsuario.html' class='ARespServer'><span class='glyphicon glyphicon-user'>Registrate</span></a></span>");
                    //
                    $('#respServer').html("<div class='error'>Usuario y/o contraseña incorrectos. Si no eres usuario todavía <a href='registroUsuario.html' class='ARespServer'><span class='glyphicon glyphicon-user'>Registrate</span></a></div>").show();
                }
            }
        }
    }); /*cierra el btnLogin*/

    /* boton borrarLogin del formulario registro */
    $('#borrarLogin').on('click', limpiaDatosLogin);
}

/* funcion para limpiar datos del login y mensaje*/
function limpiaDatosLogin() {
    $('#usuarioLogin').val("");
    $('#passLogin').val("");
    $("#usuarioLogin").parent().parent().attr("class", "form-group");
    $("#passLogin").parent().parent().attr("class", "form-group");
    //
    $('#respServer').hide();
    //11junio17  $('#divMensaje').hide();
    //11junio17   $('#mensaje').val("");
    $("[id*=icon]").hide();
    $("span.help-block").hide();
}
/*
 * Crea la cookie del usuario
 */
function creaCookieLogin(usuario) {
    Cookies.set('userlogueado', usuario, { expires: 15 });
}

/*
 * Eliminacion de cookie del usuario
 */
function eliminaCookies() {
    $('#userLogueado').hide();
    $('#loginEntradaUser').show();
    Cookies.remove('userlogueado');
    Cookies.remove('id_usuario');
    //11junio17    $('#divMensaje').removeClass("alert-success").addClass("alert-danger").hide();
    //11junio17    $('#mensajes').html("");
    $('#respServer').html("");
}

/* 
 *  función que guarda la "id_usuario" si no existe
 */
function guardaId(id_usuario) {
    if (!Cookies.get("id_usuario")) {
        Cookies.set('id_usuario', id_usuario, { expires: 15 });

    }
}


/*
 * Comprueba si existe la cookie del usuario
 * si no existe la crea
 * si existe la muestra
 */
function muestraLogin() {
    //11junio17    OcultaDivMensajes();
    $('#respServer').hide();
    if (Cookies.get('userlogueado')) {
        $('#userLogueado').show();
        $('#user').html(Cookies.get('userlogueado'));
        $('#id_usuario').html(Cookies.get('id_usuario'));
        $('#loginEntradaUser').hide();
    } else {
        $('#userLogueado').hide();
        $('#loginEntradaUser').show();
    }
}



/*
 *   funcion ocultaDivMensajes.
 */
function OcultaDivMensajes() {
    //11junio17   $('#divMensaje').hide();
}


/* validaRegistro: funcion para validar todos los campos del registro
    de un usuario nuevo
 */
function validaFormLogin() {
    var us = validarUsuarioLogin();
    var ps = validarPassLogin();
    if (us && ps === true) {
        return true;
    } else {
        return false;
    }
}

/* validacion del usuario: 
    debe comenzar por letra y acontinuación se permiten: 
    letras, numeros, vocales acentuadas, ñÑ, guion bajo, guion medio
*/

function validarUsuarioLogin() {
    var er = /^[a-zA-Z][a-zA-ZáéíóúÁÉÍÓÚÑñ0-9 \-_]+$/;
    var valor = document.getElementById("usuarioLogin").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconUser').remove();
        $("#usuarioLogin").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errUsuario").text("debe introducir algún caracter").show();
        $("#usuarioLogin").parent().append('<span id="iconUser"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconUser').remove();
        $("#usuarioLogin").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errUsuario").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#usuarioLogin").parent().append('<span id="iconUser" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconUser').remove();
        $("#usuarioLogin").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errUsuario").text("").hide();
        $("#usuarioLogin").parent().append('<span id="iconUser" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}


/* validacion del password o contraseña: 
    caracteres permitidos: 
    letras, numeros, guion bajo, guion medio y caracteres especiales
*/
function validarPassLogin() {
    var er = /^[a-zA-Z_0-9áéíóúÁÉÍÓÚ \-\W]+$/;
    var valor = document.getElementById("passLogin").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconPass').remove();
        $("#passLogin").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errPass").text("debe introducir algún caracter").show();
        $("#passLogin").parent().append('<span id="iconPass"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconPass').remove();
        $("#passLogin").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errPass").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#passLogin").parent().append('<span id="iconPass" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconPass').remove();
        $("#passLogin").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errPass").text("").hide();
        $("#passLogin").parent().append('<span id="iconPass" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}