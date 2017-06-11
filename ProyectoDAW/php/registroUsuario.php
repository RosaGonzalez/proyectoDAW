<?php
require_once "conexion.php";
require_once "validacion.php";

/**
 * Clase Registro
 * la cual recoge el JSON de registro.js.
 * valida los datos recibidos antes de enviarlos a la BBDD 
 * recoge id, login. ???????????
 */
 class Registro{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["datosRegistro"], true);
        //
        $usuario = $datosRecibidos['usuario'];
        $pass = $datosRecibidos['pass'];
        $email = $datosRecibidos['email'];
        $fnac = $datosRecibidos['fnac'];
        $sexo = $datosRecibidos['sexo'];
        // campos obligatorios
        $camposObligatorios = array (
            [$usuario, "letraNum"], 
            [$pass, "letraNum"], 
            [$email, "email"], 
            [$fnac, "fecha"]
        );
        //
        $campos_a_validar = new validacion($camposObligatorios);
        //
        $objResp = new stdClass();
        $campos_a_validar->validacionCampos();
        //
        if(!$campos_a_validar->getCamposErroneos()){
            $bd = new conexionBBDD();
            $bd->connect();
            //
            if($bd->comprobarRegistro($usuario, $email)){
                $respuesta = $bd->insertaUsuario($usuario, $pass, $email, $fnac, $sexo);
                $objResp->respuesta = $respuesta;
            }else{
                $objResp->respuesta = "";
            }
        }else{
            $objResp->respuesta = "errorValidacionDatos";
        }
        print json_encode($objResp);
     }
 }

 if (isset($_POST['datosRegistro'])) {
    $registrar = new Registro();
    $registrar->conexion();
}