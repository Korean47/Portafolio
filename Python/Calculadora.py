#!/usr/bin/python
# -*- coding: utf-8 -*-
import os

# FUNCIONES DE LA CALCULADORA

# FUNCION QUE SUMA DOS VALORES
def sumar(valor1=0, valor2=0):
    return valor1 + valor2

# FUNCION QUE RESTA DOS VALORES
def restar(valor1=0, valor2=0):
    return valor1 - valor2

# FUNCION QUE MULTIPLICA DOS VALORES
def multiplicar(valor1=0, valor2=0):
    return valor1 * valor2

# FUNCION QUE DIVIDE DOS VALORES
def dividir(valor1=0, valor2=1):
    if valor2 == 0:
        return "Error: División por cero"
    return valor1 / valor2

# FUNCION QUE CALCULA LA POTENCIA DE UN VALOR
def potencia(valor1=0, valor2=0):
    return valor1 ** valor2

# FUNCION QUE CALCULA LA RAÍZ CUADRADA DE UN VALOR
def raiz_cuadrada(valor1=0):
    if valor1 < 0:
        return "Error: Raíz cuadrada de un número negativo"
    return valor1 ** 0.5

# MENU DE OPCIONES
def menu():
    print("** ::::::::::::::::::::::::: **")
    print(":: Seleccione una operación ::")
    print("** ::::::::::::::::::::::::: **")
    print("-------------------------------")
    print("| Suma:             ->  1     |")
    print("| Resta:            ->  2     |")
    print("| Multiplicación:   ->  3     |")
    print("| División:         ->  4     |")
    print("| Potencia:         ->  5     |")
    print("| Raiz cuadrada:    ->  6     |")
    print("-------------------------------")
    print("** ::::::::::::::::::::::::: **")
    print("\n")

# OPCIÓN DEL MENU
def opciones():
    opcion = int(input("Seleccione una Opción... "))
    return opcion

def valores():
    valor1 = int(input("Ingrese su primer valor: "))
    valor2 = int(input("Ingrese su segundo valor: "))
    return (valor1, valor2)

menu()
opc = opciones()

# MODULO DE SUMA
if opc == 1:
    print("\n")
    print("** Entrando al módulo de Suma **")
    valoresTeclado = valores()
    valor1 = valoresTeclado[0]
    valor2 = valoresTeclado[1]
    resultadoSuma = sumar(valor1, valor2)
    print("El resultado de su suma es: " + str(resultadoSuma))

# MODULO DE RESTA
elif opc == 2:
    print("\n")
    print("** Entrando al módulo de Resta **")
    valor1 = int(input("Ingrese su primer valor: "))
    valor2 = int(input("Ingrese su segundo valor: "))
    resultadoResta = restar(valor1, valor2)
    print("El resultado de su resta es: " + str(resultadoResta))

# MODULO DE MULTIPLICACIÓN
elif opc == 3:
    print("\n")
    print("** Entrando al módulo de Multiplicación **")
    valor1 = int(input("Ingrese su primer valor: "))
    valor2 = int(input("Ingrese su segundo valor: "))
    resultadoMultiplicacion = multiplicar(valor1, valor2)
    print("El resultado de su multiplicación es: " + str(resultadoMultiplicacion))

# MODULO DE DIVISIÓN
elif opc == 4:
    print("\n")
    print("** Entrando al módulo de División **")
    valor1 = int(input("Ingrese su primer valor: "))
    valor2 = int(input("Ingrese su segundo valor: "))
    resultadoDivision = dividir(valor1, valor2)
    print("El resultado de su división es: " + str(resultadoDivision))

# MODULO DE POTENCIA
elif opc == 5:
    print("\n")
    print("** Entrando al módulo de Potencia **")
    valor1 = int(input("Ingrese la base: "))
    valor2 = int(input("Ingrese el exponente: "))
    resultadoPotencia = potencia(valor1, valor2)
    print("El resultado de su potencia es: " + str(resultadoPotencia))

# MODULO DE RAÍZ CUADRADA
elif opc == 6:
    print("\n")
    print("** Entrando al módulo de Raíz Cuadrada **")
    valor1 = int(input("Ingrese el valor: "))
    resultadoRaiz = raiz_cuadrada(valor1)
    print("El resultado de su raíz cuadrada es: " + str(resultadoRaiz))

else:
    print("Opción no válida")