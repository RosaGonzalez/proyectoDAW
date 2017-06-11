<?php
require_once "conexion.php";
require_once "validacion.php";

/**
 * Clase Registro
 * la cual recoge el JSON de registro.js.
 * valida los datos recibidos antes de enviarlos a la BBDD 
 * recoge id, login.
 */
 class registroPesos{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["datosPeso"], true);
        //
        $id_usuario = $datosRecibidos['id_usuario'];
        $fecha = $datosRecibidos['fecha'];
        $kg = $datosRecibidos['kg'];
        $fat = $datosRecibidos['fat'];
        $water = $datosRecibidos['water'];
        $mm = $datosRecibidos['mm'];

        // campos obligatorios
        $camposObligatorios = array (
            [$id_usuario, "numero"], 
            [$fecha, "fecha"], 
            [$kg, "decimal"], 
            [$fat, "decimal"],
            [$water, "decimal"],
            [$mm, "decimal"]
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
            $respuesta = $bd->insertaPeso($id_usuario, $fecha, $kg, $fat, $water, $mm);
            $objResp->respuesta = $respuesta;
        }else{
            $objResp->respuesta = "errorValidacionDatos";
        }
        print json_encode($objResp);
     }
 }

 if (isset($_POST['datosPeso'])) {
    $registrarPeso = new registroPesos();
    $registrarPeso->conexion();
}