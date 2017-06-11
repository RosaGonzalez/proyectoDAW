<?php

/*
 * Cargamos Framework MEDOO, através del cual nos conectaremos a la Base de datos
 */

require_once "../lib/php/medoo.php";

class conexionBBDD
{
    private $database;

    /**
     * Creamos un objeto de la clase medoo, para poder realizar a continuación 
     * operaciones con nuestra base de datos. 
     * en esta funcion declaramos parámetros básicos (nombre de bbdd, usuario,..etc)
     */
    public function connect()
    {
        $this->database = new medoo([
            'database_type' => 'mysql',
            'database_name' => 'planificando',
            'server' => 'localhost',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',
            'port' => 3306,
            'option' => [PDO::ATTR_CASE => PDO::CASE_NATURAL]]);
    }

    /* Comprobamos si existe un usuario con el mismo nombre o email o ambos
     */
    public function comprobarRegistro($usuario, $email)
    {
        if (
            ($this->database->select("usuarios", ["usuario", "email"], ["usuario" => $usuario, "email" => $email])) ||
            ($this->database->select("usuarios", "email", ["email" => $email])) ||
            ($this->database->select("usuarios", "usuario", ["usuario" => $usuario]))
        ) {
            // echo("conexion.php=>comprobarRegistro(user,mail=FALSE) ");
            return false;
        }
        return true;
    }

    /* Funcion que INSERTA USUARIO en la base de datos
     */
    public function insertaUsuario($usuario, $pass, $email, $fnac, $sexo)
    {
        if($this->comprobarRegistro($usuario, $email)){
            return $this->database->insert("usuarios",
            [
                "usuario" => $usuario,
                "pass" => $pass,
                "email" => $email,
                "fnac" => $fnac,
                "sexo" => $sexo
            ]
        );
       }else{ 
        //  echo("conexion.php=> InsertUser() el usuario, el mail o ambos ya existen");
           return "El usuario, el mail o ambos ya existen";
       }
    }


/* Funcion que INSERTA REGISTRO EJERCICIOS en la base de datos
     */
     // QUITO: , 
    public function insertaEjercicio($id_usuario, $fecha, $deporte, $tiempo, $kcal, $desnivel, $kms)
    {
            $this->database->insert("reg_ejercicios",
            [
                "id_usuario" => $id_usuario,
                "fecha" => $fecha,
                "deporte" => $deporte,
                "tiempo" => $tiempo,
                "kcal" => $kcal,
                "desnivel" => $desnivel,
                "kms" => $kms
            ]
        );
        return "OK, actividad registrada con exito!! ";
       
    }

/* Funcion que INSERTA REGISTRO PESOS en la base de datos
     */
     // QUITO: , 
    public function insertaPeso($id_usuario, $fecha, $kg, $fat, $water, $mm)
    {
            $this->database->insert("reg_pesos",
            [
                "id_usuario" => $id_usuario,
                "fecha" => $fecha,
                "kg" => $kg,
                "fat" => $fat,
                "water" => $water,
                "mm" => $mm
            ]
        );
        return "OK, Peso registrado con exito!! ";
       
    }

/*
*   funcion que busca y selecciona un usuario, si coincide usuario y password
*   cuando hacemos login en nuestra web
*/
    public function buscaUsuarioLogin($usuario, $pass)
    {
        return $this->database->query("SELECT usuario, pass, id_usuario FROM usuarios WHERE usuario = '$usuario' AND pass = '$pass';")->fetchAll();
    }

/* fUNCION PARA LISTAR LOS EJERCICIOS DE UN USUARIO. 
*/

public function listarEjercicios($id_usuario)
{
   return $this->database->query("SELECT id_regEjercicio, fecha, deporte, tiempo, kcal, desnivel, kms FROM reg_ejercicios WHERE id_usuario = '$id_usuario';")->fetchAll();
}


/* fUNCION PARA LISTAR LOS EJERCICIOS DE UN USUARIO. 
*/

public function listarPesos($id_usuario)
{
   return $this->database->query("SELECT id_regPeso, fecha, kg, fat, water, mm FROM reg_pesos WHERE id_usuario = '$id_usuario';")->fetchAll();
}

/*
*   funcion para seleccionar el usuario
*   cuando hacemos login en nuestra web
*/
    public function buscaIdUsuario($usuario)
    {
        $IDUsuarioLogueado = $this->database->query("SELECT id_usuario FROM usuarios WHERE usuario = '$usuario';")->fetchAll();
        //echo("conexion.php:86, buscaID Usuario ");
        return $IDUsuarioLogueado;
    }
}