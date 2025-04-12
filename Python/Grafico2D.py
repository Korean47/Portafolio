# Importación de librerías necesarias para OpenGL
from OpenGL.GL import *
from OpenGL.GLU import *
from OpenGL.GLUT import *
from math import *

# Definición del tamaño de la ventana
w, h = 1280, 720

# Posición inicial del personaje
personaje_x = 630
personaje_y = 388

# Variables para controlar las transformaciones
traslacion_x, traslacion_y = 0, 0
rotacion_angulo = 0
escalamiento_x, escalamiento_y = 1, 1
recorte_activo = False
inversion_eje = None
inversionX = -1
inversionY = -1

puntosBrazoIzquierdo = [(749, 394), (748, 395), (748, 396), (748, 398), (748, 400), 
                        (747, 402), (748, 405), (748, 408), (749, 410), (749, 412), 
                        (751, 414), (752, 416), (753, 417), (754, 419), (755, 420), 
                        (756, 421), (757, 422), (758, 423), (760, 424), (761, 426), 
                        (763, 427), (764, 428), (766, 430), (767, 431), (768, 432), 
                        (770, 434), (771, 434), (772, 435), (773, 436), (775, 437), 
                        (776, 438), (777, 438), (778, 439), (780, 439), (781, 440), 
                        (783, 440), (784, 440), (785, 441), (787, 440), (788, 440), 
                        (789, 440), (790, 440), (791, 440), (792, 439), (793, 439), 
                        (793, 439), (794, 438), (794, 438), (795, 437), (795, 437), 
                        (796, 436), (796, 435), (797, 435), (797, 434), (798, 434), 
                        (798, 433), (798, 432), (799, 431), (799, 431), (799, 430), 
                        (799, 429), (800, 428), (800, 427), (800, 426), (800, 425), 
                        (800, 424), (800, 423), (800, 422), (800, 421), (800, 419), 
                        (800, 418), (800, 417), (799, 414), (799, 413), (799, 411), 
                        (799, 410), (799, 409), (798, 407), (798, 406), (798, 405), 
                        (797, 403), (797, 401), (796, 400), (796, 398), (795, 397), 
                        (795, 395), (794, 394), (793, 392), (793, 391), (792, 390), 
                        (792, 389), (791, 387), (790, 386), (790, 385), (789, 383), 
                        (788, 382), (788, 381), (787, 380), (786, 378), (785, 377), 
                        (784, 375), (783, 374), (783, 373), (782, 372), (781, 371), 
                        (780, 369), (778, 367), (777, 366), (776, 364), (775, 363), 
                        (773, 361), (772, 359), (770, 357), (768, 355), (766, 353), 
                        (765, 351), (763, 350), (762, 347), (760, 346), (759, 345)] 

puntosContorno = [(759, 345), (758, 343), (756, 341), (754, 338), (752, 335), 
                  (749, 331), (746, 328), (745, 325), (742, 321), (740, 317), 
                  (759, 345), (761, 345), (763, 345), (765, 345), (767, 345), 
                  (770, 345), (771, 344), (773, 343), (775, 343), (776, 342), 
                  (777, 341), (777, 340), (777, 339), (777, 338), (777, 337), 
                  (777, 336), (776, 335), (776, 333), (775, 332), (775, 331), 
                  (775, 330), (774, 328), (773, 327), (773, 325), (772, 324), 
                  (771, 323), (770, 322), (769, 320), (769, 319), (768, 318), 
                  (767, 317), (766, 316), (765, 314), (764, 313), (764, 312), 
                  (763, 311), (762, 310), (761, 309), (760, 307), (758, 306), 
                  (757, 304), (756, 302), (754, 301), (752, 299), (751, 297), 
                  (749, 296), (747, 294), (744, 292), (742, 290), (742, 290), 
                  (740, 288), (738, 286), (732, 281), (730, 280), (726, 277), 
                  (724, 276), (721, 275), (719, 273), (716, 271), (714, 270), 
                  (712, 269), (709, 267), (707, 266), (703, 264), (700, 262), 
                  (696, 260), (693, 259), (690, 257), (686, 255), (686, 255), 
                  (681, 254), (678, 253), (674, 252), (671, 250), (666, 249), 
                  (663, 248), (659, 247), (656, 247), (652, 246), (648, 246), 
                  (645, 245), (642, 245), (637, 245), (634, 245), (631, 245), 
                  (628, 245), (625, 246), (622, 246), (620, 246), (617, 247), 
                  (615, 248), (613, 249), (611, 250), (609, 251), (607, 253)]

puntosSombra2 = [(749, 392), (760, 407), (767, 415), (776, 426), (788, 438), 
                 (790, 436), (791, 432), (791, 427), (792, 422), (791, 412), 
                 (788, 405), (784, 397), (778, 387), (772, 381), (766, 375), 
                 (759, 368), (750, 360)]

puntosBrazoDerecho = [(495, 380), (493, 381), (488, 386), (487, 388), (485, 391), 
                 (483, 394), (482, 398), (481, 403), (480, 408), (479, 415), 
                 (480, 423), (481, 430), (481, 432), (482, 435), (483, 437), 
                 (484, 439), (486, 440), (487, 440), (488, 441), (489, 441), 
                 (490, 441), (492, 441), (493, 440), (494, 440), (495, 439), 
                 (496, 439), (498, 438), (499, 436), (500, 435), (501, 434), 
                 (503, 433)]

puntosLengua = [(544, 284), (545, 287), (547, 291), (549, 295), (551, 298), 
                (553, 301), (555, 304), (558, 307), (560, 310), (562, 312), 
                (566, 316), (569, 319), (573, 322), (576, 325), (579, 327), 
                (582, 328), (585, 330), (587, 331), (590, 332), (593, 332), 
                (596, 333), (598, 333), (601, 333), (604, 333), (606, 332), 
                (608, 332), (610, 331), (612, 332), (615, 333), (617, 333), 
                (620, 333), (623, 332), (624, 332), (626, 331), (627, 330), 
                (629, 329), (628, 326), (627, 318), (625, 316), (623, 314), 
                (621, 312), (620, 310), (618, 308), (616, 305), (615, 303), 
                (613, 299), (611, 296), (610, 292), (609, 290), (607, 286), 
                (607, 282), (606, 278), (605, 274), (605, 271), (605, 267), 
                (605, 262), (606, 258), (606, 254), (607, 250), (607, 246), 
                (607, 232), (606, 228), (606, 224), (605, 221), (604, 217), 
                (602, 213), (600, 210), (598, 207), (595, 205), (593, 202), 
                (590, 201), (587, 199), (583, 198), (579, 197), (576, 198), 
                (573, 198), (569, 199), (566, 200), (563, 201), (561, 202), 
                (559, 203), (557, 204), (555, 206), (552, 208), (550, 210), 
                (547, 214), (545, 217), (543, 221), (542, 224), (540, 228), 
                (539, 232), (538, 237), (538, 241), (537, 245), (537, 249), 
                (537, 253), (538, 257), (538, 261), (539, 265), (540, 268), 
                (540, 271), (541, 274), (542, 277), (543, 280), (544, 285)]

puntosLengua2 = [(610, 331), (608, 330), (602, 327), (600, 327), (597, 325), 
                 (595, 323), (593, 322), (591, 321), (590, 320), (588, 318), 
                 (586, 315), (584, 314), (583, 312), (581, 310), (579, 307), 
                 (578, 304), (577, 302), (575, 299), (574, 296), (573, 293), 
                 (572, 290), (571, 286), (570, 283), (570, 280), (569, 277), 
                 (569, 274), (568, 271), (568, 266), (567, 263), (567, 260), 
                 (567, 255), (567, 252), (567, 248)]             

puntosSombraLengua = [(600, 325), (602, 326), (605, 327), (607, 326), (610, 325), 
                      (612, 323), (612, 319), (611, 316), (609, 313), (608, 311), 
                      (606, 309), (605, 306), (602, 303), (600, 298), (600, 295), 
                      (600, 291), (600, 279), (600, 269), (600, 258), (600, 250), 
                      (598, 236), (595, 228), (594, 225), (591, 222), (588, 219), 
                      (584, 217), (579, 216), (574, 217), (570, 218), (566, 220), 
                      (561, 224), (557, 228), (553, 233), (550, 240), (548, 248), 
                      (547, 258), (547, 266), (548, 274), (550, 283), (552, 290), 
                      (554, 295), (557, 301), (561, 306), (563, 310), (567, 315), 
                      (571, 319), (575, 322), (580, 325), (584, 328), (590, 330), 
                      (593, 330), (596, 329), (598, 327)]   

"""
    Primitivas
"""
# Método para dibujar una elipse
def Elipse(x, y, radio_x, radio_y, angulo_inicio, angulo_fin, angulo_rotacion=0):
    glPushMatrix()  
    glTranslatef(x, y, 0)  
    glRotatef(angulo_rotacion, 0, 0, 1)  
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(0, 0)  
    for i in range(angulo_inicio, angulo_fin): 
        angulo = i * pi / 180
        glVertex2f(radio_x * cos(angulo), radio_y * sin(angulo))
    glEnd()
    glPopMatrix() 

# Método para dibujar el contorno de una elipse
def ElipseContorno(x, y, radio_x, radio_y, angulo_inicio, angulo_fin, angulo_rotacion=0):
    glPushMatrix()  
    glTranslatef(x, y, 0)  
    glRotatef(angulo_rotacion, 0, 0, 1)  
    glBegin(GL_LINE_STRIP)  
    for i in range(angulo_inicio, angulo_fin + 1):  
        angulo = i * pi / 180
        glVertex2f(radio_x * cos(angulo), radio_y * sin(angulo))
    glEnd()
    glPopMatrix()

# Método para dibujar un arco
def Arco(x, y, radio, inicio, fin):
    glBegin(GL_LINE_STRIP)
    for i in range(inicio, fin + 1):
        angulo = i * pi / 180
        glVertex2f(x + radio * cos(angulo), y + radio * sin(angulo))  
    glEnd()

def Cuadro(p1, p2, p3, p4):
    glBegin(GL_QUADS)
    glVertex2f(p1[0], p1[1])
    glVertex2f(p2[0], p2[1])
    glVertex2f(p3[0], p3[1])
    glVertex2f(p4[0], p4[1])
    glEnd()

def Linea(p1, p2):
    glBegin(GL_LINE_STRIP)
    glVertex2f(p1[0], p1[1])
    glVertex2f(p2[0], p2[1])
    glEnd()

# Método para configurar el espacio de dibujo
def Espacio():
    glViewport(0, 0, w, h)
    glMatrixMode(GL_PROJECTION) 
    glLoadIdentity()  
    gluOrtho2D(0, w, 0, h)
    glMatrixMode(GL_MODELVIEW)  
    glLoadIdentity()  

"""
    Traslaciones
"""
def trasladar(tx, ty):
    glTranslatef(tx, ty, 0)

def rotar(angulo, x, y):
    glTranslatef(x, y, 0)
    glRotatef(angulo, 0, 0, 1)
    glTranslatef(-x, -y, 0)

def escalar(sx, sy, x, y):
    glTranslatef(x, y, 0)
    glScalef(sx, sy, 1)
    glTranslatef(-x, -y, 0)

def recortar(x, y, ancho, alto):
    glEnable(GL_SCISSOR_TEST)
    glScissor(x, y, ancho, alto)

def invertir(eje, x, y):
    if eje == 'x':
        if x == 1:            
            glScalef(-1, 1, 1)  # Invertir en el eje X
            glTranslatef(-w, 0, 0)  # Ajustar la posición después de la inversión
        else:
            glScalef(1, 1, 1)  # Reinvertir en el eje X
            glTranslatef(0, 0, 0)  # Ajustar la posición original
    elif eje == 'y':      
        if y == 1: 
            glScalef(1, -1, 1)  # Invertir en el eje Y
            glTranslatef(0, -h, 0)  # Ajustar la posición después de la inversión
        else:
            glScalef(1, 1, 1)  # Reinvertir en el eje Y
            glTranslatef(0, 0, 0)  # Ajustar la posición original

class Personaje:
    def __init__(self):
        self.x = 630
        self.y = 388
        self.traslacion_x = 0
        self.traslacion_y = 0
        self.rotacion_angulo = 0
        self.escalamiento_x = 1
        self.escalamiento_y = 1
        self.inversion_eje = None
        self.inversionX = -1
        self.inversionY = -1
        self.animacion_lengua = 0
        self.direccion_lengua = 1
        self.parpadeo_activo = False
        self.parpadeo_radio_y = 0
        self.parpadeo_velocidad = 5
        self.parpadeo_tiempo = 0
        self.angulo_brazo_derecho = 0
        self.direccion_brazo_derecho = 1 
        self.angulo_brazo_izquierdo = 0
        self.direccion_brazo_izquierdo = 1 
        self.tiempo_animacion_brazos = 0 
    
    def dibujar(self):
        glPushMatrix()

        # Aplicar transformaciones
        glTranslatef(self.traslacion_x, self.traslacion_y, 0)
        glRotatef(self.rotacion_angulo, self.x, self.y, 0)
        glScalef(self.escalamiento_x, self.escalamiento_y, 1)
        if self.inversion_eje:
            self.invertir(self.inversion_eje, self.inversionX, self.inversionY)

        # Dibujar el personaje
        glLineWidth(3)
        self.animacionLengua()
        self.dibujarBrazoDerecho()
        self.dibujaCuerpo()
        self.dibujarBrazoIzquierdo()
        self.dibujarBoca()
        self.dibujar_ojos()
        self.dibujar_lengua()

        glPopMatrix()

    def dibujarBrazoIzquierdo(self):
        # Punto de pivote
        pivote_x, pivote_y = 763, 383    

        glPushMatrix()

        # Aplicar transformaciones
        glTranslatef(pivote_x, pivote_y, 0)
        glRotatef(self.angulo_brazo_izquierdo, 0, 0, 1)
        glTranslatef(-pivote_x, -pivote_y, 0)

        glColor3f(235/255, 235/255, 235/255)
        glBegin(GL_POLYGON)
        for x, y in puntosBrazoIzquierdo:
            glVertex2f(x, y)
        glEnd()

        glColor3f(1, 1, 1)
        glBegin(GL_POLYGON)
        for x, y in puntosSombra2:
            glVertex2f(x, y)
        glEnd()

        glColor3f(0, 0, 0)
        glBegin(GL_LINE_STRIP)
        for x, y in puntosBrazoIzquierdo:
            glVertex2f(x, y)
        glEnd()

        glPopMatrix()

        glColor3f(235/255, 235/255, 235/255)
        Elipse(personaje_x, personaje_y, 135, 135, 340, 353)
        glColor3f(1, 1, 1)
        Elipse(674, 428, 102, 102, 180, 336)

    def dibujarBrazoDerecho(self):
        # Punto de pivote
        pivote_x, pivote_y = 505, 392        
        
        glPushMatrix()

        # Aplicar transformaciones
        glTranslatef(pivote_x, pivote_y, 0)
        glRotatef(self.angulo_brazo_derecho, 0, 0, 1)
        glTranslatef(-pivote_x, -pivote_y, 0)

        glColor3f(210/255, 210/255, 210/255)

        #Parte central del brazo
        Elipse(500, 406, 18, 30, 0, 361, 18)

        # Dibujar el brazo
        glBegin(GL_POLYGON)
        for x, y in puntosBrazoDerecho:
            glVertex2f(x, y)
        glEnd()

        glColor3f(235/255, 235/255, 235/255)
        glBegin(GL_POLYGON)
        for x, y in puntosBrazoDerecho[16:]:
            glVertex2f(x, y)
        glEnd()

        # Dibujar la sombra
        Elipse(500, 425, 20, 7.5, 0, 361, -45)

        glColor3f(0, 0, 0)        

        # Contorno Brazo Derecho
        ElipseContorno(500, 406, 18, 30, 228, 417, 18)
        glBegin(GL_LINE_STRIP)
        for x, y in puntosBrazoDerecho:
            glVertex2f(x, y)
        glEnd()

        glPopMatrix()     

    def dibujaCuerpo(self):
        #Color Cabeza
        glColor3f(210/255, 210/255, 210/255)
        Elipse(personaje_x, personaje_y, 134, 134, 16, 400)
    
        #Color Parte Inferior
        glColor3f(210/255, 210/255, 210/255)
        glBegin(GL_POLYGON) #Este es la parte del brazo
        for x, y in puntosContorno[:9]:
            glVertex2f(x, y)
        glEnd()
        glBegin(GL_POLYGON) #Esta es la parte de abajo con la cola
        for x, y in puntosContorno[10:]:
            glVertex2f(x, y)
        glEnd()

        #Sombra 1 Cabeza
        glColor3f(235/255, 235/255, 235/255)
        Elipse(698, 402, 187, 139, 119, 270, 3)

        glBegin(GL_POLYGON)
        glVertex2f(600, 300)
        for x, y in puntosContorno[:75]:
            glVertex2f(x, y)
        glEnd()  

        Elipse(personaje_x, personaje_y, 134, 134, 300, 464)
        Elipse(personaje_x, personaje_y, 135, 135, 340, 350)

        glColor3f(0, 0, 0)
        ElipseContorno(personaje_x, personaje_y, 135, 135, 340, 378)

        #Sombra 2 Cabeza
        glColor3f(1, 1, 1)
        Elipse(674, 428, 102, 102, 113, 336, 0)
        Elipse(personaje_x, personaje_y, 134, 134, -3, 89)
        
        #Contorno Cabeza
        glColor3f(0, 0, 0)
        Arco(personaje_x, personaje_y, 134, 16, 231)

        #Contorno Parte Inferior / Cola y Brazo Izquierdo
        glBegin(GL_LINE_STRIP)
        for x, y in puntosContorno:
            glVertex2f(x, y)
        glEnd()

    def dibujarBoca(self):
        #Color de fondo Boca
        glColor3f(104/255,0.0,0.0)
        Elipse(585, 391, 54, 101, 175, 358, 5)
        #Sombra Boca
        glColor3f(151/255, 23/255, 25/255)
        Elipse(569, 384, 27, 75, 175, 358, 11)
        glColor3f(235/255, 235/255, 235/255)
        Elipse(585, 395, 54, 10, 175, 358, 0)
        glColor3f(1, 1, 1)
        Elipse(585, 395, 54, 10, 270, 358, 0)
        Elipse(585, 395, 7, 10, 0, 270, 10)
        
        #Dientes
        glColor3f(1.0,1.0,1.0)
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(533, 392)
        glVertex2f(549, 355)
        glVertex2f(561, 385)
        glEnd()
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(561, 385)
        glVertex2f(573, 364)
        glVertex2f(584, 386)
        glEnd()
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(584, 386)
        glVertex2f(594, 362)
        glVertex2f(608, 386)
        glEnd()
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(608, 386)
        glVertex2f(619, 354)
        glVertex2f(638, 389)
        glEnd()

        #Contorno Dientes
        glColor3f(0.0,0.0,0.0)
        glBegin(GL_LINE_STRIP)
        glVertex2f(533, 392)
        glVertex2f(549, 355)
        glVertex2f(561, 385)
        glEnd()
        glBegin(GL_LINE_STRIP)
        glVertex2f(561, 385)
        glVertex2f(573, 364)
        glVertex2f(584, 386)
        glEnd()
        glBegin(GL_LINE_STRIP)
        glVertex2f(584, 386)
        glVertex2f(594, 362)
        glVertex2f(608, 386)
        glEnd()
        glBegin(GL_LINE_STRIP)
        glVertex2f(608, 386)
        glVertex2f(619, 354)
        glVertex2f(638, 390)
        glEnd()

        #Parte Interior Boca
        glColor3f(60/255, 10/255, 3/255)
        Elipse(623, 333, 16, 16, 46, 188, 0)
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(636, 344)
        glVertex2f(632, 327)
        glVertex2f(607, 331)
        glEnd()

        glColor3f(0.0,0.0,0.0)
        ElipseContorno(623, 333, 16, 16, 46, 188, 0)

        #Contorno Boca
        glColor3f(0.0,0.0,0.0)
        ElipseContorno(585, 391, 54, 101, 175, 358, 5)
        ElipseContorno(585, 395, 54, 10, 180, 360, -2)      

    def dibujar_ojos(self):
        #Ojos
        if not self.parpadeo_activo or self.parpadeo_radio_y < 28:
            glColor3f(80/255, 80/255, 91/255)
            Elipse(557, 443, 8, 14, 122, 420, -10)
            Elipse(608, 442, 9, 14, 122, 418, -10)

            glColor3f(250/255, 251/255, 246/255)
            glBegin(GL_TRIANGLE_FAN)
            glVertex2f(553, 455)
            glVertex2f(558, 445)
            glVertex2f(562, 454)
            glEnd()
            Elipse(558, 450, 4, 7, 120, 416, -10)
            glBegin(GL_TRIANGLE_FAN)
            glVertex2f(605, 455)
            glVertex2f(609, 442)
            glVertex2f(614, 454)
            glEnd()
            Elipse(609, 448, 5, 7, 140, 400, -10)

        # Dibujar la elipse de parpadeo (si está activa)
        if self.parpadeo_activo:
            glColor3f(210/255, 210/255, 210/255)  # Color del párpado
            glColor3f(0, 0, 0)  # Color del párpado
            Elipse(559, 455, 8, self.parpadeo_radio_y, 180, 360, -10)
            Elipse(610, 453, 10, self.parpadeo_radio_y, 178, 362, -10)

        #Contorno Ojos
        glColor3f(0.0,0.0,0.0)
        ElipseContorno(557, 443, 8, 14, 122, 418, -10)
        ElipseContorno(608, 442, 9, 14, 122, 418, -10)

        #Cejas
        glLineWidth(3)
        Arco(617, 484, 32, 207, 325)
        ElipseContorno(567, 473, 28, 16, 180, 324, 22)

    def dibujar_lengua(self):
        glPushMatrix()
        glTranslatef(0, self.animacion_lengua, 0)  # Trasladar en el eje Y
        #Lengua
        glColor3f(192/255, 52/255, 94/255)
        glBegin(GL_POLYGON)
        for x, y in puntosLengua:
            glVertex2f(x, y)
        glEnd()

        #Sombra Lengua
        glColor3f(241/255, 57/255, 111/255)
        glBegin(GL_POLYGON)
        for x, y in puntosSombraLengua:
            glVertex2f(x, y)
        glEnd()

        #Contorno Lengua
        glColor3f(0.0,0.0,0.0)
        glBegin(GL_LINE_STRIP)
        for x, y in puntosLengua:
            glVertex2f(x, y)
        glEnd()
        
        #Linea en la Lengua
        glLineWidth(2)
        glBegin(GL_LINE_STRIP)
        for x, y in puntosLengua2:
            glVertex2f(x, y)
        glEnd()

        glPopMatrix()

    def animacionLengua(self):
        # Actualizar animación de la lengua
        self.animacion_lengua += self.direccion_lengua * 0.1  # Velocidad de la animación
        if self.animacion_lengua > 4 or self.animacion_lengua < -4:
            self.direccion_lengua *= -1  # Cambiar dirección

    def animacionOjos(self):
        # Actualizar animación del parpadeo
        if self.parpadeo_activo:
            self.parpadeo_radio_y += self.parpadeo_velocidad
            if self.parpadeo_radio_y >= 28:  # Cuando la elipse cubre completamente el ojo
                self.parpadeo_velocidad *= -1  # Invertir la dirección
            elif self.parpadeo_radio_y <= 0:  # Cuando la elipse desaparece
                self.parpadeo_activo = False
                self.parpadeo_velocidad = abs(self.parpadeo_velocidad)  # Restaurar la dirección
        else:
            self.parpadeo_tiempo += 1
            if self.parpadeo_tiempo > 125:  # Parpadear cada 125 frames
                self.parpadeo_activo = True
                self.parpadeo_tiempo = 0

    def animacionBrazoDerecho(self):
        if self.tiempo_animacion_brazos > 0:  # Solo animar si el temporizador está activo
            self.angulo_brazo_derecho += self.direccion_brazo_derecho * 5  # Velocidad de la animación
            if self.angulo_brazo_derecho > 60 or self.angulo_brazo_derecho < 0:
                self.direccion_brazo_derecho *= -1  # Cambiar dirección 

    def animacionBrazoIzquierdo(self):
        if self.tiempo_animacion_brazos > 0:  # Solo animar si el temporizador está activo
            self.angulo_brazo_izquierdo += self.direccion_brazo_izquierdo * 5  # Velocidad de la animación
            if self.angulo_brazo_izquierdo > 0 or self.angulo_brazo_izquierdo < -60:
                self.direccion_brazo_izquierdo *= -1  # Cambiar dirección 

class Escenario:
    def __init__(self):
        # Definir las posiciones de las ventanas u otros elementos
        self.ventanas = [
            (150, 300),  # Posición de la primera ventana (x, y)
            (980, 300)  # Posición de la segunda ventana (x, y)
        ]

    def dibujaVentana(self, x, y):
        # Dibujar una ventana en la posición (x, y)
        glLineWidth(5)
        glColor3f(115/255, 83/255, 44/255)
        Cuadro((x, y), (x, y + 180), (x + 150, y + 180), (x + 150, y))

        glColor3f(0, 0, 0)
        glBegin(GL_LINE_LOOP)
        glVertex2f(x, y)
        glVertex2f(x, y + 180)
        glVertex2f(x + 150, y + 180)
        glVertex2f(x + 150, y)
        glEnd()

        Linea((x, y + 25), (x + 150, y + 25))
        Linea((x, y + 150), (x + 150, y + 150))
        Linea((x + 32, y + 25), (x + 32, y + 150))
        Linea((x + 117, y + 25), (x + 117, y + 150))

        x2 = x + 39
        y2 = y - 60
        Cuadro((x + 40, y + 91), (x + 40, y + 144), (x + 70, y + 144), (x + 70, y + 91))
        Cuadro((x2 + 40, y + 91), (x2 + 40, y + 144), (x2 + 70, y + 144), (x2 + 70, y + 91))
        Cuadro((x + 40, y2 + 91), (x + 40, y2 + 144), (x + 70, y2 + 144), (x + 70, y2 + 91))
        Cuadro((x2 + 40, y2 + 91), (x2 + 40, y2 + 144), (x2 + 70, y2 + 144), (x2 + 70, y2 + 91))

        glLineWidth(2)
        #Lineas en la madrea horizontales
        Linea((x + 23, y + 45), (x + 23, y + 115))
        Linea((x + 17, y + 80), (x + 17, y + 142))
        Linea((x + 7, y + 32), (x + 7, y + 74))
        Linea((x + 12, y + 63), (x + 12, y + 123))
        Linea((x + 8, y + 112), (x + 8, y + 147))

        Linea((x + 23 + 117, y + 45), (x + 23 + 117, y + 115))
        Linea((x + 17 + 117, y + 80), (x + 17 + 117, y + 142))
        Linea((x + 7 + 117, y + 32), (x + 7 + 117, y + 74))
        Linea((x + 12 + 117, y + 63), (x + 12 + 117, y + 123))
        Linea((x + 8 + 117, y + 112), (x + 8 + 117, y + 147))

        # Lineas en la madera horizontales
        def dibujar_lineas(x_offset, y_offset):
            glBegin(GL_LINE_STRIP)
            glVertex2f(89 + x_offset, 502 - y_offset)
            glVertex2f(96 + x_offset, 502 - y_offset)
            glVertex2f(103 + x_offset, 497 - y_offset)
            glVertex2f(134 + x_offset, 497 - y_offset)
            glEnd()
            glBegin(GL_LINE_STRIP)
            glVertex2f(179 + x_offset, 494 - y_offset)
            glVertex2f(195 + x_offset, 495 - y_offset)
            glVertex2f(202 + x_offset, 498 - y_offset)
            glVertex2f(212 + x_offset, 498 - y_offset)
            glVertex2f(220 + x_offset, 502 - y_offset)
            glVertex2f(227 + x_offset, 502 - y_offset)
            glEnd()
            Linea((115 + x_offset, 491 - y_offset), (142 + x_offset, 491 - y_offset))
            Linea((160 + x_offset, 502 - y_offset), (176 + x_offset, 502 - y_offset))

        dibujar_lineas(66, 32)
        dibujar_lineas(66, 32 + 150)
        dibujar_lineas(66 + 830, 32)
        dibujar_lineas(66 + 830, 32 + 150)
        

    def dibujarSuelo(self):
        for i in range(0, w + 77, 78):
            glColor3f(113/255, 82/255, 49/255)
            Cuadro((i, 0), (i, 31), (i + 77.5, 31), (i + 77.5, 0))
            glColor3f(85/255, 55/255, 21/255)
            Linea((i + 10, 12), (i + 20, 12))
            Linea((i + 30, 19), (i + 48, 19))
            Linea((i + 59, 12), (i + 69, 12))

        glColor3f(0, 0, 0)
        for i in range(0, w + 77, 78):
            glBegin(GL_LINE_LOOP)
            glVertex2f(i, 0)
            glVertex2f(i, 31)
            glVertex2f(i + 77.5, 31)
            glVertex2f(i + 77.5, 0)
            glEnd()
        
        for i in range(-39, w, 78):
            glColor3f(113/255, 82/255, 49/255)
            Cuadro((i, 32), (i, 63), (i + 77.5, 63), (i + 77.5, 32))
            glColor3f(85/255, 55/255, 21/255)
            Linea((i + 10, 44), (i + 20, 44))
            Linea((i + 30, 51), (i + 48, 51))
            Linea((i + 59, 44), (i + 69, 44))

        glColor3f(0, 0, 0)
        for i in range(-39, w, 78):
            glBegin(GL_LINE_LOOP)
            glVertex2f(i, 32)
            glVertex2f(i, 63)
            glVertex2f(i + 77.5, 63)
            glVertex2f(i + 77.5, 32)
            glEnd()

    def dibujar(self):
        # Dibujar todas las ventanas
        for x, y in self.ventanas:
            self.dibujaVentana(x, y)
        self.dibujarSuelo()

# Método principal para renderizar la escena
personaje = Personaje()
escenario = Escenario()

def showScreen():
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)  
    glLoadIdentity()  
    Espacio()

    #Fondo
    escenario.dibujar()

    #Personaje
    glPushMatrix()

    # Aplicar transformaciones
    trasladar(traslacion_x, traslacion_y)
    rotar(rotacion_angulo, personaje_x, personaje_y)
    escalar(escalamiento_x, escalamiento_y, personaje_x, personaje_y)
    if inversion_eje:
        invertir(inversion_eje, inversionX, inversionY)

    glLineWidth(3)
    # Actualizar animaciones
    personaje.animacionLengua()
    personaje.animacionOjos()
    # Actualizar el temporizador de la animación de los brazos
    if personaje.tiempo_animacion_brazos > 0:
        personaje.tiempo_animacion_brazos -= 1 / 60  # Reducir el temporizador (asumiendo 60 FPS)
        personaje.animacionBrazoDerecho()
        personaje.animacionBrazoIzquierdo()
    else:
        # Devolver los brazos a su posición original
        if personaje.angulo_brazo_derecho > 0:
            personaje.angulo_brazo_derecho -= 5
        elif personaje.angulo_brazo_derecho < 0:
            personaje.angulo_brazo_derecho += 5

        if personaje.angulo_brazo_izquierdo > 0:
            personaje.angulo_brazo_izquierdo -= 5
        elif personaje.angulo_brazo_izquierdo < 0:
            personaje.angulo_brazo_izquierdo += 5

    # Dibujar el personaje
    personaje.dibujar()

    glPopMatrix()

    glutSwapBuffers() 

# Función para manejar la entrada del teclado
def teclado(key, x, y):
    global personaje_x, personaje_y, traslacion_x, traslacion_y, rotacion_angulo, escalamiento_x, escalamiento_y, recorte_activo, inversion_eje, inversionX, inversionY
    velocidad = 10  # Velocidad de movimiento del personaje

    if key == b'a':  # Mover a la izquierda
        traslacion_x -= velocidad
        personaje.tiempo_animacion_brazos = 2
    elif key == b'd':  # Mover a la derecha
        traslacion_x += velocidad
        personaje.tiempo_animacion_brazos = 2
    elif key == b'w':  # Mover hacia arriba
        traslacion_y += velocidad
        personaje.tiempo_animacion_brazos = 2
    elif key == b's':  # Mover hacia abajo
        traslacion_y -= velocidad
        personaje.tiempo_animacion_brazos = 2
    elif key == b'q':  # Rotación
        rotacion_angulo += 10
    elif key == b'e':  # Rotación
        rotacion_angulo -= 10
    elif key == b'z':  # Escalamiento
        escalamiento_x *= 0.9
        escalamiento_y *= 0.9
    elif key == b'x':  # Escalamiento
        escalamiento_x *= 1.1
        escalamiento_y *= 1.1
    elif key == b'c':  # Inversión en el eje X
        inversion_eje = 'x'
        inversionX *= -1
    elif key == b'v':  # Inversión en el eje Y
        inversion_eje = 'y'
        inversionY *= -1

    glutPostRedisplay()  # Redibujar la escena

# Inicialización de GLUT y creación de la ventana
glutInit()
glutInitDisplayMode(GLUT_RGBA)  
glutInitWindowSize(w, h) 
glutInitWindowPosition(100, 100)  
wind = glutCreateWindow(b"Proyecto de Graficacion 2D!") 

glClearColor(39/255, 50/255, 70/255, 1.0)  

glutDisplayFunc(showScreen) 
glutIdleFunc(showScreen) 
glutKeyboardFunc(teclado)  # Registrar la función de manejo de teclado

glutMainLoop()  