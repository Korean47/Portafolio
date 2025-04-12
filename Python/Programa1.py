from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *

# Numero de ventana
window = 0

# Medida de la ventana
width, height = 600, 400

# Funcion que se llamara para realizar el dibujo
def Dibujar():
    #Se limpia la pantalla con el color deseado
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    #Se restablece la posicion de la pantalla asi como del grafico por medio de una matriz identidad
    glLoadIdentity()
    #Aqui se puede realizar el dibujo deseado

    #Se establece el buffer para dibujarlo
    glutSwapBuffers()

#Se inicializa la libreria GLUT
glutInit()
#Se inicializa el modo de visualizacion de la ventana
glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_ALPHA | GLUT_DEPTH)
#Inicializar el tamaño de la ventana
glutInitWindowSize(width, height)
#Inicializar la posicion de la ventana
glutInitWindowPosition(0, 0)
#Se crea la ventana con un titulo
window = glutCreateWindow("Ventana de Prueba")
#Definir el callback para redibujar la ventana. Esta funcion se llamara cada vez que se redibuje la ventana
glutDisplayFunc(Dibujar)
#Esta funcion se usa cuendo no ocurre nada, para redibujar la escena
glutIdleFunc(Dibujar)
#El bucle de eventos se pone en marcha
glutMainLoop()