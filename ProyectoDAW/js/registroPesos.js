//

function inicioRegistroPesos() {
    var usLogueado = Cookies.get('id_usuario');
    //
    if (usLogueado == null || usLogueado.length == 0 || /^\s+$/.test(usLogueado)) {
        $('#btnRegPeso').attr('disabled', true);
        $('#btnBorraRegPeso').attr('disabled', true);
        $('#respServer').html("<div class='aviso'><strong>Debes entrar primero como usuario   </strong><a href='login.html' class='ARespServer'><span class='glyphicon glyphicon-user'>LOGUEATE</span></a></div>");
        return false;
    } else {
        $('#btnRegPeso').attr('disabled', false);
        $('#btnBorraRegPeso').attr('disabled', false);
        //
        var peticion_http = null;
        $("span.help-block").hide();
        // validacion online de los campos 
        $("#fecha").keyup(validarFecha);
        $("#kg").click(validarKg);
        $("#fat").keyup(validarFat);
        $("#water").keyup(validarWater);
        $("#mm").keyup(validarMM);
        $('#id_usuario').change(inicioRegistroPesos);

        // botones del formulario de registro de ejercicios
        // este botón, comprueba que la validación de los campos del formulario
        // son correctos y en caso afirmativo realiza la petición ajax, para
        // la inserción de los datos en la BBDD. 

        $("#btnRegPeso").on('click', function(e) {
            /* evitamos el envio sin datos */
            e.preventDefault();
            /*comprobamos que la validación de datos ha sido correcta
                    antes de proceder al envio de datos */
            var enviarFormulario = validaFormRegPeso();
            //
            if (enviarFormulario == true) {
                peticionAjax_RPeso();
            } else {
                $('#respServer').html("<div class='error'><strong>Error!! Por favor revise los datos mal introducidos </strong></div>").show();
            }
        });

        // boton limpiar datos del formulario
        $('#btnBorraRegPeso').on('click', function(e) {
            /* evitamos el envio sin datos */
            e.preventDefault();
            //* borro el color de los elementos */
            $('#fecha').parent().parent().attr("class", "form-group");
            $('#kg').parent().parent().attr("class", "form-group");
            $('#fat').parent().parent().attr("class", "form-group");
            $('#water').parent().parent().attr("class", "form-group");
            $('#mm').parent().parent().attr("class", "form-group");
            // elimino iconos 
            $("span.help-block").hide();
            $("[id*=icon]").hide();
            $('#respServer').html("<div class='aviso'><strong>Formulario borrado</strong></div>").show();
            // vacio los campos de texto
            $('#fecha').val("");
            $('#kg').val("");
            $('#fat').val("");
            $('#water').val("");
            $('#mm').val("");
        });
    }
    /*cierra if de si el usuario se ha logueado o no*/
}
/*cierra funcion INICIO*/

/* 
 *   funcion peticion AJAX:
 *   peticion AJAX, ENVIO DE DATOS A  "registro.php", que hace la 
 *   inserción en la BBDD.
 */
function peticionAjax_RPeso() {
    peticion_http = new XMLHttpRequest();
    if (peticion_http) {
        peticion_http.onload = procesarRespuestaRegistroPeso;
        peticion_http.open("post", "php/registroPeso.php", true);
        peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var jsonn = crearJsonRegistroPeso();
        console.log("JSON- datosPeso=>  " + jsonn);
        peticion_http.send("datosPeso=" + crearJsonRegistroPeso());
    }

    /*creamos JSON, para envio a "registroPeso.php" */
    function crearJsonRegistroPeso() {
        var objson = new Object();
        //
        objson.id_usuario = Cookies.get('id_usuario');
        objson.fecha = fechaTrans();
        objson.kg = $('#kg').val();
        objson.fat = $('#fat').val();
        objson.water = $('#water').val();
        objson.mm = $('#mm').val();
        return (JSON.stringify(objson));
    }

    //funcion que transforma la fecha "dd-mm-aaaa" a formato : "aaaa-mm-dd"
    // para una mejor inserción en la bbdd.
    function fechaTrans() {
        var old = $('#fecha').val();
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
    function procesarRespuestaRegistroPeso() {
        var objResp = JSON.parse(peticion_http.responseText);
        //var objResp = JSON.parse(peticion_http.responseText);
        var mostrarRespuestaServidor = $('#respServer').show();
        //
        if (objResp.respuesta != "" && objResp.respuesta != "errorValidacionDatos") {
            mostrarRespuestaServidor.html("<div class='validado'><strong>Ok, actividad registrada</strong></div>");
            /* borro los datos del formulario */
            $('#formRegistroPesos')[0].reset();
            $("[id*=icon]").hide();
        } else if (objResp.respuesta == "errorValidacionDatos") {
            mostrarRespuestaServidor.html("<div class='error'><strong>Error de validación. Por favor vuelva a introducir los datos </strong></div>");
        } else {
            mostrarRespuestaServidor.html("<div class='error'><strong>PASA ALGO RARO!! </strong><br></div>");
        }
    }

} /* fin peticion ajax */

// funciones para la validación de datos. //
/* ****************************************/
//
/* validaRegistro: funcion para validar todos los campos del registro
    de un usuario nuevo
 */
function validaFormRegPeso() {
    $("#respServer").text("");
    var fecha = validarFecha();
    var kg = validarKg();
    var fat = validarFat();
    var water = validarWater();
    var mm = validarMM();

    if (fecha && kg && fat && water && mm === true) {
        return true;
    } else {
        return false;
    }
}

/*  validacion fecha:
    permitirá la introducción de fechas desde el año actual (2017)
    en adelante
*/
function validarFecha() {
    var er = /^\d{2,4}-\d{2}-\d{2,4}$/;
    var hoy = new Date();
    var valor = document.getElementById("fecha").value;
    //fecha del usuario
    var dia = parseInt(valor.slice(0, 2));
    var mes = parseInt(valor.slice(3, 5)) - 1;
    var anio = parseInt(valor.slice(6));
    var fechaUsuario = new Date(anio, mes, dia);
    //
    // compruebo que el campo no esté vacio
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconfecha').remove();
        $("#fecha").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFecha").text("debe introducir algún caracter").show();
        $("#fecha").parent().append('<span id="iconfecha"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
        //compruebo que si pasa el formato del campo.
    } else if (!(er.test(valor))) {
        $('#iconfecha').remove();
        $("#fecha").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFecha").text("Formato: dd-mm-aaaa. No puede empezar con espacio en blanco. ").show();
        $("#fecha").parent().append('<span id="iconfecha" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
        // en caso de que cumpla con el formato del campo. compruebo que la fecha es real.
    } else if ((dia == fechaUsuario.getDate()) && (mes == fechaUsuario.getMonth()) && (anio == fechaUsuario.getFullYear())) {
        $('#iconfecha').remove();
        $("#fecha").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errFecha").text("").hide();
        $("#fecha").parent().append('<span id="iconfecha" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    } else {
        $('#iconfecha').remove();
        $("#fecha").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errFecha").text("Revisa la fecha tienes algún dato erroneo, la fecha no existe").show();
        $("#fecha").parent().append('<span id="iconfecha" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
    }
}



/* 
 *   Validación del peso:
 *   se validan la hora (00-23) y los minutos (00-59) 
 */
function validarKg() {
    var er = /^[0-9]+(.[0-9]{1,2})?$/;
    var valor = document.getElementById("kg").value;
    var id = document.getElementById("kg").getAttribute('name');
    var msjErr = "Formato numérico con ',' por separador para decimales";
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        evitaNulos(id);
        return false;
    } else if (er.test(valor)) {
        poneOk(id);
        return true;
    } else {
        poneError(id, msjErr);
        return false;
    }
}

/* 
 *   Validación grasa corporal:
 *   se validan la hora (00-23) y los minutos (00-59) 
 */
function validarFat() {
    var er = /^[0-9]+(.[0-9]{1,2})?$/;
    var valor = document.getElementById("fat").value;
    var id = document.getElementById("fat").getAttribute('name');
    var msjErr = "Formato numérico con ',' opcional como separador para decimales";
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        evitaNulos(id);
        return false;
    } else if (er.test(valor)) {
        poneOk(id);
        return true;
    } else {
        poneError(id, msjErr);
        return false;
    }
}

/* 
 *  Validación agua corporal:
 *  admite solo numeros, con y sin decimales, 
 *  usando como separador una ','. 
 */

function validarWater() {
    var er = /^[0-9]+(.[0-9]{1,2})?$/;
    var valor = document.getElementById("water").value;
    var id = document.getElementById("water").getAttribute('name');
    var msjErr = "Formato numérico con ',' opcional como separador para decimales";
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        evitaNulos(id);
        return false;
    } else if (er.test(valor)) {
        poneOk(id);
        return true;
    } else {
        poneError(id, msjErr);
        return false;
    }
}

/* 
 *  Validación masa muscular:
 *  admite solo numeros, con y sin decimales, 
 *  usando como separador una ','. 
 */

function validarMM() {
    var er = /^[0-9]+(.[0-9]{1,2})?$/;
    var valor = document.getElementById("mm").value;
    var id = document.getElementById("mm").getAttribute('name');
    var msjErr = "Formato numérico con ',' opcional como separador para decimales";
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        evitaNulos(id);
        return false;
    } else if (er.test(valor)) {
        poneOk(id);
        return true;
    } else {
        poneError(id, msjErr);
        return false;
    }
}



/* 
 *  FUNCIONES DEFINIDAS PARA poner y quitar los mensajes y las validaciones
 *   de los campos, pasándole la "id" de los campos y "msjError"
 */

/* 
 *  evitaNulos.
 *  recibe 1 parámetro, la id del campo que se está validando
 *  solo se le llamará si la validación de campo vacio ha sido positiva. 
 */
function evitaNulos(id) {
    $('#icon' + id).remove();
    $("#" + id).parent().parent().attr("class", "form-group has-error has-feedback");
    $('#err' + id).text("debe introducir algún caracter").show();
    $("#" + id).parent().append('<span id="icon' + id + '" class="glyphicon glyphicon-remove form-control-feedback"></span>');
}

/* 
 *  poneOk.
 *  recibe 1 parámetro, la id del campo que se está validando
 *  solo se le llamará si la validación ha sido correcta. 
 */
function poneOk(id) {
    $('#icon' + id).remove();
    $("#" + id).parent().parent().attr("class", "form-group has-success has-feedback");
    $('#err' + id).text("").hide();
    $("#" + id).parent().append('<span id="icon' + id + '" class="glyphicon glyphicon-ok form-control-feedback"></span>');
}
/* 
 *  poneError. 
 *  recibe 2 parámetros, la id del campo que se está validando y también
 *  recibe un mensaje de Error para ayudar al usuario.
 */
function poneError(id, msjErr) {
    $("#icon" + id).remove();
    $("#" + id).parent().parent().attr("class", "form-group has-error has-feedback");
    $('#err' + id).text(msjErr).show();
    $("#" + id).parent().append('<span id="icon' + id + '" class="glyphicon glyphicon-remove form-control-feedback"></span>');
}