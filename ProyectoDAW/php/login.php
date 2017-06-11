<?php
require_once "conexion.php";
require_once "validacion.php";

/* 
*   Creamos la clase Login, para permitir el logueo
*   de nuestros usuarios ya registrados. 
*   validaremos los datos recibidos y los enviaremos 
*   a la bbdd, para comprobar que existe y recogeremos Id, usuario
*   en caso contrario, informaremos al usuario de que no existe en nuestra BBDD
 */

 class Login{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["datosLogin"], true);
        //
        $usuario = $datosRecibidos['usuario'];
        $pass = $datosRecibidos['pass'];

        // campos obligatorios
        $camposObligatorios = array (
            [$usuario, "letraNum"], 
            [$pass, "letraNum"], 
        );
        //
        $campos_a_validar = new validacion($camposObligatorios);
        //
        $objResp = new stdClass();
        $objResp->respuesta= "";
        //
        $campos_a_validar->validacionCampos();
        //
        if(!$campos_a_validar->getCamposErroneos()){
            $bd = new conexionBBDD();
            $bd->connect();
            //
            $respuesta = $bd->buscaUsuarioLogin($usuario, $pass);

            $objResp->respuesta = $respuesta;
        }
        print json_encode($objResp);
     }
     // funcion para buscar la Id del usuario
    public function buscarID(){
        $bd = new conexionBBDD();
        $bd->connect();
        //
        $objResp = new stdClass();
        $objResp->respuesta = $bd->buscaIdUsuario($_POST["usuarioLogin"]);
        print json_encode($objResp);
    }
 }

 if (isset($_POST['datosLogin'])) 
 {
    $logueo = new Login();
    $logueo->conexion();
}
else if(isset($_POST['usuarioLogin']))
    {
    $logueo->buscarID();
    }