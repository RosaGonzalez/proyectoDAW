<?php
require_once "conexion.php";


/* 
 *   
 */
 class reportEjercicios{
     public function conexion()
     {
        $datosRecibidos = json_decode($_POST["reportEjerc"], true);
        //
        $id_usuario = $datosRecibidos['id_usuario'];
        //
        $objResp = new stdClass();
        $objResp->respuesta= "";

        $bd = new conexionBBDD();
        $bd->connect();
        //
        $respuesta = $bd->listarEjercicios($id_usuario);
        //
        $objResp->respuesta = $respuesta;
        //
        print json_encode($objResp);
     }
     // funcion para buscar la Id del usuario
 }
 if (isset($_POST['reportEjerc'])) 
 {
    $reportEjercicios = new reportEjercicios();
    $reportEjercicios->conexion();
}