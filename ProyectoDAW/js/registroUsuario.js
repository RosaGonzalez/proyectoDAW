/* */
/* cuando este cargada la pag, ejecuta inicio() */
// $(document).on("ready", inicioRegistroUsuario);

// function muestraLogin() {}

/* inicio: 
    funcion a la que se llama cuando la página está cargada
    inicializa el formulario y activa las funciones de validación
    de los campos en el momento
*/
function inicioRegistroUsuario() {
    var peticion_http = null;
    $("#respServer").hide();
    $("span.help-block").hide();

    // validacion online de los campos 
    $("#usuario").keyup(validarUsuario);
    $("#pass").keyup(validarPass);
    $("#email").keyup(validarEmail);
    $("#fnac").keyup(validarFnac);

    /* boton registrar del formulario registro */
    $("#btnregistrar").on('click', function(e) {
        /* evitamos el envio sin datos */
        e.preventDefault();

        /*comprobamos que la validación de datos ha sido correcta
          antes de proceder al envio de datos */
        var enviarFormulario = validaFormRegistro();
        //
        if (enviarFormulario == true) {
            //peticion AJAX, ENVIO DE DATOS A  "registro.php", que hace la 
            //inserción en la BBDD.
            peticion_http = new XMLHttpRequest();
            if (peticion_http) {
                peticion_http.onload = procesarRespuestaRegistro;
                peticion_http.open("post", "php/registroUsuario.php", true);
                peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var jsonn = crearJsonRegistro();
                console.log("JSON- DATOSRegistro=>  " + jsonn);
                peticion_http.send("datosRegistro=" + crearJsonRegistro());
            }

            /*creamos JSON, para envio a "registro.php" */
            function crearJsonRegistro() {
                var objson = new Object();
                //
                objson.usuario = $('#usuario').val();
                objson.pass = $('#pass').val();
                objson.email = $('#email').val();
                objson.fnac = fechaTrans();
                objson.sexo = $('input:radio[name="sexo"]:checked').val();
                return (JSON.stringify(objson));
            }

            //funcion que transforma la fecha "dd-mm-aaaa" a formato : "aaaa-mm-dd"
            // para una mejor inserción en la bbdd.
            function fechaTrans() {
                var old = $('#fnac').val();
                var dia = parseInt(old.slice(0, 2));
                var mes = parseInt(old.slice(3, 5));
                var anio = parseInt(old.slice(6));
                //
                if (dia < 10) { dia = "0" + dia; }
                if (mes < 10) { mes = "0" + mes }
                //
                var nuevaFecha = anio + "-" + mes + "-" + dia;
                console.log("nueva fecha: " + nuevaFecha);
                return nuevaFecha;

            }

            /* PROCESAMOS la respuesta devuelta del servidor */
            function procesarRespuestaRegistro() {
                var objResp = JSON.parse(peticion_http.responseText);
                //var objResp = JSON.parse(peticion_http.responseText);
                var mostrarRespuestaServidor = $('#respServer').show();
                //
                if (objResp.respuesta != "" && objResp.respuesta != "errorValidacionDatos") {
                    var txt = "<div class='validado'><strong>Bienvenido, se acaba de registrar</strong>";
                    var link = "<a href='login.html' class='ARespServer'> <span class='glyphicon glyphicon-log-in'></span> Entra como usuario</a></div>"
                    mostrarRespuestaServidor.html(txt + link);
                    /* borro los datos del formulario */
                    $('#formRegistro')[0].reset();
                } else if (objResp.respuesta == "errorValidacionDatos") {
                    mostrarRespuestaServidor.html("<div class='error'><strong>Error de validación. Por favor vuelva a introducir los datos </strong></div>");
                } else {
                    mostrarRespuestaServidor.html("<div class='error'><strong>El usuario o mail ya existe</strong><br></div>");
                }
            }
        } else {
            $("#respServer").html("<div class='error'><strong>Error!! Por favor revise los datos mal introducidos </strong></div>").show();
        }
    }); /*cierra el btnRegistrar*/

    /* boton BORRAR del formulario registro */
    $('#btnborrar').on('click', function(e) {
        e.preventDefault(); /* evitamos el envio sin datos */
        //* borro el color de los elementos */
        $('#usuario').parent().parent().attr("class", "form-group");
        $('#pass').parent().parent().attr("class", "form-group");
        $('#email').parent().parent().attr("class", "form-group");
        $('#fnac').parent().parent().attr("class", "form-group");
        $('#sexo').parent().parent().attr("class", "form-group");
        //
        $('#formRegistro')[0].reset();
        $("[id*=icon]").hide();
        $("span.help-block").hide();
        $('#respServer').html("<div class='aviso'><strong>Formulario borrado</strong></div>").show();
    });
}
/* validaRegistro: funcion para validar todos los campos del registro
    de un usuario nuevo
 */
function validaFormRegistro() {
    $("#respServer").text("");
    var us = validarUsuario();
    var ps = validarPass();
    var em = validarEmail();
    var fn = validarFnac();

    if (us && ps && em && fn === true) {
        return true;
    } else {
        return false;
    }
}

/* validacion del usuario: 
    debe comenzar por letra y acontinuación se permiten: 
    letras, numeros, vocales acentuadas, ñÑ, guion bajo, guion medio
*/

function validarUsuario() {
    var er = /^[a-zA-Z][a-zA-ZáéíóúÁÉÍÓÚÑñ0-9 \-_]+$/;
    var valor = document.getElementById("usuario").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconUser').remove();
        $("#usuario").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errUsuario").text("debe introducir algún caracter").show();
        $("#usuario").parent().append('<span id="iconUser"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconUser').remove();
        $("#usuario").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errUsuario").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#usuario").parent().append('<span id="iconUser" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconUser').remove();
        $("#usuario").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errUsuario").text("").hide();
        $("#usuario").parent().append('<span id="iconUser" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}


/* validacion del password o contraseña: 
    caracteres permitidos: 
    letras, numeros, guion bajo, guion medio y caracteres especiales
*/
function validarPass() {
    var er = /^[a-zA-Z_0-9áéíóúÁÉÍÓÚ \-\W]+$/;
    var valor = document.getElementById("pass").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconPass').remove();
        $("#pass").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errPass").text("debe introducir algún caracter").show();
        $("#pass").parent().append('<span id="iconPass"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconPass').remove();
        $("#pass").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errPass").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#pass").parent().append('<span id="iconPass" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconPass').remove();
        $("#pass").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errPass").text("").hide();
        $("#pass").parent().append('<span id="iconPass" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}

/* validacion del email: 
    debe comenzar con :letras, numeros, guion bajo
    tiene que tener "@" continuar con letras, numeros, guion bajo
    tiene que tener un "." y luego 3 caracteres mas solo admite letras
*/
function validarEmail() {
    var er = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var valor = document.getElementById("email").value;
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconEmail').remove();
        $("#email").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errEmail").text("debe introducir algún caracter").show();
        $("#email").parent().append('<span id="iconEmail"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconEmail').remove();
        $("#email").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errEmail").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#email").parent().append('<span id="iconEmail" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconEmail').remove();
        $("#email").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errEmail").text("").hide();
        $("#email").parent().append('<span id="iconEmail" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}

/* validacion de la Fecha de nacimiento*/

function validarFnac() {
    var er = /^\d{2,4}\-\d{2}\-\d{2,4}$/;
    var valor = document.getElementById("fnac").value;
    //fecha del usuario
    var dia = parseInt(valor.slice(0, 2));
    var mes = parseInt(valor.slice(3, 5)) - 1;
    var anio = parseInt(valor.slice(6));
    var fechaUsuario = new Date(anio, mes, dia);
    // compruebo que el campo no esté vacio
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconFnac').remove();
        $("#fnac").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFnac").text("debe introducir algún caracter").show();
        $("#fnac").parent().append('<span id="iconFnac"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
        //compruebo que si pasa el formato del campo.
    } else if (!(er.test(valor))) {
        $('#iconFnac').remove();
        $("#fnac").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFnac").text("No puede empezar con espacio en blanco. Formato: dd-mm-aaaa").show();
        $("#fnac").parent().append('<span id="iconFnac" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
        // en caso de que cumpla con el formato del campo. compruebo que la fecha es real.
    } else if ((dia == fechaUsuario.getDate()) && (mes == fechaUsuario.getMonth()) && (anio == fechaUsuario.getFullYear())) {
        $('#iconFnac').remove();
        $("#fnac").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errFnac").text("").hide();
        $("#fnac").parent().append('<span id="iconFnac" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    } else {
        $('#iconFnac').remove();
        $("#fnac").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFnac").text("formato no válido. dia(1-31) mes(1-12) año(1916-2016)").show();
        $("#fnac").parent().append('<span id="iconFnac" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
    }
}