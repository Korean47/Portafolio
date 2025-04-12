from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *

w,h=500,500

def cuadro():
    glBegin(GL_QUADS)
    glVertex2f(100,100)
    glVertex2f(200,100)
    glVertex2f(200,200)
    glVertex2f(100,200)
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
    glutSwapBuffers()

glutInit()
glutInitDisplayMode(GLUT_RGBA)
glutInitWindowSize(500,500)
glutInitWindowPosition(0,0)
wind = glutCreateWindow(b"OpenGL")

glutDisplayFunc(showScreen)
glutIdleFunc(showScreen)
glutMainLoop()