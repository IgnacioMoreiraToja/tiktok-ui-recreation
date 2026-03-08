package org.example.utils

class StringVerifier {
    fun verificarEmail(email: String): Boolean {
        // Verifica alfanumericos + (_-%+) en la primer parte. Alfanumericos en la segunda parte y solo letras en la parte final, con un minimo de 2.
        val regex = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\$".toRegex()
        return regex.matches(email)
    }

    fun verificarImage(image: String): Boolean {
        // Verifica que contenga un URL valido. Decision del TP, ya que tomamos que todas las image sean obtenidas por URL.
        val regex  = "^(http|https|ftp)://.*".toRegex()
        return regex.matches(image)
    }
}