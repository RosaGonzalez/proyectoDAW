<?php
require_once "conexion.php";


/* 
 *   
 */
 class reportPesos{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["reportPesos"], true);
        //
        $id_usuario = $datosRecibidos['id_usuario'];
        //
        $objResp = new stdClass();
        $objResp->respuesta= "";

        $bd = new conexionBBDD();
        $bd->connect();
        //
        $respuesta = $bd->listarPesos($id_usuario);
        //
        $objResp->respuesta = $respuesta;
        //
        print json_encode($objResp);
     }
     // funcion para buscar la Id del usuario
 }
 if (isset($_POST['reportPesos'])) 
 {
    $reportPesos = new reportPesos();
    $reportPesos->conexion();
}