<?php
require_once "conexion.php";
require_once "validacion.php";

/**
 * Clase Registro
 * la cual recoge el JSON de registro.js.
 * valida los datos recibidos antes de enviarlos a la BBDD 
 * recoge id, login. ???????????
 */
 class registroEjercicios{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["datosEjercicio"], true);
        //
        $id_usuario = $datosRecibidos['id_usuario'];
        $fecha = $datosRecibidos['fecha'];
        $deporte = $datosRecibidos['deporte'];
        $tiempo = $datosRecibidos['tiempo'];
        $kcal = $datosRecibidos['kcal'];
        $desnivel = $datosRecibidos['desnivel'];
        $kms = $datosRecibidos['kms'];

        // campos obligatorios
        $camposObligatorios = array (
            [$id_usuario, "numero"], 
            [$fecha, "fecha"], 
            [$deporte, "letra"], 
            [$tiempo, "tiempo"],
            [$kcal, "decimal"],
            [$desnivel, "decimal"], 
            [$kms, "decimal"]
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
            $respuesta = $bd->insertaEjercicio($id_usuario, $fecha, $deporte, $tiempo, $kcal, $desnivel, $kms);
            $objResp->respuesta = $respuesta;
        }else{
            $objResp->respuesta = "errorValidacionDatos";
        }
        print json_encode($objResp);
     }
 }

 if (isset($_POST['datosEjercicio'])) {
    $registrar = new registroEjercicios();
    $registrar->conexion();
}