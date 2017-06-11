/* funcion de inicio */
function inicioListadoEjercicios() {
    var usLogueado = Cookies.get('id_usuario');
    //
    if (usLogueado == null || usLogueado.length == 0 || /^\s+$/.test(usLogueado)) {
        var txt = "<div class='aviso'><strong>Debes entrar primero como usuario   </strong>";
        var link = "<a href='login.html' class='ARespServer'><span class='glyphicon glyphicon-user'>LOGUEATE</span></a></div>";
        $('#respServer').html(txt + link).show();
        // vacio el tbody de la tabla
        var tbl = $('#listado1');
        tbl.html("");
        // relleno la tabla en blanco
        for (var i = 1; i < 11; i++) {
            $("<tr id='peso_" + i + "' onclick=''>" +
                "<td>" + [i] + "</td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>").appendTo(tbl);
        }
        return false;
    } else {
        // validacion online de los campos 
        $('#id_usuario').change(inicioListadoEjercicios);
        // creo variable para la petición ajax. 
        var peticion_http = null;
        // 
        if (Cookies.get('id_usuario') != "") {
            peticionAjax_ListadoE();
        } else {
            var txt = "<div class='aviso'><strong>No hay datos disponibles, debes entrar primero como usuario </strong>";
            var link = "<a href='login.html' class='ARespServer'><span class='glyphicon glyphicon-user'>LOGUEATE</span></a></div>";
            $('#respServer').html(txt + link).show();

        }
    } /*cierra if de si el usuario se ha logueado o no*/
} /*cierra funcion INICIO*/
/* 
 *   funcion peticion AJAX:
 *  Esta petición nos servirá un listado de todas las actividades registradas
 *  por el usuario logueado.
 */
function peticionAjax_ListadoE() {
    peticion_http = new XMLHttpRequest();
    if (peticion_http) {
        peticion_http.onload = procesarRespuestReportEjercicios;
        peticion_http.open("post", "php/reportEjercicios.php", true);
        peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var jsonn = crearJsonReportEjercicios();
        console.log("JSON- IdUsuario=>  " + jsonn);
        peticion_http.send("reportEjerc=" + crearJsonReportEjercicios());
    }

    /*creamos JSON, para envio a "registroEjercicio.php" */
    function crearJsonReportEjercicios() {
        var objson = new Object();
        objson.id_usuario = Cookies.get('id_usuario');
        return (JSON.stringify(objson));
    }

    /* PROCESAMOS la respuesta devuelta del servidor */
    function procesarRespuestReportEjercicios() {
        var objResp = JSON.parse(peticion_http.responseText);
        //var objResp = JSON.parse(peticion_http.responseText);
        var mostrarRespuestaServidor = $('#respServer').show();
        var respuesta = objResp.respuesta;
        console.log("numReg:" + objResp.respuesta.length);
        //
        if (respuesta.length > 0) {
            // vacio el tbody de la tabla
            var tbl = $('#listado1');
            tbl.html("");
            // relleno la tabla.
            for (var i = 0; i < objResp.respuesta.length; i++) {
                $("<tr id='ejercicio_" + i + "' onclick=''>" +
                    "<td>" + respuesta[i].id_regEjercicio + "</td>" +
                    "<td>" + respuesta[i].fecha + "</td>" +
                    "<td>" + respuesta[i].deporte + "</td>" +
                    "<td>" + respuesta[i].tiempo + "</td>" +
                    "<td>" + respuesta[i].kcal + "</td>" +
                    "<td>" + respuesta[i].desnivel + "</td>" +
                    "<td>" + respuesta[i].kms + "</td>" +
                    "</tr>").appendTo(tbl);
            }
        } else {
            tablaVacia('#listado1');
            var txt = "<div class='aviso'><strong>Actualmente no tienes datos registrados, ";
            var link = "<a href='registroEjercicios.html' class='ARespServer'><span class='glyphicon glyphicon-edit'> introduce alguno </span></a></div>";
            $('#respServer').html(txt + link).show();

        }
    }
} /*fin peticionAjax */

function tablaVacia(tabla) {
    var tbl = $(tabla);
    tbl.html("");
    // relleno la tabla en blanco
    for (var i = 1; i < 11; i++) {
        $("<tr id='peso_" + i + "' onclick=''>" +
            "<td>" + [i] + "</td>" +
            "<td></td>" +
            "<td></td>" +
            "<td></td>" +
            "<td></td>" +
            "<td></td>" +
            "<td></td>" +
            "<td></td>" +
            "</tr>").appendTo(tbl);
    }
}