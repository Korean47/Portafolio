from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *
import math

# Variables globales para control de cámara
cam_distance = 5.0
cam_angle_x = 0.0
cam_angle_y = 90.0
last_x = 0
last_y = 0
mouse_down = False

def draw_cylinder(radius, height, slices):
    quadric = gluNewQuadric()
    gluQuadricNormals(quadric, GLU_SMOOTH)
    gluCylinder(quadric, radius, radius, height, slices, 1)
    
    glPushMatrix()
    glTranslatef(0, 0, height)
    gluDisk(quadric, 0, radius, slices, 1)
    glPopMatrix()
    
    gluDisk(quadric, 0, radius, slices, 1)

def drawCylinder(radius, height, slices, position, angle):
    glPushMatrix()
    glTranslatef(position[0], position[1], position[2])  # Posición (x, y, z)
    glRotatef(angle[0], angle[1], angle[2], angle[3])  # Rotación en X (ángulo, eje_x, eje_y, eje_z)

    quadric = gluNewQuadric()
    gluQuadricNormals(quadric, GLU_SMOOTH)
    gluCylinder(quadric, radius, radius, height, slices, 1)
    
    glPushMatrix()
    glTranslatef(0, 0, height)
    gluDisk(quadric, 0, radius, slices, 1)
    glPopMatrix()
    
    gluDisk(quadric, 0, radius, slices, 1)    
    glPopMatrix()

def draw_partial_sphere(radius, slices, stacks, start_angle, end_angle):
    if abs(end_angle - start_angle) >= 360:
        glutSolidSphere(radius, slices, stacks)
    else:
        start_rad = math.radians(start_angle)
        end_rad = math.radians(end_angle)
        
        nx0, nz0 = math.sin(start_rad), -math.cos(start_rad)
        nx1, nz1 = -math.sin(end_rad), math.cos(end_rad)
        
        glEnable(GL_CLIP_PLANE0)
        glClipPlane(GL_CLIP_PLANE0, [nx0, 0, nz0, 0])
        glEnable(GL_CLIP_PLANE1)
        glClipPlane(GL_CLIP_PLANE1, [nx1, 0, nz1, 0])
        
        glutSolidSphere(radius, slices, stacks)
        
        glDisable(GL_CLIP_PLANE0)
        glDisable(GL_CLIP_PLANE1)

def draw_oval(radius_x, radius_y, radius_z, slices=32, stacks=32):
    glPushMatrix()
    glScalef(radius_x, radius_y, radius_z)  # Escala diferente en cada eje
    glutSolidSphere(1.0, slices, stacks)   # Esfera unitaria que será escalada
    glPopMatrix()

def draw_torus_segment(radius, thickness, start_angle, end_angle, numc=16, numt=64):
    start_rad = math.radians(start_angle)
    end_rad = math.radians(end_angle)
    delta_t = (end_rad - start_rad) / numt

    glPushMatrix()
    
    for i in range(numt):
        theta = start_rad + i * delta_t
        next_theta = theta + delta_t

        glBegin(GL_QUAD_STRIP)
        for j in range(numc + 1):
            phi = 2.0 * math.pi * j / numc
            cos_phi = math.cos(phi)
            sin_phi = math.sin(phi)

            for t in [theta, next_theta]:
                # Punto en la superficie
                x = (radius + thickness * cos_phi) * math.cos(t)
                y = (radius + thickness * cos_phi) * math.sin(t)
                z = thickness * sin_phi
                
                # Normal (¡clave para la iluminación!)
                nx = cos_phi * math.cos(t)
                ny = cos_phi * math.sin(t)
                nz = sin_phi
                
                glNormal3f(nx, ny, nz)
                glVertex3f(x, y, z)
        glEnd()
    
    glPopMatrix()

def update_camera():
    glLoadIdentity()
    
    # Calcular posición de la cámara basada en ángulos y distancia
    cam_x = cam_distance * math.sin(math.radians(cam_angle_y)) * math.cos(math.radians(cam_angle_x))
    cam_y = cam_distance * math.sin(math.radians(cam_angle_x))
    cam_z = cam_distance * math.cos(math.radians(cam_angle_y)) * math.cos(math.radians(cam_angle_x))
    
    gluLookAt(cam_x, cam_y, cam_z,  # Posición cámara
              0, 0, 0,              # Punto de mira
              0, 1, 0)              # Vector arriba

def display():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    update_camera()
    
    # Configurar luz blanca simple
    glEnable(GL_LIGHTING)
    glEnable(GL_LIGHT0)
    glLightfv(GL_LIGHT0, GL_POSITION, [5, 3, 0, 1])  # Posición de la luz 
    
    # Material
    #glMaterialfv(GL_FRONT, GL_DIFFUSE, [95/255, 221/255, 97/255, 1.0]) 
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [122/255, 149/255, 76/255, 1.0]) 

    # Brazo Derecho
    drawCylinder(0.14, 1, 16, [-0.01, -0.285, 0.965], [-150, 1, 0, 0])  
    drawCylinder(0.14, 0.62, 16, [-0.01, -0.285, 0.965], [300, 1, 0, 0])
    
    glPushMatrix()
    glTranslatef(-0.01, -0.285, 0.965)  # Posición (x, y, z)
    draw_partial_sphere(0.14, 16, 32, 0, 360)
    glPopMatrix()
    
    glPushMatrix()
    glTranslatef(-0.01, 0.24, 1.268)  # Posición (x, y, z)
    draw_partial_sphere(0.14, 16, 32, 0, 360)
    glPopMatrix()

    glMaterialfv(GL_FRONT, GL_DIFFUSE, [50/255, 150/255, 50/255, 1.0])
    glPushMatrix()
    glTranslatef(-0.01, -0.285, 0.965)  # Posición base 
    glRotatef(-150, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.09, 0, 0)    # Radio de colocación      
        draw_cylinder(0.073, 1, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -0.285, 0.965)  # Posición base
    glRotatef(300, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.09, 0, 0)    # Radio de colocación      
        draw_cylinder(0.073, 0.62, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, 0.24, 1.268)  # Posición central  
    glRotatef(30, 1, 0, 0)          
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.085, 0.07, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix()  
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [122/255, 149/255, 76/255, 1.0]) 

    # Brazo Izquierdo
    drawCylinder(0.14, 0.65, 16, [-0.01, 0.704, -0.742], [30, 1, 0, 0])
    drawCylinder(0.14, 0.65, 16, [-0.01, 0.704, -0.742], [120, 1, 0, 0])
    
    glPushMatrix()
    glTranslatef(-0.01, 0.704, -0.742)  # Posición (x, y, z)
    draw_partial_sphere(0.14, 16, 32, 0, 360)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, 0.176, -1.047)  # Posición (x, y, z)
    draw_partial_sphere(0.14, 16, 32, 0, 360)
    glPopMatrix()

    glMaterialfv(GL_FRONT, GL_DIFFUSE, [50/255, 150/255, 50/255, 1.0])
    glPushMatrix()
    glTranslatef(-0.01, 0.704, -0.742)  # Posición base 
    glRotatef(30, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.09, 0, 0)    # Radio de colocación      
        draw_cylinder(0.073, 0.65, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, 0.704, -0.742)  # Posición base
    glRotatef(120, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.09, 0, 0)    # Radio de colocación      
        draw_cylinder(0.073, 0.62, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, 0.176, -1.047)  # Posición central  
    glRotatef(210, 1, 0, 0)          
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.085, 0.07, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix() 
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [122/255, 149/255, 76/255, 1.0])  

    # Pierna Derecha
    drawCylinder(0.175, 0.75, 16, [-0.01, -1.16, 0.455], [-150, 1, 0, 0])  
    drawCylinder(0.175, 0.75, 16, [-0.01, -1.16, 0.455], [-240, 1, 0, 0])  
   
    glPushMatrix()
    glTranslatef(-0.01, -1.16, 0.455)  # Posición (x, y, z)
    draw_partial_sphere(0.175, 16, 32, 0, 360)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -1.76, 0.109)  # Posición (x, y, z)
    draw_partial_sphere(0.175, 16, 32, 0, 360)
    glPopMatrix()
    
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [50/255, 150/255, 50/255, 1.0])
    glPushMatrix()
    glTranslatef(-0.01, -1.16, 0.455)  # Posición base 
    glRotatef(-150, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.1, 0, 0)    # Radio de colocación      
        draw_cylinder(0.1, 0.95, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -1.16, 0.455)  # Posición base
    glRotatef(-240, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.1, 0, 0)    # Radio de colocación       
        draw_cylinder(0.1, 0.7, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -1.76, 0.109)  # Posición central  
    glRotatef(210, 1, 0, 0)          
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.103, 0.09, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix() 
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [122/255, 149/255, 76/255, 1.0])

    # Pierna Izquierda
    drawCylinder(0.175, 1, 16, [-0.01, -1.17, -0.915], [-60, 1, 0, 0])  
    drawCylinder(0.175, 0.75, 16, [-0.01, -1.17, -0.915], [-150, 1, 0, 0])  

    glPushMatrix()
    glTranslatef(-0.01, -1.17, -0.915)  # Posición (x, y, z)
    draw_partial_sphere(0.175, 16, 32, 0, 360)
    glPopMatrix()
    
    glPushMatrix()
    glTranslatef(-0.01, -0.795, -1.558)  # Posición (x, y, z)
    draw_partial_sphere(0.175, 16, 32, 0, 360)
    glPopMatrix()

    glMaterialfv(GL_FRONT, GL_DIFFUSE, [50/255, 150/255, 50/255, 1.0])
    glPushMatrix()
    glTranslatef(-0.01, -1.17, -0.915)  # Posición base 
    glRotatef(-60, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.1, 0, 0)    # Radio de colocación      
        draw_cylinder(0.1, 1, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -1.17, -0.915)  # Posición base
    glRotatef(-150, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.1, 0, 0)    # Radio de colocación       
        draw_cylinder(0.1, 0.75, 32)
        glPopMatrix()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(-0.01, -0.796, -1.559)  # Posición central  
    glRotatef(300, 1, 0, 0)          
    for angle in range(5, 365, 60):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.103, 0.09, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix() 
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [122/255, 149/255, 76/255, 1.0])

    # Torzo
    drawCylinder(0.38, 1.65, 16, [0, -0.5, -0.3], [-60, 1, 0, 0])  # Torso

    glPushMatrix()
    glTranslatef(0, 0.92, 0.52)  # Posición (x, y, z)
    draw_partial_sphere(0.38, 16, 32, 0, 360)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0, -0.49, -0.295)  # Posición (x, y, z)
    draw_partial_sphere(0.38, 16, 32, 0, 360)
    glPopMatrix()

    glMaterialfv(GL_FRONT, GL_DIFFUSE, [50/255, 150/255, 50/255, 1.0])  # Verde más oscuro
    glPushMatrix()
    glTranslatef(0, -0.5, -0.3)  # Posición base del torso
    glRotatef(-60, 1, 0, 0)       # Inclinación global del conjunto
    for angle in range(20, 380, 30):
        glPushMatrix()
        glRotatef(angle, 0, 0, 1)  # Distribución angular
        glTranslatef(0.248, 0, 0)    # Radio de colocación        
        draw_cylinder(0.153, 1.65, 32)
        glPopMatrix()
    glPopMatrix()
        
    glPushMatrix()
    glTranslatef(0, 0.92, 0.52)  # Posición central  
    glRotatef(30, 1, 0, 0)          
    for angle in range(20, 380, 30):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.25, 0.14, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix()    

    glPushMatrix()
    glTranslatef(0, -0.49, -0.295)  # Posición central  
    glRotatef(210, 1, 0, 0)          
    for angle in range(10, 370, 30):
        glPushMatrix()
        glRotatef(angle, 0, 1, 0)  
        glTranslatef(0.01, 0, 0) 
        glPushMatrix()
        draw_torus_segment(0.25, 0.14, 0, 110, 32, 64)
        glPopMatrix()       
        glPopMatrix()
    glPopMatrix() 


    #Ojos
    """glMaterialfv(GL_FRONT, GL_DIFFUSE, [0, 0, 0, 1.0]) 
    glPushMatrix()
    glTranslatef(0.305, 0.65, 0.46)
    draw_oval(0.093, 0.093, 0.093, 32, 32)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.275, 0.765, 0.245)
    draw_oval(0.093, 0.093, 0.093, 32, 32)
    glPopMatrix()

    #Boca
    glPushMatrix()
    glTranslatef(0.38, 0.4, 0.18)
    glRotatef(30, 1, 0, 0)
    draw_oval(0.01, 0.14, 0.05, 32, 32)
    glPopMatrix()

    #Picos
    glMaterialfv(GL_FRONT, GL_DIFFUSE, [0.4, 0.4, 0.4, 1.0]) 
    glPushMatrix()
    glTranslatef(0, 1.13, 0.85)
    glRotatef(40, 1, 0, 0)
    draw_oval(0.03, 0.3, 0.03, 16, 32)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0, 1.27, 0.69)
    glRotatef(30, 1, 0, 0)
    draw_oval(0.03, 0.3, 0.03, 16, 32)
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0, 1.3, 0.5)
    glRotatef(20, 1, 0, 0)
    draw_oval(0.03, 0.3, 0.03, 16, 32)
    glPopMatrix()"""

    glutSwapBuffers()

def keyboard(key, x, y):
    global cam_distance
    
    # Controles de teclado para acercar/alejar
    if key == b'w':
        cam_distance -= 0.5
    elif key == b's':
        cam_distance += 0.5
    elif key == b'a':
        cam_angle_y -= 5.0
    elif key == b'd':
        cam_angle_y += 5.0
        
    glutPostRedisplay()

def mouse(button, state, x, y):
    global last_x, last_y, mouse_down
    
    if button == GLUT_LEFT_BUTTON:
        mouse_down = (state == GLUT_DOWN)
        last_x, last_y = x, y

def motion(x, y):
    global cam_angle_x, cam_angle_y, last_x, last_y
    
    if mouse_down:
        dx = x - last_x
        dy = y - last_y
        
        cam_angle_y += dx * 0.5
        cam_angle_x -= dy * 0.5
        
        last_x, last_y = x, y
        glutPostRedisplay()

def reshape(width, height):
    glViewport(0, 0, width, height)
    glMatrixMode(GL_PROJECTION)
    glLoadIdentity()
    gluPerspective(45, (width / height), 0.1, 50.0)
    glMatrixMode(GL_MODELVIEW)

def main():
    glutInit()
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH)
    glutInitWindowSize(1280, 720)
    glutCreateWindow(b"Grafico 3D con OpenGL!!")
    
    glClearColor(1.0, 1.0, 1.0, 1.0)
    glEnable(GL_DEPTH_TEST)
    glEnable(GL_NORMALIZE)
    
    glutDisplayFunc(display)
    glutReshapeFunc(reshape)
    glutKeyboardFunc(keyboard)
    glutMouseFunc(mouse)
    glutMotionFunc(motion)
    
    glutMainLoop()

if __name__ == "__main__":
    main()