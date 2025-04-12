#Daniel Arellano 21340459

import string
import random
from datetime import datetime 
   
def generarHomoclave():
    letras = string.ascii_uppercase
    numeros = string.digits
    caracteres = letras + numeros
    homoclave = "".join(random.choices(caracteres, k=3))
    return homoclave

def main():
    nombre = input("Ingresa tu nombre: ")    
    apellido_paterno = input("Ingresa tu apellido paterno: ")
    apellido_materno = input("Ingresa tu apellido materno: ")
    fecha = input("Ingresa tu año de nacimiento con el formato YYYY-MM-DD: ")
    fechaNacimiento = datetime.strptime(fecha, '%Y-%m-%d')
    fechaRFC = fechaNacimiento.strftime('%y%m%d')
    rfc = apellido_paterno[:2] + apellido_materno[0] + nombre[0] + str(fechaRFC) + generarHomoclave()
    print("Tu RFC es:", rfc.upper())

if __name__ == "__main__":
    main()