/* 
    Autor:      Rosa María González Pérez
    Fecha:      21/diciembre /2016
    Licencia:   GPL v3
    Versión:    1.0
    Descripción:  Planificando. 
                  control de la formulario de login, y gestión de las cookies

    Copyright (C) 2016  Rosa María González Pérez
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/* Crea una cookie a pasándole por parametros:
 * nombre, valor y un tiempo de expiracion en dias
 */
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

/* Devuelve el valor de la cookie
 * recibe parámetro "cookie name"
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return decodeURI(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

/* Borra las cookies de usuario
 */
function userlogout() {
    eraseCookie('usuario');
    eraseCookie('surname1');
}

/* Borramos la cookie name
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}

/* Obtiene el valor de las cookies de usuario 
 */
function getCookies() {
    document.getElementById('usuario').value = getCookie('usuario');
    document.getElementById('pass').value = getCookie('pass');
}

/* si existe la cookie
 * lo ponemos en la barra de navegación.
 */
function setNameCookie() {
    if (getCookie('usuario').length)
        document.getElementById("user").innerText = getCookie('name');

}