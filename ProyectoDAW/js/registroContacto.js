/* inicio: 
    funcion a la que se llama cuando la página está cargada
    inicializa el formulario y activa las funciones de validación
    de los campos en el momento
*/

function envioContacto() {
    $("#respServer").hide();
    $("span.help-block").hide();

    // validacion online de los campos 
    $("#nombre").keyup(validarNombre);
    $("#tfno").keyup(validarTfno);
    $("#email").keyup(validarEmail);

    /* boton registrar del formulario registro */
    $("#btnEnvioContacto").on('click', function(e) {
        /* evitamos el envio sin datos */
        e.preventDefault();

        /*comprobamos que la validación de datos ha sido correcta
          antes de proceder al envio de datos */
        $('#respServer').show();
        //
        console.log(validaFormContacto());
        if (validaFormContacto()) {
            $('#respServer').html("<div class='validado'><strong>Formulario enviado!!</strong></div>");
            /* borro los datos del formulario */
            $('#nombre').val("");
            $('#tfno').val("");
            $('#email').val("");
            $('#descripcion').val("");

            $("[id*=icon]").hide();
        } else {
            console.log("1 " + $('#respServer').val());
            $('#respServer').html("<div class='error'><strong>Error de validación. Por favor revise los datos introducidos </strong></div>");
            console.log("2 " + $('#respServer').val());
        }
    });
}
/*   **/
/* validaRegistro: funcion para validar todos los campos del registro
    de un usuario nuevo
 */
function validaFormContacto() {
    $("#respServer").text("");
    var nb = validarNombre();
    var tf = validarTfno();
    var em = validarEmail();

    if (nb && tf && em === true) {
        return true;
    } else {
        return false;
    }
}

/* validacion del usuario: 
    debe comenzar por letra y acontinuación se permiten: 
    letras, numeros, vocales acentuadas, ñÑ, guion bajo, guion medio
*/

function validarNombre() {
    var er = /^[a-zA-Z][a-zA-ZáéíóúÁÉÍÓÚÑñ0-9 \-_]+$/;
    var valor = document.getElementById("nombre").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconNombre').remove();
        $("#nombre").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errNombre").text("debe introducir algún caracter").show();
        $("#nombre").parent().append('<span id="iconNombre"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconNombre').remove();
        $("#nombre").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errNombre").text("Debe empezar por letra y admite númerosn y guiones").show();
        $("#nombre").parent().append('<span id="iconNombre" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconNombre').remove();
        $("#nombre").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errNombre").text("").hide();
        $("#nombre").parent().append('<span id="iconNombre" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
    }
}


/* validacion del telefono: 
    solamente números. solo se comprueba que haya 9 números 
*/
function validarTfno() {
    var er = /^\d{9}$/;
    var valor = document.getElementById("tfno").value;
    //
    if (valor == null || valor.length == 0 || /^\s+$/.test(valor)) {
        $('#iconTfno').remove();
        $("#tfno").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errTfno").text("debe introducir algún caracter").show();
        $("#tfno").parent().append('<span id="iconTfno"class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else if (!(er.test(valor))) {
        $('#iconTfno').remove();
        $("#tfno").parent().parent().attr("class", "form-group has-error has-feedback");
        $("#errTfno").text("Solo se admiten 9 números").show();
        $("#tfno").parent().append('<span id="iconTfno" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;

    } else {
        $('#iconTfno').remove();
        $("#tfno").parent().parent().attr("class", "form-group has-success has-feedback");
        $("#errTfno").text("").hide();
        $("#tfno").parent().append('<span id="iconTfno" class="glyphicon glyphicon-ok form-control-feedback"></span>');
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