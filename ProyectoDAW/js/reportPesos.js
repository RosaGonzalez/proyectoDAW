/* funcion de inicio */
function inicioListadoPesos() {
    var usLogueado = Cookies.get('id_usuario');
    //
    if (usLogueado == null || usLogueado.length == 0 || /^\s+$/.test(usLogueado)) {
        var txt = "<div class='aviso'><strong>Debes entrar primero como usuario   </strong>";
        var link = "<a href='login.html' class='ARespServer'><span class='glyphicon glyphicon-user'>LOGUEATE</span></a></div>";
        $('#respServer').html(txt + link).show();
        // vacio el tbody de la tabla
        var tbl = $('#listado2');
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
        $('#id_usuario').change(inicioListadoPesos);
        // creo variable para la petición ajax. 
        var peticion_http = null;
        // 
        if (Cookies.get('id_usuario') != "") {
            peticionAjax_ListadoP();
        } else {
            var txt = "<div class='aviso'><strong>No hay datos disponibles, debes entrar primero como usuario </strong>";
            var link = "<a href='login.html'class='ARespServer'><span class='glyphicon glyphicon-user'>LOGUEATE</span></a></div>";
            $('#respServer').html(txt + link).show();
        }
    } /*cierra if de si el usuario se ha logueado o no*/
} /*cierra funcion INICIO*/
/* 
 *   funcion peticion AJAX:
 *  Esta petición nos servirá un listado de todas las actividades registradas
 *  por el usuario logueado.
 */
function peticionAjax_ListadoP() {
    peticion_http = new XMLHttpRequest();
    if (peticion_http) {
        peticion_http.onload = procesarRespuestReportPesos;
        peticion_http.open("post", "php/reportPesos.php", true);
        peticion_http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        var jsonn = crearJsonReportPesos();
        console.log("JSON- IdUsuario=>  " + jsonn);
        peticion_http.send("reportPesos=" + crearJsonReportPesos());
    }

    /*creamos JSON, para envio a "registroEjercicio.php" */
    function crearJsonReportPesos() {
        var objson = new Object();
        objson.id_usuario = Cookies.get('id_usuario');
        return (JSON.stringify(objson));
    }

    /* PROCESAMOS la respuesta devuelta del servidor */
    function procesarRespuestReportPesos() {
        var objResp = JSON.parse(peticion_http.responseText);
        //var objResp = JSON.parse(peticion_http.responseText);
        var mostrarRespuestaServidor = $('#respServer').show();
        var respuesta = objResp.respuesta;
        console.log("numReg:" + objResp.respuesta.length);
        //
        if (respuesta.length > 0) {
            // vacio el tbody de la tabla
            var tbl = $('#listado2');
            tbl.html("");
            // relleno la tabla.
            for (var i = 0; i < objResp.respuesta.length; i++) {
                $("<tr id='peso_" + i + "' onclick=''>" +
                    "<td>" + respuesta[i].id_regPeso + "</td>" +
                    "<td>" + respuesta[i].fecha + "</td>" +
                    "<td>" + respuesta[i].kg + "</td>" +
                    "<td>" + respuesta[i].fat + "</td>" +
                    "<td>" + respuesta[i].water + "</td>" +
                    "<td>" + respuesta[i].mm + "</td>" +
                    "</tr>").appendTo(tbl);
            }
        } else {
            var txt = "<div class='aviso'><strong>Actualmente no tienes datos registrados, ";
            var link = "<a href='registroPesos.html'class='ARespServer'><span class='glyphicon glyphicon-edit'> introduce alguno </span></a></div>"
            $('#respServer').html(txt + link).show();
            // vacio el tbody de la tabla
            var tbl = $('#listado2');
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
    }
} /*fin peticionAjax */