export const projects = [
    {
      id: 1,
      name: "Compilador C#",
      description: "Compilador desarrollado en WinForms que transforma código fuente a lenguaje intermedio.",
      type: "Escritorio",
      techs: ["C#", "WinForms", "Analizador Léxico", "Generador de Código"],
      files: [
        {
          name: "frmCompilador.cs",
          type: "Formulario principal de la aplicacion",
          language: "csharp",
          content: `using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Resources;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Compilador
{
    public partial class frmCompilador : Form
    {        
        DataTable dtTokens;
        List<string> listaPosfijo;
        DataTable dtVariables;
        DataTable dtErrores;
        bool erroresLexico = false, errores = false;
        public frmCompilador()
        {
            InitializeComponent();
            rtxtNumLinea.Text = "1";
        }

        private void lexicoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            dtTokens = new DataTable();
            dtTokens.Columns.Add("Token", typeof(int));
            dtTokens.Columns.Add("Lexema", typeof(string));
            dtTokens.Columns.Add("Linea", typeof(int));
            dtTokens.Columns.Add("Estado", typeof(string));

            DataTable dtErrores = new DataTable();
            dtErrores.Columns.Add("Token Error", typeof(string));
            dtErrores.Columns.Add("Posición", typeof(string));
            dtErrores.Columns.Add("Descripcion", typeof(string));

            clsLexico objLexico = new clsLexico();
            int l = 1;
            foreach (var linea in rtxtCodigo.Lines)
            {
                objLexico.analizarLinea(linea.ToString(), dtTokens, dtErrores, l);
                if (l == rtxtCodigo.Lines.Length || rtxtCodigo.Lines.Length == 1)
                {
                    if (objLexico.contLlaves != 0)
                    {
                        dtErrores.Rows.Add($"Error \\"}}\\" Expected #{506}", $"Linea {l}", $"Hay {objLexico.contLlaves} {{ sin cerrar");
                    }
                }
                l++;
            }
            pnlLexico.Controls.Clear();
            if (dtErrores.Rows.Count > 0)
            {
                erroresLexico = true;
            }
            else erroresLexico = false;
            frmTablaTokens frm = new frmTablaTokens() { Dock = DockStyle.Fill, TopLevel = false, TopMost = true };
            frm.cargarTabla(dtTokens, dtErrores);
            frm.FormBorderStyle = FormBorderStyle.None;
            pnlLexico.Controls.Add(frm);
            frm.Show();
        }

        private void sintacticoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            dtErrores = new DataTable();
            dtErrores.Columns.Add("Token Error", typeof(string));
            dtErrores.Columns.Add("Posición", typeof(string));
            dtErrores.Columns.Add("Descripcion", typeof(string));
            dtErrores.Columns.Add("Tipo", typeof(string));
            dtVariables = new DataTable();
            dtVariables.Columns.Add("Variable", typeof(string));
            dtVariables.Columns.Add("Tipo", typeof(string));
            dtVariables.Columns.Add("Valor inicial", typeof(string));
            listaPosfijo = new List<string>();
            clsSintactico objSintactico = new clsSintactico();
            objSintactico.AnalizarTokens(dtTokens, dtErrores, listaPosfijo, dtVariables);
            pnlSintactico.Controls.Clear();
            frmErroresSintactico frm = new frmErroresSintactico() { Dock = DockStyle.Fill, TopLevel = false, TopMost = true };
            frm.cargarTabla(dtErrores);
            frm.FormBorderStyle = FormBorderStyle.None;
            pnlSintactico.Controls.Add(frm);
            frm.Show();
            pnlSemantico.Controls.Clear();
            frmSemantico frm2 = new frmSemantico() { Dock = DockStyle.Fill, TopLevel = false, TopMost = true };
            frm2.cargarTabla(listaPosfijo, dtVariables);
            frm2.FormBorderStyle = FormBorderStyle.None;
            pnlSemantico.Controls.Add(frm2);
            frm2.Show();
        }

        private void semanticoToolStripMenuItem_Click(object sender, EventArgs e)
        {
            lexicoToolStripMenuItem_Click(sender, e);
            sintacticoToolStripMenuItem_Click(sender, e);
        }
        string asm;
        private void toolStripMenuItem1_Click(object sender, EventArgs e)
        {
            pnlForms.Visible = false;
            btnHide.Visible = false;
            semanticoToolStripMenuItem_Click(sender, e);
            clsCodigoIntermedio objCodigoIntermedio = new clsCodigoIntermedio();
            objCodigoIntermedio.imprimir = imprimir;
            objCodigoIntermedio.GenerarCodigoIntermedio(listaPosfijo, dtVariables, dtTokens, dtErrores);
            if (dtErrores.Rows.Count > 0)
            {
                errores = true;
            }
            else errores = false;
            if (errores || erroresLexico)
            {
                pnlForms.Visible = true;
                btnHide.Visible = true;
            }
            if(errores == false)
            {
                string codigoASM = asm; // El código en formato Assembly
                string rutaArchivo = @"C:\\emu8086\\MySource\\compiCode.asm";
                System.IO.File.WriteAllText(rutaArchivo, codigoASM);
                Process proceso = new Process();
                proceso.StartInfo.FileName = @"C:\\emu8086\\emu8086.exe"; // Ruta del ejecutable emu8086
                proceso.StartInfo.Arguments = rutaArchivo; // Opcional: pasa el archivo como argumento si emu8086 lo soporta
                proceso.Start();
                System.Threading.Thread.Sleep(9000);
                SendKeys.Send("{F5}");
                System.Threading.Thread.Sleep(7000);
                SendKeys.Send("{F9}");
            }
        }
        private void imprimir(string obj)
        {
            rtxtCodigoIntermedio.Text = obj;
            asm = obj;
        }
        private void clearToolStripMenuItem_Click(object sender, EventArgs e)
        {
            rtxtCodigo.Text = "";
            rtxtNumLinea.Text = "";
        }
        private void palabrasReservadasToolStripMenuItem_Click(object sender, EventArgs e)
        {
            clsLexico objLexico = new clsLexico();
            frmPalabrasReservadas frm = new frmPalabrasReservadas();
            DataTable dt = new DataTable();
            dt.Columns.Add("C#");
            dt.Columns.Add("Compi");
            for (int i = 0; i < objLexico.ReservadasCSharp.Length; i++)
            {
                dt.Rows.Add($"{objLexico.ReservadasCSharp[i]}", $"{objLexico.palabrasReservadas[i]}");
            }
            frm.cargarLista(dt);
            frm.StartPosition = FormStartPosition.Manual;
            frm.Location = new Point(10, 100);
            frm.Show();
        }
        private void frmCompilador_Load(object sender, EventArgs e)
        {
            AddLineNumbers();
        }
        private void AddLineNumbers()
        {
            if (rtxtCodigo.Lines.Length != rtxtNumLinea.Lines.Length + 1)
            {
                Point pt = new Point(0, 0);
                int firstIndex = rtxtCodigo.GetCharIndexFromPosition(pt);
                int firstLine = rtxtCodigo.GetLineFromCharIndex(firstIndex);
                pt.Y = ClientRectangle.Height;
                int lastIndex = rtxtCodigo.GetCharIndexFromPosition(pt);
                int lastLine = rtxtCodigo.GetLineFromCharIndex(lastIndex);
                rtxtNumLinea.SelectionAlignment = HorizontalAlignment.Center;
                rtxtNumLinea.Text = "";            
                for (int i = firstLine; i <= lastLine; i++)
                {
                    rtxtNumLinea.Text += (i + 1) + "\\n";
                }
            }
        }

        private void rtxtCodigo_VScroll(object sender, EventArgs e)
        {
            rtxtNumLinea.Text = "";
            AddLineNumbers();
            rtxtNumLinea.Invalidate();
        }

        private void rtxtCodigo_TextChanged(object sender, EventArgs e)
        {
            AddLineNumbers();
        }

        private void rtxtCodigo_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.F11)
            {
                codIntermedioToolStripMenuItem.PerformClick();
            }
        }

        private void txtFileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrWhiteSpace(rtxtCodigoIntermedio.Text))
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                string filePath = Path.Combine(desktopPath, "CodigoIntermedio.txt");
                try
                {
                    File.WriteAllText(filePath, rtxtCodigoIntermedio.Text);
                    MessageBox.Show($"El contenido se ha guardado en: {filePath}", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Ocurrió un error al guardar el archivo: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void txtTestToolStripMenuItem_Click(object sender, EventArgs e)
        {
            rtxtCodigo.Text = "mobis x = 3;\\r\\nmobis y = 2;\\r\\ntabis z = 4.3;\\r\\nmercs s = \\"hola\\";\\r\\n\\r\\nmobis hola()\\r\\n{\\r\\n\\tie(x != y)\\r\\n\t{\\r\\n\\t\\ty++;\\r\\n\t}\\r\\n\tnavori\\r\\n\t{\\r\\n\\t\\tx--;\\r\\n\\t}\\r\\n\\tcollector x;\\r\\n}\\r\\nguinsoo flash()\\r\\n{\\r\\n\\tx = x + y;\\r\\n\\tsterak(x <= 7)\\r\\n\\t{\\r\\n\\t\\ty++;\\r\\n\\t} \\r\\n}";
        }

        private void toolStripMenuItem3_Click(object sender, EventArgs e)
        {
            About aboutForm = new About();
            aboutForm.ShowDialog();
        }

        private void btnHide_Click(object sender, EventArgs e)
        {
            pnlForms.Visible = false;
            btnHide.Visible = false;
        }
    }
}
`
        },
        {
          name: "clsLexico.cs",
          type: "Clase que hace la función del analizador léxico.",
          language: "csharp",
          content: String.raw`using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Compilador
{
    internal class clsLexico
    {
        int[,] matriz = {
          //| L | D  | _  | +  | -  | *  | /  | >  | <  | =  | !  | "  | $  | \  | {  | }  | [  | ]  | (  | )  | .  | ,  | ;  | :  | &  | \10| N.I| O.C| \32| ^  |
          //| 1 | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
      /*0*/ {  1,   2,   1,  10,  12, 907, 908,  15,  14,  16,  17,   5,   6, 917, 918, 919, 922, 923, 920, 921, 924, 926, 927, 925, 916,   0,   0, 502,   0, 935},
      /*1*/ {  1,   1,   1, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900, 900},
      /*2*/ {503,   2, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 503, 902, 902,   3, 500, 902, 503, 503, 902, 503, 503, 902, 902},
      /*3*/ {500,   4, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500},
      /*4*/ {500,   4, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 903, 903, 500, 903, 903, 500, 500, 903, 500, 500, 903, 903},
      /*5*/ {  5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5, 901,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5, 501,   5,   5,   5,   5},
      /*6*/ {  6,   6,   6,   6,   6,   7,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6,   6, 904,   6,   6,   6,   6},
      /*7*/ {  7,   7,   7,   7,   7,   8,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7},
      /*8*/ {  7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7, 904,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7,   7},
      /*9*/ {507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 927, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 507, 927,   9, 507,   9, 507},
      /*10*/{905, 905, 905,  11, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905, 905},
      /*11*/{504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 929, 504, 504, 929, 504, 504, 929, 504, 504, 929, 504},
      /*12*/{906, 906, 906, 906,  13, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906, 906},
      /*13*/{504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 504, 930, 504, 504, 930, 504, 504, 930, 504, 504, 930, 504},
      /*14*/{909, 909, 909, 909, 909, 909, 909, 505, 505, 910, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909, 909},
      /*15*/{912, 912, 912, 912, 912, 912, 912, 505, 505, 911, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912, 912},
      /*16*/{913, 913, 913, 913, 913, 913, 913, 913, 913, 914, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913, 913},
      /*17*/{928, 928, 928, 928, 928, 928, 928, 928, 928, 915, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928, 928}
        };
        public string[] palabrasReservadas = { "tear", "sorcerer", "tabis", "mobis", "mercs", "ie", "navori", "randuin", "youmuu", "sterak", "morello", "mikael",
                                        "collector", "liandry", "luden", "thornmail", "guinsoo", "trinity", "muramana", "manamune", "botrk", "ignite", "flash",
                                        "cleanse", "tp", "exh", "ghost", "ient", "codex", "proto" };
        public string[] ReservadasCSharp = { "bool", "char", "double", "int", "string", "if", "else", "switch", "case", "while", "for", "break",
                                        "return", "public", "private", "new", "void", "class", "true", "false", "null", "using", "main",
                                        "static", "console", "system", "program", "elseif", "writeline", "readline" };
        int[] Errores = { 500, 501, 502, 503, 504, 505, 506, 507 };
        int[] EstadosFinales = { 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920,
                                 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935 };
        char[] simbolosNI = { '(', ')', '{', '}', '[', ']', '.', ',', '$', '"', '\'', ' ', '+', '-', '*', '/', ';' };
        //string palabraReservada = string.Empty;
        bool reservada = false;
        public int contLlaves = 0;

        Dictionary<int, string> simbolos = new Dictionary<int, string>
            {
                { 901, "Cadena" },  
                { 902, "Número Entero" }, 
                { 903, "Número Decimal" },  
                { 904, "Comentario" },  
                { 905, "Suma" }, // + 
                { 906, "Resta" }, // -
                { 907, "Multiplicación" }, // *
                { 908, "División" }, // / 
                { 909, "Menor Que" }, // <
                { 910, "Menor o Igual" }, // <=
                { 911, "Mayot o Igual" }, // >=
                { 912, "Mayor Que" }, // >
                { 913, "Igualacion" }, // =
                { 914, "Operador de Asignación" }, // ==
                { 915, "Diferente de" }, // !=
                { 916, "Operador Relacional" }, // &
                { 917, "Delimitador" }, // \
                { 918, "Delimitador" }, // {
                { 919, "Delimitador" }, // }
                { 920, "Delimitador" }, // (
                { 921, "Delimitador" }, // )
                { 922, "Delimitador" }, // [
                { 923, "Delimitador" }, // ]
                { 924, "Delimitador" }, // .
                { 925, "Delimitador" }, // :
                { 926, "Delimitador" }, // ,
                { 927, "Fin de Linea" }, // ;
                { 928, "Delimitador" },  // !
                { 929, "Operador de Incremento" },  // ++
                { 930, "Operador de Decremento" },  // --
                { 935, "Potencia" }  // ^
            };
        public void analizarLinea(string linea, DataTable dt, DataTable dtErrores, int l)
        {
            string palabra = "";
            int fila = 0,columna = 0;

            for (int i = 0; i <= linea.Length; i++)
            {
                if (linea.Length == 0)
                {
                    break;
                }
                if (i == linea.Length && linea.Length > 1)
                {
                    columna = ObtenerColumna('\n');
                    fila = matriz[fila, columna];
                }              
                else
                {
                    char c = linea[i];
                    columna = ObtenerColumna(c);
                    palabra += c;                   
                    palabra = palabra.TrimStart();
                    fila = matriz[fila, columna];
                }
                if (EstadosFinales.Contains(fila))
                {
                    if (fila == 900)
                    {
                        if (simbolosNI.Contains(palabra[palabra.Length - 1]))
                        {
                            palabra = palabra.Replace(Convert.ToString(palabra[palabra.Length - 1]), "");
                            i--;
                        }
                        int token = obtenerToken(palabra.ToLower());
                        if (token != 0)
                        {
                            if (token <= 804) { dt.Rows.Add(token, palabra, l, "Tipo de Variable"); reservada = true; }
                            else if(token == 824) { dt.Rows.Add(token, palabra, l, "Console"); }
                            else if(token == 828) { dt.Rows.Add(token, palabra, l, "WriteLine"); }
                            else if(token == 829) { dt.Rows.Add(token, palabra, l, "ReadLine"); }
                            else if (token > 804 && token <= 806 || token == 827) { dt.Rows.Add(token, palabra, l, "Condicional"); }
                            else if (token > 806 && token <= 808 || token == 811 || token == 812) { dt.Rows.Add(token, palabra, l, "Control de Flujo"); }
                            else if (token > 808 && token <= 810) { dt.Rows.Add(token, palabra, l, "Ciclos"); }
                            else if ((token > 812 && token <= 817) || token > 820) { dt.Rows.Add(token, palabra, l, "Modificadores de Clase"); }
                            else if (token > 817 && token < 820) { dt.Rows.Add(token, palabra, l, "Boolean"); }
                            else if (token == 820) { dt.Rows.Add(token, palabra, l, "Variables Especiales"); }
                        }
                        else
                        {
                            dt.Rows.Add(fila, palabra, l, "Variable");
                        }
                    }
                    else
                    {
                        if (simbolos[fila] == "Cadena")
                        {
                            palabra = palabra.Replace("\"", "");
                        }
                        else if (simbolos[fila] == "Número Entero" || simbolos[fila] == "Número Decimal" || simbolos[fila] == "Operador de Incremento" || simbolos[fila] == "Operador de Decremento")
                        {
                            if (simbolosNI.Contains(palabra[palabra.Length - 1]))
                            {
                                palabra = palabra.Replace(Convert.ToString(palabra[palabra.Length - 1]), "");
                                if (!palabra.Contains(";"))
                                {
                                    i--;
                                }
                            }
                        }
                        dt.Rows.Add(fila, palabra, l, simbolos[fila]);
                    }
                    fila = 0;
                    palabra = "";
                }
                else if (Errores.Contains(fila))
                {
                    ObtenerError(fila, l, i, dtErrores);                  
                    break;
                }
                if (linea.Length == 1)
                {
                    break;
                }
            }
        }
        public int obtenerToken(string palabra)
        {
            switch (palabra)
            {
                case "tear": //bool
                    return 800;
                case "sorcerer": //char
                    return 801;
                case "tabis": //double
                    return 802;
                case "mobis": //int
                    return 803;
                case "mercs": //string
                    return 804;
                case "ie":    //if
                    return 805;
                case "navori": //else
                    return 806;
                case "randuin": //switch
                    return 807;
                case "youmuu": //case
                    return 808;
                case "sterak": //while
                    return 809;
                case "morello": //for
                    return 810;
                case "mikael": //break
                    return 811;
                case "collector": //return
                    return 812;
                case "liandry": //public
                    return 813;
                case "luden": //private
                    return 814;
                case "thornmail": //new
                    return 815;
                case "guinsoo": //void
                    return 816;
                case "trinity": //class
                    return 817;
                case "muramana": //false
                    return 818;
                case "manamune": //true 
                    return 819;
                case "botrk": //null
                    return 820;
                case "ignite": //using
                    return 821;
                case "flash": //main
                    return 822;
                case "cleanse": //static
                    return 823;
                case "tp": //console
                    return 824;
                case "exh": //system
                    return 825;
                case "ghost": //program
                    return 826;
                case "ient": //else if
                    return 827;
                case "codex": //writeLine
                    return 828;
                case "proto": //readLine
                    return 829;
            }
            return 0;
        }
        public void ObtenerError(int token, int linea, int pos, DataTable dt)
        {
            switch (token)
            {
                case 500:
                    dt.Rows.Add($"Error numerico #{token}", $"Linea {linea}, posicion {pos}", $"El numero que ingresó no es entero o decimal");
                    break;
                case 501:
                    dt.Rows.Add($"Error de cadena #{token}", $"Linea {linea}, posicion {pos}", $"No se cerró correctamente la cadena");
                    break;
                case 502:
                    dt.Rows.Add($"Unknown Character #{token}", $"Linea {linea}, posicion {pos}", $"El caracter que ingresó no está definido");
                    break;
                case 503:
                    dt.Rows.Add($"Error de Declaración #{token}", $"Linea {linea}, posicion {pos}", $"No se declaró correctamente la variable");
                    break;
                case 504:
                    dt.Rows.Add($"Error Aritmetico #{token}", $"Linea {linea}, posicion {pos}", $"Se repitió un operador artimetico");
                    break;
                case 505:
                    dt.Rows.Add($"Error Relacional #{token}", $"Linea {linea}, posicion {pos}", $"Se repitió un operador relacional");
                    break;
                case 506:
                    dt.Rows.Add($"Error \"}}\" Expected #{506}", $"Linea {linea}, posicion {pos}", $"Hay un {{ sin cerrar");
                    break;
                case 507:
                    dt.Rows.Add($"Error \";\" Expected or Code After \";\" #{507}", $"Linea {linea}, posicion {pos}", $"Se esperaba un ; para finalizar la linea o se escribio codigo desdpues de un ;");
                    break;
                case 508:
                    dt.Rows.Add($"Error Identifier Expected #{508}", $"Linea {linea}, posicion {pos}", $"No se pueden utilizar palabras reservadas como identificador");
                    break;
            }
        }
        public int ObtenerColumna(char c)
        {
            int columna = 0;

            if (char.IsLetter(c))
            {
                columna = 0;
            }
            else if (char.IsDigit(c))
            {
                columna = 1;
            }
            else
            {
                switch (c)
                {
                    case '_':
                        columna = 2;
                        break;
                    case '+':
                        columna = 3;
                        break;
                    case '-':
                        columna = 4;
                        break;
                    case '*':
                        columna = 5;
                        break;
                    case '/':
                        columna = 6;
                        break;
                    case '>':
                        columna = 7;
                        break;
                    case '<':
                        columna = 8;
                        break;
                    case '=':
                        columna = 9;
                        break;
                    case '!':
                        columna = 10;
                        break;
                    case '"':
                        columna = 11;
                        break;
                    case '$':
                        columna = 12;
                        break;
                    case '\\':
                        columna = 13;
                        break;
                    case '{':
                        columna = 14;
                        break;
                    case '}':
                        columna = 15;
                        break;
                    case '[':
                        columna = 16;
                        break;
                    case ']':
                        columna = 17;
                        break;
                    case '(':
                        columna = 18;
                        break;
                    case ')':
                        columna = 19;
                        break;
                    case '.':
                        columna = 20;
                        break;
                    case ',':
                        columna = 21;
                        break;
                    case ';':
                        columna = 22;
                        break;
                    case ':':
                        columna = 23;
                        break;
                    case '&':
                        columna = 24;
                        break;
                    case '\n':
                        columna = 25;
                        break;
                    case '\t':
                    case '\0':
                    case (char)0x2408:
                        columna = 26;
                        break;
                    case ' ':
                        columna = 28;
                        break;
                    case '^':
                        columna = 29;
                        break;
                    default:
                        columna = 27;
                        break;
                }
            }
            return columna;
        }
    }
} 
`
        },
        {
          name: "clsSintactico.cs",
          type: "Esta clase contiene la logica tanto del analizador sintáctico como el semántico.",
          language: "csharp",
          content: String.raw`using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.Eventing.Reader;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Compilador
{
    internal class clsSintactico
    {
        int[,] matriz = {
            //|ent| dec| _  | +  | -  | *  | /  | >  | <  | =  | !  | "  | $  | \  | {  | }  | [  | ]  | (  | )  | .  | ,  | ;  | :  | &  | \10| N.I| O.C| \32| && | || | int| dob| str| if |else|elif| for|whil| var|true|fals| cad| <= | >= | == | != | ++ | -- | csl|main|usin| wrt|void|bool|read|rtrn| ^  |
            //| 0 | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 |
        /*0*/ {415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415,   0,   0, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415, 415,  36,  41,  46,   1, 415, 415,  10,  27,  59, 415, 415, 415, 415, 415, 415, 415, 415, 415,  63,  70,  56, 415,   0,  51, 415, 415, 415},
        /*1*/ {400, 400, 400, 400, 400,400,400,400,400,400,400,400,400,400,400,400,400,400,2,400,400,400,400,400,400,400,400,400,1,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400, 400, 400, 400},
        /*2*/ {  3,   3, 401, 401, 401,401,401,401,401,401,401,401,401,401,401,401,401,401,2,401,401,401,401,401,401,401,401,401,2,401,401,401,401,401,401,401,401,401,401,3,5,5,3,401,401,401,401,401,401,401,401,401,401,401, 401, 401, 401, 401},
        /*3*/ {402, 402, 402,   2,   2,2,2,4,4,411,402,402,402,402,402,402,402,402,402,3,402,402,402,402,402,402,402,402,3,402,402,402,402,402,402,402,402,402,402,402,402,402,402,4,4,4,4,402,402,402,402,402,402,402, 402, 402, 402,   2},
        /*4*/ {5,5, 401, 401, 401, 401,401,401,401,401,401,401,401,401,401,401,401,401,4,401,401,401,401,401,401,401,401,401,4,401,401,401,401,401,401,401,401,401,401,5,401,401,5,401,401,401,401,401,401,401,401,401,401,401, 401, 401, 401, 401},
        /*5*/ {403, 403, 403,   2,   2,2,2,403,403,403,403,403,403,403,403,403,403,403,403,6,403,403,403,403,403,403,403,403,5,2,2,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403, 403, 403, 403,   2},
        /*6*/ {404, 404, 404, 404, 404,404,404,404,404,404,404,404,404,404,7,404,404,404,404,6,404,404,404,404,404,6,404,404,6,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404, 404, 404, 404, 404},
        /*7*/ {414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414,   7,   9, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414,  36,  41,  46,   1,   6,   1,  10,  27,  59, 414, 414, 414, 414, 414, 414, 414, 414, 414,  63, 427, 428, 414, 414,  51, 414, 414, 414},
        /*8*/ {405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,   9, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,   7,   7,   7,   7, 405, 405,   7,   7,   7, 405, 405, 405, 405, 405, 405, 405, 405, 405,   7, 405, 405, 405, 405,   7, 405, 405, 405},
        /*9*/ {805, 805, 805, 805, 805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,6,1,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805,805, 805, 805, 805, 805}, 
        /*10*/{400, 400, 400, 400, 400,400,400,400,400,400,400,400,400,400,400,400,400,400,11,400,400,400,400,400,400,400,400,400,10,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400, 400, 400, 400, 400},
        /*11*/{406, 406, 406, 406, 406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,406,11,406,406,12,12,406,406,406,406,406,406,13,406,406,406,406,406,406,406,406,406,406,406,406,406,406, 406, 406, 406, 406},
        /*12*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,12,407,407,407,407,407,407,407,407,407,407,13,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*13*/{408, 408, 408, 408, 408,408,408,408,408,14,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,13,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408, 408, 408, 408, 408},
        /*14*/{ 15,  15, 409, 409, 409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,14,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409,409, 409, 409, 409, 409},
        /*15*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,16,410,410,410,410,410,15,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*16*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,16,407,407,407,407,407,407,407,407,407,407,17,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*17*/{411, 411, 411, 411, 411,411,411,18,18,18,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,411,17,411,411,411,411,411,411,411,411,411,411,411,411,411,411,18,18,18,18,411,411,411,411,411,411,411, 411, 411, 411, 411},
        /*18*/{ 19,  19, 412, 412, 412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,412,18,412,412,412,412,412,412,412,412,412,412,19,412,412,412,412,412,412,412,412,412,412,412,412,412,412, 412, 412, 412, 412},
        /*19*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,20,410,410,410,410,410,19,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*20*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,20,407,407,407,407,407,407,407,407,407,407,21,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*21*/{413, 413, 413, 413, 413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,21,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,413,22,22,413,413,413,413,413, 413, 413, 413, 413},
        /*22*/{403, 403, 403, 403, 403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,23,403,403,403,403,403,403,403,403,22,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403, 403, 403, 403, 403},
        /*23*/{404, 404, 404, 404, 404,404,404,404,404,404,404,404,404,404,24,404,404,404,404,404,404,404,404,404,404,23,404,404,23,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404, 404, 404, 404, 404},
        /*24*/{405, 405, 405, 405, 405,405,405,405,405,405,405,405,405,405,24,26,405,405,405,405,405,405,405,405,405,24,405,405,24,405,405,25,25,25,25,415,415,25,25,25,405,405,405,405,405,405,405,405,405,63,427,428,405,405, 405, 405, 405, 405},
        /*25*/{414, 414, 414, 414, 414,414,414,414,414,414,414,414,414,414,414,26,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414,414, 414, 414, 414, 414},
        /*26*/{810, 810, 810, 810, 810,810,810,810,810,810,810,810,810,810,810,26,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810,810, 810, 810, 810, 810},
        /*27*/{400, 400, 400, 400, 400,400,400,400,400,400,400,400,400,400,400,400,400,400,28,400,400,400,400,400,400,400,400,400,27,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400, 400, 400, 400, 400},
        /*28*/{ 29,  29, 412, 412, 412,412,412,412,412,412,412,412,412,412,412,412,412,412,28,412,412,412,412,412,412,412,412,412,28,412,412,412,412,412,412,412,412,412,412,29,31,31,29,412,412,412,412,412,412,412,412,412,412,412, 412, 412, 412, 412},
        /*29*/{411, 411, 411,  28,  28,28,28,30,30,411,411,411,411,411,411,411,411,411,411,29,411,411,411,411,411,411,411,411,29,411,411,411,411,411,411,411,411,411,411,411,411,411,411,30,30,30,30,411,411,411,411,411,411,411, 411, 411, 411,  28},
        /*30*/{ 31,  31, 412, 412, 412,412,412,412,412,412,412,412,412,412,412,412,412,412,30,412,412,412,412,412,412,412,412,412,30,412,412,412,412,412,412,412,412,412,412,31,412,412,31,412,412,412,412,412,412,412,412,412,412,412, 412, 412, 412, 412},
        /*31*/{403, 403, 403,  30, 30,30,30,403,403,403,403,403,403,403,403,403,403,403,403,32,403,403,403,403,403,403,403,403,31,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403, 403, 403, 403,  30},
        /*32*/{404, 404, 404, 404, 404,404,404,404,404,404,404,404,404,404,33,404,404,404,404,32,404,404,404,404,404,32,404,404,32,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404,404, 404, 404, 404, 404},
        /*33*/{414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414,  33,  35, 414, 414, 414, 414, 414, 414, 414, 414, 414,  33, 414, 414,  33, 414, 414,  36,  41,  46,   1, 415, 415,  10,  27,  59, 414, 414, 414, 414, 414, 414, 414, 414, 414,  63, 427, 428, 414, 414, 51, 414, 414, 414},
        /*34*/{405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,  35, 405, 405, 405, 405, 405, 405, 405, 405, 405,  34, 405, 405,  34, 405, 405,  33,  33,  33,  33, 405, 405,  33,  33,  33, 405, 405, 405, 405, 405, 405, 405, 405, 405,  33, 405, 405, 405, 405, 33, 405, 405, 405},
        /*35*/{809, 809, 809, 809, 809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,35,809,809,35,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809,809, 809, 809, 809, 809},
        /*36*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,36,407,407,407,407,407,407,407,407,407,407,37,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*37*/{420, 420, 420, 420, 420,420,420,420,420,38,420,420,420,420,420,420,420,420,70,420,420,420,40,420,420,420,420,420,37,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420, 420, 420, 420, 420},
        /*38*/{ 39, 417, 417, 417, 417,417,417,417,417,417,417,417,417,417,417,417,417,417,38,417,417,417,417,417,417,417,417,417,38,417,417,417,417,417,417,417,417,417,417,39,417,417,417,417,417,417,417,417,417,417,417,417,417,417, 417, 417, 417, 417},
        /*39*/{410, 410, 410,  38, 38,38,38,410,410,410,410,410,410,410,410,410,410,410,410,39,410,410,40,410,410,410,410,410,39,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410,  38},
        /*40*/{803, 803, 803, 803, 803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,40,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803,803, 803, 803, 803, 803},
        /*41*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,41,407,407,407,407,407,407,407,407,407,407,42,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*42*/{420, 420, 420, 420, 420,420,420,420,420,43,420,420,420,420,420,420,420,420,70,420,420,420,45,420,420,420,420,420,42,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420, 420, 420, 420, 420}, 
        /*43*/{ 44,  44, 409, 409, 409,409,409,409,409,409,409,409,409,409,409,409,409,409,43,409,409,409,409,409,409,409,409,409,43,409,409,409,409,409,409,409,409,409,409,44,409,409,409,409,409,409,409,409,409,409,409,409,409,409, 409, 409, 409, 409},
        /*44*/{410, 410, 410,  43,  43,43,43,410,410,410,410,410,410,410,410,410,410,410,410,44,410,410,45,410,410,410,410,410,44,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410,  43},
        /*45*/{802, 802, 802, 802, 802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,45,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802,802, 802, 802, 802, 802},
        /*46*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,46,407,407,407,407,407,407,407,407,407,407,47,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*47*/{420, 420, 420, 420, 420,420,420,420,420,48,420,420,420,420,420,420,420,420,70,420,420,420,50,420,420,420,420,420,47,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420, 420, 420, 420, 420},
        /*48*/{418, 418, 418, 418, 418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,418,48,418,418,418,418,418,418,418,418,418,418,49,418,418,49,418,418,418,418,418,418,418,418,418,418,418, 418, 418, 418, 418},
        /*49*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,50,410,410,410,410,410,49,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*50*/{804, 804, 804, 804, 804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,50,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804,804, 804, 804, 804, 804},
        /*51*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,51,407,407,407,407,407,407,407,407,407,407,52,407,407,407,407,407,407,407,407,407,407,407,407,407,407, 407, 407, 407, 407},
        /*52*/{420, 420, 420, 420, 420,420,420,420,420,53,420,420,420,420,420,420,420,420,70,420,420,420,55,420,420,420,420,420,52,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420,420, 420, 420, 420, 420},
        /*53*/{419, 419, 419, 419, 419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,419,53,419,419,419,419,419,419,419,419,419,419,419,54,54,419,419,419,419,419,419,419,419,419,419,419,419, 419, 419, 419, 419},
        /*54*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,55,410,410,410,410,410,54,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*55*/{800, 800, 800, 800, 800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,55,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800,800, 800, 800, 800, 800},
        /*56*/{407, 407, 407, 407, 407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,407,57,407,407,407,407,407,407,407,407,407,407,57,407,407,407, 407, 407, 407, 407},
        /*57*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,58,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*58*/{821, 821, 821, 821, 821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821,821, 821, 821, 821, 821},
        /*59*/{408, 408, 408, 408, 408, 408, 408, 408, 408,  60, 408, 408, 408, 408, 408, 408, 408, 408,  79, 408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,408,61,61,408,408,408,408,408, 408, 408, 408, 408},
        /*60*/{ 61,  61, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423, 423,  60, 423, 423, 423, 423,423,423,423,423,423,423,423,423,423,423,423,423,423,423,423,423,61,423,423,61,423,423,423,423,423,423,63,423,423,423,423, 423,  82, 423, 423},
        /*61*/{410, 410, 410,  60,  60,  60,  60, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410,  61,410,410,62,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,429,429,410,410,410,410,410, 410, 410, 410,  60},
        /*62*/{900, 900, 900, 900, 900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900,900, 900, 900, 900, 900},
        /*63*/{424, 424, 424, 424, 424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,64,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424,424, 424, 424, 424, 424},
        /*64*/{425, 425, 425, 425, 425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,425,65,425, 425, 82, 425, 425},
        /*65*/{400, 400, 400, 400, 400,400,400,400,400,400,400,400,400,400,400,400,400,400,66,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400,400, 400, 400, 400, 400},
        /*66*/{426, 426, 426, 426, 426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,426,67,426,426,67,426,426,426,426,426,426,426,426,426,426,426, 426, 426, 426, 426},
        /*67*/{403, 403, 403,  66, 403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,68,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403,403, 403, 403, 403, 403},
        /*68*/{410, 410, 410, 410, 410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,69,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410,410, 410, 410, 410, 410},
        /*69*/{828, 828, 828, 828, 828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828,828, 828, 828, 828, 828},
        /*70*/{403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  70,  73, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  71,  71,  71, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  71, 403, 403, 403},
        /*71*/{407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407,  72, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407},
        /*72*/{403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  73, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403},
        /*73*/{400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,  74, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400},
        /*74*/{414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414,  74,  76, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414, 414,  36,  41,  46,   1, 415, 415,  10,  27,  59, 414, 414, 414, 414, 414, 414, 414, 414, 414,  63, 414, 414, 414, 414,  51, 414,  77, 414},
        /*75*/{405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,  76, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,  74,  74,  74,  74, 405, 405,  74,  74,  74, 405, 405, 405, 405, 405, 405, 405, 405, 405,  74, 405, 405, 405, 405,  74, 405, 405, 405},
        /*76*/{822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822, 822},
        /*77*/{ 78,  78, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407,  78, 407, 407,  78, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407, 407},
        /*78*/{410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410,  86, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410},
        /*79*/{ 80,  80, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  81, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  80, 403, 403,  80, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403},
        /*80*/{403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403,  81, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403},
        /*81*/{410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410,  76, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410},
        /*82*/{400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,  83, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400},
        /*83*/{403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403 ,403 ,403 ,403 ,403 ,403 ,403,  84, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403},
        /*84*/{410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410,  85, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410, 410},
        /*85*/{829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829 ,829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829, 829},
        /*86*/{405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405,  76, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405, 405}
        };

        int[] ErroresSintactico = { 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422,
                                    423, 424, 425, 426, 427, 428, 429, 430, 431 };
        public string[] palabrasReservadas = { "tear", "sorcerer", "tabis", "mobis", "mercs", "ie", "navori", "randuin", "youmuu", "sterak", "morello", "mikael",
                                        "collector", "liandry", "luden", "thornmail", "guinsoo", "trinity", "muramana", "manamune", "botrk", "ignite", "flash",
                                        "cleanse", "tp", "exh", "ghost", "ient", "codex", "proto" };
        int[] columnasProcesos = { 31, 32, 33, 34, 37, 38, 39, 49, 50, 51, 52, 54, 55 };
        int ContadorLlaves = 0;

        //semantico
        Stack<string> pila = new Stack<string>();
        Stack<string> pilaProcesos = new Stack<string>();
        bool declaracionVariable = false, comparacionCadenas = false, consoleLine = false, metodo = false, asignacionRead;
        int contadorIf = 0, contadorWhile = 0, lineaDeclaracion = 0;
        string banderaTipo = "", banderaMetodo = "";
        //Semantico

        public void AnalizarTokens(DataTable dtTokens, DataTable dtErrores, List<string> listaPosfijo, DataTable dtVariables)
        {
            int fila = 0, columna = 0;
            int[] filaProcesoAnterior = new int[10];

            int ContadorParentesis = 0;
            int ContadorProcesos = 0;
            bool procesosActivos = false;
            string variable = "";

            DataRow row = dtVariables.NewRow();

            for (int i = 0; i < dtTokens.Rows.Count; i++)
            {
                bool entrarSemantico = true;
                variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                /*Reduccion de Potencias*/
                #region
                if (variable == "^")
                {
                    if (dtTokens.Rows[i - 1]["Estado"].ToString().Trim() == "Número Entero" && dtTokens.Rows[i + 1]["Estado"].ToString().Trim() == "Número Entero")
                    {
                        double result = Math.Pow(Convert.ToDouble(dtTokens.Rows[i - 1]["Lexema"].ToString().ToLower().Trim()), Convert.ToDouble(dtTokens.Rows[i + 1]["Lexema"].ToString().ToLower().Trim()));
                        dtTokens.Rows.RemoveAt(i + 1);
                        dtTokens.Rows.RemoveAt(i);
                        dtTokens.Rows[i - 1]["Lexema"] = result.ToString();
                        dtTokens.Rows[i - 1]["Token"] = "902";
                        listaPosfijo.RemoveAt(listaPosfijo.Count - 1);
                        variable = result.ToString();
                        i--;
                        fila = 60;
                    }
                    else if (dtTokens.Rows[i - 1]["Lexema"].ToString().Trim() == ")")
                    {
                        int inicio = i, removerListaPosfijo = 0;
                        List<string> expresion = new List<string>();
                        while (dtTokens.Rows[inicio]["Lexema"].ToString().Trim() != "(")
                        {
                            inicio--;
                        }
                        for (int j = inicio; j < i; j++)
                        {
                            string token = dtTokens.Rows[j]["Lexema"].ToString().Trim();
                            if (double.TryParse(token, out _) || token == "+" || token == "-" || token == "*" || token == "/")
                                removerListaPosfijo++;
                            expresion.Add(dtTokens.Rows[j]["Lexema"].ToString().Trim());
                        }
                        if (IsConstantExpression(expresion))
                        {
                            string resultado = EvaluateExpression(expresion).ToString();
                            int remplazar = i;
                            if (dtTokens.Rows[i + 1]["Estado"].ToString().Trim() == "Número Entero")
                            {
                                resultado = Math.Pow(Convert.ToDouble(resultado), Convert.ToDouble(dtTokens.Rows[i + 1]["Lexema"].ToString().Trim())).ToString();
                                remplazar = i + 2;
                            }
                            dtTokens.Rows[inicio]["Lexema"] = resultado;
                            dtTokens.Rows[inicio]["Estado"] = "Número Entero";
                            dtTokens.Rows[inicio]["Token"] = "902";
                            string[] operadores = { "+", "-", "*", "/", "^" };
                            for (int j = inicio + 1; j < remplazar; j++)
                            {                              
                                dtTokens.Rows.RemoveAt(inicio + 1);
                            }
                            for(int j = 0; j < removerListaPosfijo; j++)
                                listaPosfijo.RemoveAt(listaPosfijo.Count - 1);
                            i = inicio;
                            variable = resultado;
                            fila = 60;
                        }
                    }
                }
                #endregion
                /*Eliminacion de codigo no utilizado*/
                #region
                //Codigo despues de un return
                if (variable == "collector")
                {
                    int j = i + 1;
                    while (dtTokens.Rows[j]["Lexema"].ToString().ToLower().Trim() != "}")
                    {
                        if (dtTokens.Rows[i]["Linea"].ToString() != dtTokens.Rows[j]["Linea"].ToString())
                        {
                            dtTokens.Rows.RemoveAt(j);
                        }
                        else j++;
                    }
                    variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                }
                //Eliminación de código muerto (condiciones siempre falsas)
                if (variable == "ie" && dtTokens.Rows[i + 2]["Lexema"].ToString().ToLower().Trim() == "manamune")
                {
                    int j = i + 2;
                    while (j < dtTokens.Rows.Count && dtTokens.Rows[j]["Lexema"].ToString().ToLower().Trim() != "}")
                    {
                        dtTokens.Rows.RemoveAt(j);
                    }
                    variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                }
                // Eliminación de variables no utilizadas 
                if ((variable == "mobis" || variable == "tabis" || variable == "mercs") && dtTokens.Rows[i + 2]["Lexema"].ToString().ToLower().Trim() != "(")
                {
                    string variableName = dtTokens.Rows[i + 1]["Lexema"].ToString().ToLower().Trim();
                    bool isUsed = false;
                    for (int j = i + 2; j < dtTokens.Rows.Count; j++)
                    {
                        if (dtTokens.Rows[j]["Lexema"].ToString().ToLower().Trim() == variableName)
                        {
                            isUsed = true;
                            break;
                        }
                    }
                    if (!isUsed)
                    {
                        while (dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim() != ";")
                        {
                            dtTokens.Rows.RemoveAt(i);
                        }
                        dtTokens.Rows.RemoveAt(i);
                    }
                    variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                }
                // Eliminación de código innecesario (cálculos no utilizados)
                //if (variable == "=")
                //{
                //    string variableName = dtTokens.Rows[i - 1]["Lexema"].ToString().ToLower().Trim();
                //    int linea = Convert.ToInt32(dtTokens.Rows[i]["Linea"]);
                //    bool isUsed = false;
                //    for (int j = i + 1; j < dtTokens.Rows.Count; j++)
                //    {
                //        if (dtTokens.Rows[j]["Lexema"].ToString().Trim() == variableName && linea != Convert.ToInt32(dtTokens.Rows[j]["Linea"]))
                //        {
                //            isUsed = true;
                //            break;
                //        }
                //    }
                //    if (!isUsed)
                //    {
                //        i--;
                //        while (dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim() != ";")
                //        {
                //            dtTokens.Rows.RemoveAt(i);
                //        }
                //        dtTokens.Rows.RemoveAt(i);
                //    }
                //    variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                //}
                #endregion

                /*Sintactico*/
                #region
                if (variable == "cleanse")
                {
                    int l = Convert.ToInt32(dtTokens.Rows[i]["Linea"]);
                    while (Convert.ToInt32(dtTokens.Rows[i]["Linea"]) == l)
                    {
                        i++;
                    }
                    variable = dtTokens.Rows[i]["Lexema"].ToString().ToLower().Trim();
                }
                if (variable == "{") { ContadorLlaves++; }
                if (variable == "}") { ContadorLlaves--; }
                if (variable == "(") { ContadorParentesis++; }
                if (variable == ")") { ContadorParentesis--; }
                columna = ObtenerColumna(Convert.ToInt32(dtTokens.Rows[i]["Token"]));
                if (variable == "program") { columna = 50; }
                if (columnasProcesos.Contains(columna) && (fila == 7 || fila == 24 || fila == 33 || fila == 74))
                {
                    procesosActivos = true;
                    ContadorProcesos++;
                    filaProcesoAnterior[ContadorProcesos] = fila;
                }
                fila = matriz[fila, columna];
                if (variable == "=" && dtTokens.Rows[i + 3]["Lexema"].ToString().ToLower().Trim() == "proto")
                {
                    asignacionRead = true;
                }
                if (fila >= 800 && fila < 1000 && procesosActivos == true && ContadorProcesos > 0)
                {
                    if (ContadorParentesis > 0) { fila = 403; ContadorParentesis--; }
                    else if (ContadorParentesis < 0) { fila = 400; ContadorParentesis++; }
                    else
                    {
                        fila = filaProcesoAnterior[ContadorProcesos];
                        ContadorProcesos--;
                        if (ContadorProcesos == 0) procesosActivos = false;
                        if (variable == "}") ContadorLlaves++;
                        i--;
                        entrarSemantico = false;
                    }
                }
                else if (fila >= 800 && fila < 1000)
                {
                    fila = 0;
                    i--;
                    entrarSemantico = false;
                }
                else if (fila == 40)
                {
                    if (ContadorParentesis > 0) { fila = 403; ContadorParentesis = 0; }
                    else if (ContadorParentesis < 0) { fila = 400; ContadorParentesis = 0; }
                }
                if (fila == 407)
                {
                    if (palabrasReservadas.Contains(variable))
                        fila = 416;
                }
                if (ErroresSintactico.Contains(fila))
                {
                    int lineas = Convert.ToInt32(dtTokens.Rows[dtTokens.Rows.Count - 1]["Linea"]);
                    int linea = Convert.ToInt32(dtTokens.Rows[i]["Linea"]);
                    if (columna == 61)
                        fila--;
                    if (fila == 410)
                        linea--;
                    ObtenerError(fila, linea, dtErrores, ContadorLlaves);
                    if (lineas == 1)
                        break;
                    while (Convert.ToInt32(dtTokens.Rows[i]["Linea"]) == linea && Convert.ToInt32(dtTokens.Rows[i]["Linea"]) < lineas)
                        i++;
                    if (linea != lineas)
                    {
                        fila = 0;
                        i--;
                    }
                    else if (linea == lineas)
                        break;
                }
                #endregion

                /*Semantico*/
                #region
                Dictionary<string, int> prioridades = new Dictionary<string, int>
                {
                    { "(", -1 }, { ")", -1 }, { "++", -1 }, { "--", -1 },
                    { "||", 0 },
                    { "&&", 1 },
                    { "<", 2 }, { ">", 2 }, { "!=", 2 }, { "==", 2 }, { "=", 2 }, { "<=", 2 }, { ">=", 2 },
                    { "+", 3 }, { "-", 3 },
                    { "*", 4 }, { "/", 4 }, { "%", 4 },
                    { "^", 5 }
                };
                Dictionary<string, string> Tipos = new Dictionary<string, string>
                {
                    { "Número Entero", "mobis" },
                    { "Número Decimal", "tabis" },
                    { "Cadena", "mercs" },
                    { "Boolean", "tear" },
                };
                if (entrarSemantico)
                {
                    if (lineaDeclaracion != Convert.ToInt32(dtTokens.Rows[i]["Linea"]))
                        declaracionVariable = false;

                    //Tabla Variables
                    if (dtTokens.Rows[i]["Estado"].ToString() == "Tipo de Variable")
                    {
                        declaracionVariable = true;
                        banderaTipo = variable;
                        lineaDeclaracion = Convert.ToInt32(dtTokens.Rows[i]["Linea"]);
                        row["Tipo"] = variable;
                    }
                    else if (declaracionVariable == true && lineaDeclaracion == Convert.ToInt32(dtTokens.Rows[i]["Linea"]))
                    {
                        if (dtTokens.Rows[i]["Estado"].ToString() == "Variable")
                        {
                            if (!ExisteVariable(dtVariables, variable))
                                row["Variable"] = variable;
                            else { ObtenerErrorSemantico(432, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0); }
                        }
                        else if (Tipos.ContainsKey(dtTokens.Rows[i]["Estado"].ToString()))
                        {
                            if (banderaTipo == Tipos[dtTokens.Rows[i]["Estado"].ToString()])
                                row["Valor Inicial"] = variable;
                            else
                            {
                                if (banderaTipo == "tabis" && Tipos[dtTokens.Rows[i]["Estado"].ToString()] == "mobis")
                                {
                                    row["Valor Inicial"] = variable;
                                }
                                else ObtenerErrorSemantico(433, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                            }
                        }
                        else if (variable == "(")
                        {
                            if (row["Tipo"].ToString() == "mobis" || row["Tipo"].ToString() == "tabis")
                            {
                                row["Valor inicial"] = 0;
                            }
                            else row["Valor inicial"] = "";
                            row["Tipo"] = "metodo " + row["Tipo"].ToString();
                            metodo = true;
                            banderaMetodo = banderaTipo;
                            banderaTipo = string.Empty;
                            dtVariables.Rows.Add(row);
                            row = dtVariables.NewRow();
                        }
                        else if (variable == ";")
                        {
                            dtVariables.Rows.Add(row);
                            row = dtVariables.NewRow();
                            banderaTipo = string.Empty;
                        }
                    }

                    //Procesos
                    else if (variable == "flash")
                    {
                        pilaProcesos.Push($"{variable}");
                        listaPosfijo.Add(pilaProcesos.Peek().ToString());
                    }
                    else if (metodo == true)
                    {
                        string nombreMetodo = "metodo " + dtVariables.Rows[dtVariables.Rows.Count - 1]["Variable"].ToString();
                        pilaProcesos.Push($"{nombreMetodo}");
                        listaPosfijo.Add(pilaProcesos.Peek());
                        metodo = false;
                    }
                    else if (variable == "ie")
                    {
                        contadorIf++;
                        pilaProcesos.Push($"{variable}{contadorIf}");
                        listaPosfijo.Add(pilaProcesos.Peek().ToString());
                        banderaTipo = "tear";
                    }
                    else if (variable == "sterak")
                    {
                        contadorWhile++;
                        pilaProcesos.Push($"{variable}{contadorWhile}");
                        listaPosfijo.Add(pilaProcesos.Peek().ToString());
                        banderaTipo = "tear";
                    }
                    else if (variable == "navori")
                    {
                        listaPosfijo.Add(pilaProcesos.Peek().ToString());
                    }
                    else if (variable == "{") { variable = "Inicio_" + pilaProcesos.Peek().ToString(); listaPosfijo.Add(variable); comparacionCadenas = false; }
                    else if (variable == "}")
                    {
                        if (pilaProcesos.Count > 0 && (pilaProcesos.Peek().ToString().Contains("sterak") || pilaProcesos.Peek().ToString().Contains("flash") || pilaProcesos.Peek().ToString().Contains("metodo")))
                        { 
                            listaPosfijo.Add("Fin_" + pilaProcesos.Pop().ToString()); 
                            metodo = false; 
                            if (banderaMetodo != string.Empty)
                            {
                                ObtenerErrorSemantico(438, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                                banderaMetodo = string.Empty;
                            }
                        }
                        else if (pilaProcesos.Count > 0 && pilaProcesos.Peek().ToString().Contains("ie"))
                        {
                            if (dtTokens.Rows.Count == i + 1 || dtTokens.Rows[i + 1]["Lexema"].ToString().ToLower().Trim() != "navori")
                            {
                                listaPosfijo.Add($"Fin_{pilaProcesos.Peek()}");
                                listaPosfijo.Add($"navori{pilaProcesos.Peek()[pilaProcesos.Peek().Length - 1]}");
                                listaPosfijo.Add($"Fin_navori{pilaProcesos.Peek()[pilaProcesos.Peek().Length - 1]}");
                                pilaProcesos.Pop();
                                banderaTipo = string.Empty;
                            }
                            else
                            {
                                listaPosfijo.Add($"Fin_{pilaProcesos.Peek()}");
                                pilaProcesos.Push($"navori{pilaProcesos.Peek()[pilaProcesos.Peek().Length - 1]}");
                            }
                        }
                        else if (pilaProcesos.Count > 0 && pilaProcesos.Peek().ToString().Contains("navori"))
                        {
                            listaPosfijo.Add($"Fin_{pilaProcesos.Pop()}");
                            pilaProcesos.Pop();
                            banderaTipo = string.Empty;
                        }
                    }

                    //Lista Posfijo                
                    else if ((dtTokens.Rows[i]["Estado"].ToString() == "Variable" && declaracionVariable == false) || dtTokens.Rows[i]["Estado"].ToString() == "Número Entero"
                        || dtTokens.Rows[i]["Estado"].ToString() == "Número Decimal" || dtTokens.Rows[i]["Estado"].ToString() == "Cadena"
                        || dtTokens.Rows[i]["Estado"].ToString() == "Boolean" || dtTokens.Rows[i]["Estado"].ToString() == "Console")
                    {
                        if (dtTokens.Rows[i]["Estado"].ToString() == "Variable")
                        {
                            if (ExisteVariable(dtVariables, variable))
                            {
                                if (TipoVariable(dtVariables, variable).Contains("metodo"))
                                {
                                    listaPosfijo.Add("call_" + variable);
                                    banderaTipo = TipoVariable(dtVariables, variable).Replace("metodo", "").TrimStart();
                                }
                                else if (banderaTipo == string.Empty || (banderaTipo == "tear" && pilaProcesos.Peek() != string.Empty))
                                {
                                    banderaTipo = TipoVariable(dtVariables, variable);
                                    //if (banderaTipo == "mercs") comparacionCadenas = true;
                                    listaPosfijo.Add(variable);
                                }
                                else if (banderaTipo == TipoVariable(dtVariables, variable) || (banderaTipo == "tabis" && TipoVariable(dtVariables, variable) == "mobis"))
                                {
                                    listaPosfijo.Add(variable);
                                }
                                else
                                {
                                    listaPosfijo.Add(variable);
                                    ObtenerErrorSemantico(433, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                                }
                            }
                            else
                            {
                                listaPosfijo.Add(variable);
                                ObtenerErrorSemantico(434, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                            }
                        }
                        else if (dtTokens.Rows[i]["Estado"].ToString() == "Console")
                        {
                            consoleLine = true;
                        }
                        else
                        {
                            if (banderaTipo == "tear" && pilaProcesos.Peek() != string.Empty)
                            {
                                listaPosfijo.Add(variable);
                                banderaTipo = Tipos[dtTokens.Rows[i]["Estado"].ToString()];
                                if (banderaTipo == "mercs") comparacionCadenas = true;
                            }
                            else if (banderaTipo == Tipos[dtTokens.Rows[i]["Estado"].ToString()] || (banderaTipo == "tabis" && Tipos[dtTokens.Rows[i]["Estado"].ToString()] == "mobis"))
                            {
                                listaPosfijo.Add(variable);
                            }
                            else if (banderaTipo == string.Empty) listaPosfijo.Add(variable);
                            else
                            {
                                listaPosfijo.Add(variable);
                                ObtenerErrorSemantico(433, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                            }
                        }
                    }
                    else if (consoleLine == true)
                    {
                        if (variable == "codex" || variable == "proto")
                        {
                            listaPosfijo.Add(variable);
                            if (asignacionRead && variable == "proto") listaPosfijo.Add(pila.Pop());
                        }
                    }
                    else if (variable == "collector")
                    {
                        if (dtTokens.Rows[i + 1]["Estado"].ToString() == "Variable" && banderaMetodo != TipoVariable(dtVariables, dtTokens.Rows[i + 1]["Lexema"].ToString()))
                            ObtenerErrorSemantico(433, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                        else if (banderaMetodo == string.Empty)
                            ObtenerErrorSemantico(437, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);                    
                        else if (dtTokens.Rows[i + 1]["Estado"].ToString() != "Variable" && banderaMetodo != Tipos[dtTokens.Rows[i + 1]["Estado"].ToString()])
                            ObtenerErrorSemantico(433, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                        listaPosfijo.Add(variable);
                        banderaMetodo = string.Empty;
                    }
                    if (prioridades.ContainsKey(variable) && declaracionVariable == false)
                    {
                        if (variable == "(") { pila.Push(variable); }
                        else if (variable == ")")
                        {
                            while (pila.Peek() != "(")
                            {
                                listaPosfijo.Add(pila.Pop().ToString());
                            }
                            pila.Pop();
                        }
                        else
                        {
                            while (pila.Count > 0 && prioridades[variable] <= prioridades[pila.Peek()])
                            {
                                listaPosfijo.Add(pila.Pop().ToString());
                            }
                            if (variable == "/" && banderaTipo == "mobis")
                                ObtenerErrorSemantico(435, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                            if(comparacionCadenas == true && (variable != "==" && variable != "!=")) 
                                ObtenerErrorSemantico(436, Convert.ToInt32(dtTokens.Rows[i]["Linea"]), dtErrores, 0);
                            pila.Push(variable);
                        }
                    }
                    else if (variable == ";")
                    {
                        while (pila.Count > 0)
                        {
                            listaPosfijo.Add(pila.Pop().ToString());
                        }
                        banderaTipo = string.Empty;
                        comparacionCadenas = false;
                        consoleLine = false;
                    }
                }
                #endregion
            }//Fin for principal
            if (ContadorLlaves > 0)
            {
                ObtenerError(421, dtTokens.Rows.Count - 1, dtErrores, ContadorLlaves);
            }
            else if (ContadorLlaves < 0)
            {
                ContadorLlaves = ContadorLlaves * -1;
                ObtenerError(422, dtTokens.Rows.Count - 1, dtErrores, ContadorLlaves);
            }
        }
        public void ObtenerErrorSemantico(int token, int linea, DataTable dt, int contadorLlaves)
        {
            switch (token)
            {
                case 432:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"La variable ya estaba declarada", "Semantico");
                    break;
                case 433:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Los tipos de datos no coinciden", "Semantico");
                    break;
                case 434:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"La variable no esta declarada", "Semantico");
                    break;
                case 435:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"No se puede realizar division entre enteros", "Semantico");
                    break;
                case 436:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Operador logico invalido para cadenas", "Semantico");
                    break;
                case 437:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Return invalido, metodo void", "Semantico");
                    break;
                case 438:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"El metodo no retorna un valor ", "Semantico");
                    break;
            }
        }
        public void ObtenerError(int token, int linea, DataTable dt, int contadorLlaves)
        {
            switch (token)
            {
                case 400:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un (", "Sintactico");
                    break;
                case 401:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un valor para la condicion", "Sintactico");
                    break;
                case 402:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un operador aritmetico o logico", "Sintactico");
                    break;
                case 403:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba )", "Sintactico");
                    break;
                case 404:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba {{", "Sintactico");
                    break;
                case 405:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba }}", "Sintactico");
                    break;
                case 406:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un int o un double", "Sintactico");
                    break;
                case 407:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba una variable", "Sintactico");
                    break;
                case 408:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un =", "Sintactico");
                    break;
                case 409:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un valor entero o decimal", "Sintactico");
                    break;
                case 410:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un ;", "Sintactico");
                    break;
                case 411:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un operador logico o de asignacion", "Sintactico");
                    break;
                case 412:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba una variable o un valor numerico", "Sintactico");
                    break;
                case 413:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba ++ o --", "Sintactico");
                    break;
                case 414:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un proceso", "Sintactico");
                    break;
                case 415:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Instruccion invalida para empezar un proceso", "Sintactico");
                    break;
                case 416:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Uso prohibido de palabra reservada como varible", "Sintactico");
                    break;
                case 417:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un valor numerico entero", "Sintactico");
                    break;
                case 418:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba una cadena", "Sintactico");
                    break;
                case 419:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un valor booleano", "Sintactico");
                    break;
                case 420:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba una asignacion o un ;", "Sintactico");
                    break;
                case 421:
                    dt.Rows.Add($"Error #{token}", $"---", $"Hay {contadorLlaves} \"{{\" sin cerrar", "Sintactico");
                    break;
                case 422:
                    dt.Rows.Add($"Error #{token}", $"---", $"Hay {contadorLlaves} \"}}\" sin abrir", "Sintactico");
                    break;
                case 423:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un valor para la asignacion", "Sintactico");
                    break;
                case 424:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un .", "Sintactico");
                    break;
                case 425:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Metodo no reconocido", "Sintactico");
                    break;
                case 426:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba una cadena o variable", "Sintactico");
                    break;
                case 427:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"El main no puede ir dentro de un proceso", "Sintactico");
                    break;
                case 428:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"El using no puede ir dentro de un proceso", "Sintactico");
                    break;
                case 429:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Repeticion de operador aritmetico", "Sintactico");
                    break;
                case 430:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un void para el metodo", "Sintactico");
                    break;
                case 431:
                    dt.Rows.Add($"Error #{token}", $"Linea {linea}", $"Se esperaba un argumento para el metodo", "Sintactico");
                    break;
            }
        }
        public int ObtenerColumna(int token)
        {
            int columna = 0;

            switch (token)
            {
                case 902: //entero
                    columna = 0;
                    break;
                case 903: //decimal
                    columna = 1;
                    break;
                case 933: //_
                    columna = 2;
                    break;
                case 905: //+
                    columna = 3;
                    break;
                case 906: //-
                    columna = 4;
                    break;
                case 907: //*
                    columna = 5;
                    break;
                case 908: // /
                    columna = 6;
                    break;
                case 912: // >
                    columna = 7;
                    break;
                case 909: // <
                    columna = 8;
                    break;
                case 913: // =
                    columna = 9;
                    break;
                case 928: // !
                    columna = 10;
                    break;
                case 934: // $
                    columna = 12;
                    break;
                case 917: // \
                    columna = 13;
                    break;
                case 918: // {
                    columna = 14;
                    break;
                case 919: // }
                    columna = 15;
                    break;
                case 922: // [
                    columna = 16;
                    break;
                case 923: // ]
                    columna = 17;
                    break;
                case 920: // (
                    columna = 18;
                    break;
                case 921: // )
                    columna = 19;
                    break;
                case 924: // .
                    columna = 20;
                    break;
                case 926: // ,
                    columna = 21;
                    break;
                case 927: // ;
                    columna = 22;
                    break;
                case 925: // :
                    columna = 23;
                    break;
                case 916: // &
                    columna = 24;
                    break;
                case 931: // &&
                    columna = 29;
                    break;
                case 932: // ||
                    columna = 30;
                    break;
                case 803: // int
                    columna = 31;
                    break;
                case 802: // double
                    columna = 32;
                    break;
                case 804: // string
                    columna = 33;
                    break;
                case 805: // if
                    columna = 34;
                    break;
                case 806: // else
                    columna = 35;
                    break;
                case 827: // else if
                    columna = 36;
                    break;
                case 810: // for
                    columna = 37;
                    break;
                case 809: // while
                    columna = 38;
                    break;                
                case 900: // variable
                    columna = 39;
                    break;
                case 818: // true
                    columna = 40;
                    break;
                case 819: // false
                    columna = 41;
                    break;
                case 901: // cadena
                    columna = 42;
                    break;
                case 910: // <=
                    columna = 43;
                    break;
                case 911: // >=
                    columna = 44;
                    break;
                case 914: // ==
                    columna = 45;
                    break;
                case 915: // !=
                    columna = 46;
                    break;
                case 929: // ++
                    columna = 47;
                    break;
                case 930: // --
                    columna = 48;
                    break;
                case 824: // console
                    columna = 49;
                    break;
                case 813: // metodo: public,
                case 814: // private,
                case 815: // new,
                case 817: // class,
                case 822: // main
                case 823: // static,
                case 826: // system,
                case 825: // program,
                    columna = 50;
                    break;
                case 821: // using
                    columna = 51;
                    break;
                case 828: // writeline
                    columna = 52;
                    break;
                case 816: // void
                    columna = 53;
                    break;
                case 800: // bool
                    columna = 54;
                    break;
                case 829: // read
                    columna = 55;
                    break;
                case 812: // return
                    columna = 56;
                    break;
                case 935: // ^
                    columna = 57;
                    break;
                case '\n':
                    columna = 23;
                    break;
                case '\t':
                case '\0':
                case (char)0x2408:
                    columna = 26;
                    break;
                default:
                    columna = 26;
                    break;
            }
            return columna;
        }

        public bool ExisteVariable(DataTable table, string variable)
        {
            foreach (DataRow row in table.Rows)
            {
                if (row["Variable"].ToString() == variable) return true; //Esta declarada
            }
            return false; //No esta declarada
        }
        public string TipoVariable(DataTable table, string variable)
        {
            foreach (DataRow row in table.Rows)
            {
                if (row["Variable"].ToString() == variable) return row["Tipo"].ToString(); //Esta declarada
            }
            return null; //No esta declarada
        }

        public bool IsConstantExpression(List<string> subExpression)
        {
            foreach (string token in subExpression)
            {
                if (!double.TryParse(token, out _) && token != "+" && token != "-" && token != "*" && token != "/" && token != "(" && token != ")")
                {
                    return false;
                }
            }
            return true;
        }

        public double EvaluateExpression(List<string> subExpression)
        {
            string expression = string.Join(" ", subExpression);
            DataTable table = new DataTable();
            return Convert.ToDouble(table.Compute(expression, string.Empty));
        }
    }
}
`
        },
        {
            name: "clsCodigoIntermedio.cs",
            type: "Esta clase es la encargada de generar el código intermedio a partir del código fuente.",
            language: "csharp",
            content: String.raw`using System;
using System.CodeDom;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Compilador
{
    internal class clsCodigoIntermedio
    {
        public Action<string> imprimir;
        Dictionary<string, string> operadoresLogicos = new Dictionary<string, string>() 
        {
            { "<", "JGE" },
            { "<=", "JG" },
            { ">", "JLE" },
            { ">=", "JL" },
            { "==", "JNE" },
            { "!=", "JE" },            
        };
        Dictionary<string, string> operadoresAritmeticos = new Dictionary<string, string>()
        {
            { "+", "ADD" },
            { "-", "SUB" },
            { "*", "MUL" },
            { "/", "DIV" }
        };
        string asm, asmData, asmCode, var;
        bool AX = false, BX = false;
        bool subRutinaImprimirNumero, subRutinaImprimirCadena, subRutinaLeerInput, subRutinaAsignarCadena, subRutinaConvertStringToNum;
        int msg = 0, num = 0;
        public void GenerarCodigoIntermedio(List<string> listaPosfijo, DataTable dtVariables, DataTable dtTokens, DataTable dtErrores)
        {
            asmData += ".model small\n.stack 100h\n.data\n";
            if (listaPosfijo.Contains("proto"))
            {
                asmData += $"userInput db 50 dup(0), '$'\n";
            }
            for (int i = 0; i < dtVariables.Rows.Count; i++)
            {
                if (dtVariables.Rows[i]["Tipo"].ToString() == "mobis")
                    asmData += dtVariables.Rows[i]["Variable"].ToString() + " dw " +
                        (string.IsNullOrEmpty(dtVariables.Rows[i]["Valor inicial"].ToString()) ? "0" : dtVariables.Rows[i]["Valor inicial"].ToString()) + "\n";
                else if (dtVariables.Rows[i]["Tipo"].ToString() == "tabis")
                {
                    string val = (string.IsNullOrEmpty(dtVariables.Rows[i]["Valor inicial"].ToString()) ? "0" : dtVariables.Rows[i]["Valor inicial"].ToString());
                    asmData += dtVariables.Rows[i]["Variable"].ToString() + " dw " + val + "\n";
                }
                else if (dtVariables.Rows[i]["Tipo"].ToString() == "mercs")
                    asmData += dtVariables.Rows[i]["Variable"].ToString() + " db " + 
                        (string.IsNullOrEmpty(dtVariables.Rows[i]["Valor inicial"].ToString()) ? "\'" : "\'" + dtVariables.Rows[i]["Valor inicial"].ToString()) + "\'\n";
            }

            asmCode += "\n.code\nmain:\nMOV AX, @data\nMOV DS, AX\n\n";
            int indiceTemp = 2, temps = 0; ;
            for (int i = 0; i < listaPosfijo.Count; i++) 
            {
                string variable = listaPosfijo[i].ToString();
                if (operadoresAritmeticos.ContainsKey(variable))
                {
                    /*Fusion de Instrucciones (No se que mas agregar aqui)*/
                    #region
                    if (double.TryParse(listaPosfijo[i - 1], out _) && double.TryParse(listaPosfijo[i - 2], out _))
                    {
                        string resultado;
                        List<string> expresion = new List<string> 
                        {
                            listaPosfijo[i - 2],
                            listaPosfijo[i],
                            listaPosfijo[i - 1]
                        };
                        resultado = EvaluateExpression(expresion).ToString();
                        listaPosfijo[i] = resultado;
                        listaPosfijo.RemoveAt(i - 2);
                        listaPosfijo.RemoveAt(i - 2);
                        i -= 2;
                    }
                    #endregion
                    else
                    {
                        string reg = "";
                        if (variable == "/" && listaPosfijo[i - 1] == "0")
                        {
                            dtErrores.Rows.Add($"Error #{440}", $"Linea {ObtenerLinea(dtTokens)}", $"Division entre 0", "Codigo Intermedio");
                        }
                        if (!AX) { reg = "AX"; AX = true; }
                        else if (!BX) { reg = "BX"; BX = true; }
                        else if (AX && BX) 
                        {
                            indiceTemp++;
                            reg = "temp" + indiceTemp;
                            if(indiceTemp > temps) temps = indiceTemp;
                        }
                        if (variable == "*")
                        {
                            if (listaPosfijo[i - 2] != "AX")
                            {
                                if (ExisteVariable(dtVariables, listaPosfijo[i - 2]) || listaPosfijo[i - 2].ToString().Contains("temp") || listaPosfijo[i - 2] == "BX")
                                    asmCode += $"   MOV AX, {listaPosfijo[i - 2]}\n";
                                else
                                    asmCode += $"   MOV AL, {listaPosfijo[i - 2]}\n";
                            }
                            if (listaPosfijo[i - 1] != "BX")
                                if (ExisteVariable(dtVariables, listaPosfijo[i - 1]) || listaPosfijo[i - 1].ToString().Contains("temp"))
                                    asmCode += $"   MOV BX, {listaPosfijo[i - 1]}\n";
                                else
                                    asmCode += $"   MOV BL, {listaPosfijo[i - 1]}\n";

                            asmCode += $"   MUL BL\n";
                            if (reg != "AX")
                                asmCode += $"   MOV {reg}, AX\n";                            
                        }
                        else if (variable == "/")
                        {
                            if (listaPosfijo[i - 2] != "AX")
                            {
                                if (ExisteVariable(dtVariables, listaPosfijo[i - 2]) || listaPosfijo[i - 2].ToString().Contains("temp") || listaPosfijo[i - 2] == "BX")
                                    asmCode += $"   MOV AX, {listaPosfijo[i - 2]}\n";
                                else
                                    asmCode += $"   MOV AL, {listaPosfijo[i - 2]}\n";
                            }                            
                            if (listaPosfijo[i - 1] != "BX")
                                if (ExisteVariable(dtVariables, listaPosfijo[i - 1]) || listaPosfijo[i - 1].ToString().Contains("temp"))
                                    asmCode += $"   MOV BX, {listaPosfijo[i - 1]}\n";
                                else
                                    asmCode += $"   MOV BL, {listaPosfijo[i - 1]}\n";
                            asmCode += $"   DIV BL\n";
                            if (reg != "AX")
                            {
                                asmCode += $"   MOV {reg}, AX\n"; 
                            }
                        }
                        else
                        {
                            asmCode += $"   MOV {reg}, {listaPosfijo[i - 1]}\n";
                            if (listaPosfijo[i - 1] == "AX") AX = false;
                            if (listaPosfijo[i - 1] == "BX") BX = false;
                            asmCode += $"   {operadoresAritmeticos[listaPosfijo[i]]} {reg}, {listaPosfijo[i - 2]}\n";
                        }
                        if (listaPosfijo[i - 2] == "AX") AX = false;
                        if (listaPosfijo[i - 2] == "BX") BX = false;
                        listaPosfijo.RemoveAt(i - 2);
                        listaPosfijo.RemoveAt(i - 1);
                        i -= 2;
                        listaPosfijo[i] = reg;                   
                    }
                }
                else if (variable == "=")
                {
                    if (listaPosfijo[i - 1] == "proto" && TipoVariable(dtVariables, listaPosfijo[i - 2]) == "mercs")
                    {
                        var = listaPosfijo[i - 2];
                        asmCode += $"   CALL CopyInputToCadena\n";
                        subRutinaAsignarCadena = true;
                    }
                    else if (listaPosfijo[i - 1] == "proto" && TipoVariable(dtVariables, listaPosfijo[i - 2]) != "mercs")
                    {
                        var = listaPosfijo[i - 2];
                        asmCode += $"   CALL StringToNumber\n";
                        asmCode += $"   MOV {var}, AX\n";
                        subRutinaConvertStringToNum = true;
                    }
                    else
                    {
                        string reg = "";
                        if (listaPosfijo[i - 1] == "AX" || listaPosfijo[i - 1] == "BX")
                        {
                            asmCode += $"   MOV {listaPosfijo[i - 2]}, {listaPosfijo[i - 1]}\n";
                            AX = false; BX = false;
                        }
                        else
                        {
                            if (!AX)
                                reg = "AX";
                            else if (!BX)
                                reg = "BX";
                            asmCode += $"   MOV {reg}, {listaPosfijo[i - 1]}\n";
                            asmCode += $"   MOV {listaPosfijo[i - 2]}, {reg}\n";
                        }
                        indiceTemp = 2;
                    }
                }
                else if (variable.StartsWith("ie") || variable.StartsWith("sterak"))
                    asmCode += variable + ":\n";
                else if (operadoresLogicos.ContainsKey(variable))
                {
                    if ((!listaPosfijo[i - 2].Contains("temp") && listaPosfijo[i - 2] != "AX" && listaPosfijo[i - 2] != "BX") ||
                       (!listaPosfijo[i - 1].Contains("temp") && listaPosfijo[i - 1] != "AX" && listaPosfijo[i - 1] != "BX"))
                    {
                        asmCode += $"   MOV AX, {listaPosfijo[i - 1]}\n";
                        asmCode += $"   CMP {listaPosfijo[i - 2]}, AX\n";
                    }
                    else asmCode += "   CMP " + listaPosfijo[i - 2] + ", " + listaPosfijo[i - 1] + "\n";

                }
                else if (variable.StartsWith("Inicio"))
                {
                    if (variable.Contains("ie"))
                        asmCode += operadoresLogicos[listaPosfijo[i - 1]] + " navori" + variable.Substring(variable.Length - 1) + "\n";
                    else if (variable.Contains("sterak"))
                        asmCode += operadoresLogicos[listaPosfijo[i - 1]] + " Fin_sterak" + variable.Substring(variable.Length - 1) + "\n";
                }
                else if (variable.StartsWith("Fin"))
                {
                    if (variable.Contains("ie"))
                        asmCode += "JMP Fin_navori" + variable.Substring(variable.Length - 1) + "\n";
                    else if (variable.Contains("navori"))
                        asmCode += variable + ":\n";
                    else if (variable.Contains("sterak"))
                        asmCode += "JMP sterak" + variable.Substring(variable.Length - 1) + "\n" + variable + ":\n";
                    else if (variable.Contains("flash"))
                        asmCode += $"{variable}:\n";
                    else if (variable.Contains("metodo"))
                        asmCode += "ENDP:\n";
                }
                else if (variable.StartsWith("navori"))
                    asmCode += variable + ":\n";
                else if (variable.Contains("flash"))
                    asmCode += $"{variable}:\n";
                else if (variable.StartsWith("metodo"))
                    asmCode += $"PROC {variable.Replace("metodo", "").TrimStart()}\n";
                else if (variable == "++")
                {
                    asmCode += $"   MOV CX, {listaPosfijo[i - 1]}\n";
                    asmCode += $"   INC CX\n";
                    asmCode += $"   MOV {listaPosfijo[i - 1]}, CX\n";

                }
                else if (variable == "--")
                {
                    asmCode += $"   MOV CX, {listaPosfijo[i - 1]}\n";
                    asmCode += $"   DEC CX\n";
                    asmCode += $"   MOV {listaPosfijo[i - 1]}, CX\n";
                }
                else if (variable == "collector")
                    asmCode += "RET " + listaPosfijo[i + 1] + "\n";
                else if (variable.Contains("call"))
                    asmCode += "CALL " + variable.Replace("call_", "").TrimStart() + "\n";
                else if (variable.Contains("codex"))
                {
                    if (ExisteVariable(dtVariables, listaPosfijo[i + 1]))
                    {
                        if (TipoVariable(dtVariables, listaPosfijo[i + 1]) == "mobis" || TipoVariable(dtVariables, listaPosfijo[i + 1]) == "tabis")
                        {
                            asmCode += $"   MOV AX, {listaPosfijo[i + 1]}\n";
                            asmCode += $"   CALL PrintNumber\n";
                            subRutinaImprimirNumero = true;
                        }
                        else if (TipoVariable(dtVariables, listaPosfijo[i + 1]) == "mercs")
                        {
                            asmCode += $"   LEA DX, {listaPosfijo[i + 1]}\n";
                            asmCode += $"   CALL PrintString\n";
                            asmCode += $"   MOV DL, 13\n";
                            asmCode += $"   MOV AH, 02h\n";
                            asmCode += $"   INT 21h\n";
                            asmCode += $"   MOV DL, 10\n";
                            asmCode += $"   MOV AH, 02h\n";
                            asmCode += $"   INT 21h\n";
                            subRutinaImprimirCadena = true;
                        }
                    }
                    else
                    {
                        if (double.TryParse(listaPosfijo[i + 1], out _))
                        {                           
                            asmCode += $"   MOV AX, {listaPosfijo[i + 1]}\n";
                            asmCode += $"   CALL PrintNumber\n";   
                            subRutinaImprimirNumero = true;
                        }
                        else
                        {
                            msg++;
                            asmData += $"   msg{msg} db \'{listaPosfijo[i + 1]}$\'\n";
                            asmCode += $"   LEA DX, msg{msg}\n";
                            asmCode += $"   CALL PrintString\n";
                            asmCode += $"   MOV DL, 13\n";
                            asmCode += $"   MOV AH, 02h\n";
                            asmCode += $"   INT 21h\n";
                            asmCode += $"   MOV DL, 10\n";
                            asmCode += $"   MOV AH, 02h\n";
                            asmCode += $"   INT 21h\n";
                            subRutinaImprimirCadena = true;
                        }
                    }
                }
                else if (variable.Contains("proto"))
                {                  
                    asmCode += $"   CALL ReadInput\n";
                    asmCode += $"   MOV DL, 13\n";
                    asmCode += $"   MOV AH, 02h\n";
                    asmCode += $"   INT 21h\n";
                    asmCode += $"   MOV DL, 10\n";
                    asmCode += $"   MOV AH, 02h\n";
                    asmCode += $"   INT 21h\n";
                    subRutinaLeerInput = true;
                }
            }
            if (temps > 2)
            {
                for (int i = 3; i <= temps; i++)
                {
                    asmData += $"temp{i} dw 0 \n";
                }
            }
            asmCode += "\n  ; Terminar el programa\n   MOV AX, 4C00h\r\n   INT 21h\n";
            if (subRutinaImprimirNumero)
            {
                asmCode += "\n" + SubRutinaImprimirNumero() + "\n";
            }
            if (subRutinaImprimirCadena)
            {
                asmCode += "\n" + SubRutinaImprimirCadena() + "\n";
            }
            if (subRutinaLeerInput)
            {
                asmCode += "\n" + SubRutinaLeerInput() +"\n";
            }
            if (subRutinaAsignarCadena)
            {
                asmCode += "\n" + SubRutinaAsignarCadena(var) + "\n";
            }
            if (subRutinaConvertStringToNum)
            {
                asmCode += "\n" + SubRutinaConvertStringToNum() + "\n";
            }

            asmCode += "end main\n";

            asm += asmData + asmCode;
            imprimir(asm);
        }
        public string ObtenerLinea(DataTable dt)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (dt.Rows[i]["Lexema"].ToString() == "/" && dt.Rows[i + 1]["Lexema"].ToString() == "0")
                {
                    return dt.Rows[i]["Linea"].ToString();
                }
            }
            return string.Empty;
        }
        public double EvaluateExpression(List<string> subExpression)
        {
            string expression = string.Join(" ", subExpression);
            DataTable table = new DataTable();
            return Convert.ToDouble(table.Compute(expression, string.Empty));
        }

        public bool ExisteVariable(DataTable table, string variable)
        {
            foreach (DataRow row in table.Rows)
            {
                if (row["Variable"].ToString() == variable) return true; //Esta declarada
            }
            return false; //No esta declarada
        }
        public string TipoVariable(DataTable table, string variable)
        {
            foreach (DataRow row in table.Rows)
            {
                if (row["Variable"].ToString() == variable) return row["Tipo"].ToString(); //Esta declarada
            }
            return null; //No esta declarada
        }

        public string SubRutinaImprimirNumero()
        {
            return $"; Subrutina para imprimir un numero" +
                $"\r\nPrintNumber PROC" +
                $"\r\n    PUSH AX" +
                $"\r\n    PUSH BX" +
                $"\r\n    PUSH CX" +
                $"\r\n    PUSH DX" +
                $"\r\n" +
                $"\r\n    MOV CX, 0" +
                $"\r\n    MOV BX, 10" +
                $"\r\n" +
                $"\r\nConvertLoop:" +
                $"\r\n    XOR DX, DX" +
                $"\r\n    DIV BX" +
                $"\r\n    ADD DL, '0'" +
                $"\r\n    PUSH DX" +
                $"\r\n    INC CX" +
                $"\r\n    OR AX, AX" +
                $"\r\n    JNZ ConvertLoop" +
                $"\r\n" +
                $"\r\nPrintLoop:" +
                $"\r\n    POP DX" +
                $"\r\n    MOV AH, 02h" +
                $"\r\n    INT 21h" +
                $"\r\n    LOOP PrintLoop" +
                $"\r\n" +
                $"\r\n    ; Imprimir nueva linea" +
                $"\r\n    MOV DL, 13" +
                $"\r\n    MOV AH, 02h" +
                $"\r\n    INT 21h" +
                $"\r\n    MOV DL, 10" +
                $"\r\n    MOV AH, 02h" +
                $"\r\n    INT 21h" +
                $"\r\n" +
                $"\r\n    POP DX" +
                $"\r\n    POP CX" +
                $"\r\n    POP BX" +
                $"\r\n    POP AX" +
                $"\r\n    RET" +
                $"\r\nPrintNumber ENDP\n";
        }
        public string SubRutinaImprimirCadena()
        {
            return $";Subrutina para imprimir en pantalla" +
                $"\r\nPrintString PROC" +
                $"\r\n  MOV AH, 09h" +
                $"\r\n  INT 21h" +
                $"\r\n  RET" +
                $"\r\nPrintString ENDP\n";
        }
        public string SubRutinaLeerInput()
        {
            return $"; Subrutina para leer una cadena" +
                $"\r\nReadInput PROC" +
                $"\r\n    LEA DI, userInput + 1" +
                $"\r\nRead:" +
                $"\r\n    MOV AH, 01h" +
                $"\r\n    INT 21h" +
                $"\r\n    CMP AL, 0Dh" +
                $"\r\n    JE endRead" +
                $"\r\n    MOV [di], al" +
                $"\r\n    INC DI" +
                $"\r\n    JMP Read" +
                $"\r\n" +
                $"\r\nendRead:" +
                $"\r\n    MOV byte ptr [DI], '$'" +
                $"\r\n    RET" +
                $"\r\nReadInput ENDP\n";
        }
        public string SubRutinaAsignarCadena(string var)
        {
            return $"; Subrutina para copiar de userInput a cadena" +
                $"\r\nCopyInputToCadena PROC" +
                $"\r\n    LEA SI, userInput" +
                $"\r\n    LEA DI, {var}" +
                $"\r\nCopyLoop:\r\n    MOV AL, [SI]" +
                $"\r\n    MOV [DI], AL" +
                $"\r\n    INC SI" +
                $"\r\n    INC DI" +
                $"\r\n    CMP AL, '$'" +
                $"\r\n    JNE CopyLoop" +
                $"\r\n    RET" +
                $"\r\nCopyInputToCadena ENDP\n";
        }
        public string SubRutinaConvertStringToNum()
        {
            return $"; Subrutina para convertir una cadena a número" +
                $"\r\nStringToNumber PROC" +
                $"\r\n    LEA SI, userInput + 1" +
                $"\r\n    MOV AX, 0" +
                $"\r\n    MOV CX, 0" +
                $"\r\nConvertLoopNum:" +
                $"\r\n    MOV BL, [SI]" +
                $"\r\n    CMP BL, '$'" +
                $"\r\n    JE endConvert" +
                $"\r\n    SUB BL, '0'" +
                $"\r\n    MOV DX, AX" +
                $"\r\n    MOV AX, 10" +
                $"\r\n    IMUL DX" +
                $"\r\n    ADD AX, BX" +
                $"\r\n    INC SI" +
                $"\r\n    JMP ConvertLoopNum" +
                $"\r\n" +
                $"\r\nendConvert:" +
                $"\r\n    RET" +
                $"\r\nStringToNumber ENDP";
        }

    }
}
`
        }
      ]
    }
  ];