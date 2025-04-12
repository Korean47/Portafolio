from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *

w,h=500,500

def cuadro():
    glBegin(GL_QUADS)
    glVertex2f(10,10)
    glVertex2f(20,10)
    glVertex2f(20,20)
    glVertex2f(10,20)
    glEnd()

def cuadroSinRelleno():
    glBegin(GL_LINE_LOOP)
    glVertex2f(100, 100)
    glVertex2f(200, 100)
    glVertex2f(200, 200)
    glVertex2f(100, 200)
    glEnd()   

def triangulo():
    glBegin(GL_TRIANGLES)
    glVertex2f(300,300)
    glVertex2f(400,300)
    glVertex2f(350,400)
    glEnd()

def trianguloSinRelleno():
    glBegin(GL_LINE_LOOP)
    glVertex2f(300, 300)
    glVertex2f(400, 300)
    glVertex2f(350, 400)
    glEnd()

def punto():
    glBegin(GL_POINTS)
    glVertex2f(250,250)
    glEnd()

def linea():
    glBegin(GL_LINES)
    glVertex2f(50,50)
    glVertex2f(150,50)
    glEnd()    

def Espacio():
    glViewport(0,0,500,500)
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()

    glOrtho(0.0,500,0.0,500,0.0,1.0)
    glMatrixMode(GL_MODELVIEW)
    glLoadIdentity()

def showScreen():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glLoadIdentity()
    Espacio()
    cuadro()
    #cuadroSinRelleno()
    #triangulo()
    trianguloSinRelleno()
    punto()
    linea()
    glutSwapBuffers()

glutInit()
glutInitDisplayMode(GLUT_RGBA)
glutInitWindowSize(500,500)
glutInitWindowPosition(0,0)
wind = glutCreateWindow(b"OpenGL")

glutDisplayFunc(showScreen)
glutIdleFunc(showScreen)
glutMainLoop()