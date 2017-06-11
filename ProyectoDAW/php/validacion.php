<?php

/* 
* clase validacion, creada para la validación de datos antes su inserción
* en nuestra bbdd 
*/

class validacion{
    // creamos variable privadas para poder hacer las validaciones de datos
    private $_camposObligatorios = array();
    private $_camposErroneos = array();
    private $_camposRecibidos = array();

    // creamos nuestro constructor e inicializamos $_camposObligatorios
    public function __construct($_camposObligatorios='') {
        $this->_camposObligatorios = $_camposObligatorios;
    }

    //funcion para regocer campos erroneos
    public function getCamposErroneos(){
        return $this-> _camposErroneos;
    }

    //funcion para validarCampos
    public function validacionCampos(){
        foreach ($this-> _camposObligatorios as $co){
            switch ($this-> _campoValido ($co[0], $co[1])){
                case "erroneo":
                array_push($this-> _camposErroneos, $co[0]);
                break;
            }
        }
    }

    // funcion que dependiendo del tipo de validacion que le hayamos 
    // pasado al dato, vaya a comprobar si es correcto o no a la función
    // correspondiente a ese formato.
 private function _campoValido($campo, $tipo)
    {
    switch ($tipo) {

          case "letraNum":
                if (!$this->_esLetraNum($campo)) return "erroneo";
                break;
            case "letraNumRaros":
                if (!$this->_letraNumRaros($campo)) return "erroneo";
                break;
              case "email":
                if (!$this->_esEmail($campo)) return "erroneo";
                break;
            case "fecha":
                if (!$this->_esFecha($campo)) return "erroneo";
                break;
                //
            case "numero":
                if (!$this->_esNumero($campo)) return "erroneo";
                break;
            case "decimal":
                if (!$this->_esDecimal($campo)) return "erroneo";
                break;
            case "tiempo":
                if (!$this->_esTiempo($campo)) return "erroneo";
                break;
            case "letra":
                if (!$this->_esLetra($campo)) return "erroneo";
                break;

        }
        return "valido";
    }

// funciones para validacion de datosprivate

    /* funcion valida usuario */
    private function _esLetraNum($str)
    {
        return preg_match("/^[a-zA-ZÑñ0-9][a-zA-ZÑñ0-9 ]{1,30}+$/", $str);
    }

   /* funcion valida password */
    private function _letraNumRaros($str)
    {
        return preg_match("/^[a-zA-Z0-9][a-zA-ZáéíóúÁÉÍÓÚ0-9\W ]+$/", $str);
    }
    /* funcion valida email */
    private function _esEmail($str)
    {
        return preg_match("/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/", $str);
    }
    /* funcion validación de fecha */
    private function _esFecha($str)
    {
        return preg_match("/^\d{4}\-\d{2}\-\d{2}$/", $str);
    }

    /* ************VALIDACIONES PARA REGISTRO DE EJERCICIO**************** */
    private function _esDecimal($str)
    {
        return preg_match("/^[0-9]+(.[0-9]{1,2})?$/", $str);
    }

    private function _esNumero($num)
    {
        return preg_match("/^([0-9]{1,9})$/", $num);
    }

    private function _esTiempo($hora)
    {
         return preg_match("/^\d{2}:\d{2}$/", $hora);
    }
        private function _esLetra($str)
    {
        return preg_match("/^[a-zA-ZÑñ][a-zA-ZÑñ ]{1,30}+$/", $str);
    }
    

}