# 💎 JoyaCards

**JoyaCards** es una aplicación web para crear simulacros de preguntas a partir de un archivo Word.

El usuario carga un archivo `.docx`, el backend lo transforma en un JSON estructurado y el frontend permite realizar un cuestionario interactivo tipo tarjetero, con preguntas y opciones aleatorias.

---


## 🚀 Demo

https://joyacards.vercel.app/



## 🧠 ¿Qué hace la app?

JoyaCards permite:

- Cargar un archivo Word con preguntas y opciones.
- Convertir automáticamente ese Word a JSON.
- Detectar respuestas correctas marcadas con `*`.
- Elegir cuántas preguntas usar en el simulacro.
- Mostrar preguntas en orden aleatorio.
- Mostrar opciones en orden aleatorio.
- Verificar si la respuesta seleccionada es correcta.
- Soportar una o varias respuestas correctas.
- Mostrar contador de tiempo.
- Mostrar contador de respuestas correctas.
- Mostrar imagen personalizada según acierto o error.

---

## 📄 Formato esperado del Word

El archivo `.docx` debe respetar este formato:

```txt
1. ¿Cuál es la capital de Argentina?
a) Córdoba
b) Buenos Aires *
c) Mendoza
d) Rosario
```

La respuesta correcta se marca colocando un asterisco `*` al final de la opción.

Ejemplo con múltiples respuestas correctas:

```txt
2. ¿Cuáles son lenguajes de programación?
a) JavaScript *
b) HTML
c) Python *
d) PostgreSQL
```

---

## 🧩 Ejemplo de JSON generado

A partir del Word, el backend genera una estructura como esta:

```json
[
  {
    "question": "¿Cuál es la capital de Argentina?",
    "options": [
      {
        "letter": "A",
        "text": "Córdoba"
      },
      {
        "letter": "B",
        "text": "Buenos Aires"
      },
      {
        "letter": "C",
        "text": "Mendoza"
      },
      {
        "letter": "D",
        "text": "Rosario"
      }
    ],
    "answers": ["B"]
  }
]
```

---

## 🛠️ Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- Multer
- Mammoth
- CORS

---

## 📁 Estructura del proyecto

```txt
joyacards/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   └── word.routes.js
│   │   └── services/
│   │       └── wordToJson.service.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── simulacroparajoyas.png
│   │   ├── joya.jpg
│   │   └── joyita.jpg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/facundogalindo/joyacards.git
cd joyacards
```

---

## 🔧 Backend

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Ejecutar backend en desarrollo

```bash
npm run dev
```

El backend corre por defecto en:

```txt
http://localhost:3001
```

Health check:

```txt
http://localhost:3001/health
```

---

## 🎨 Frontend

### 4. Instalar dependencias del frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
cd frontend
npm install
```

### 5. Crear archivo de variables de entorno

Dentro de la carpeta `frontend`, crear un archivo `.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 6. Ejecutar frontend en desarrollo

```bash
npm run dev
```

El frontend corre por defecto en:

```txt
http://localhost:5173
```

---

## 📡 Endpoint principal

### Convertir Word a JSON

```http
POST /api/word/to-json
```

El endpoint recibe un archivo `.docx` mediante `form-data`.

Campo esperado:

```txt
file
```

Ejemplo de respuesta:

```json
{
  "total": 1,
  "questions": [
    {
      "question": "¿Cuál es la capital de Argentina?",
      "options": [
        {
          "letter": "A",
          "text": "Córdoba"
        },
        {
          "letter": "B",
          "text": "Buenos Aires"
        },
        {
          "letter": "C",
          "text": "Mendoza"
        },
        {
          "letter": "D",
          "text": "Rosario"
        }
      ],
      "answers": ["B"]
    }
  ]
}
```

---

## 🎮 Flujo de uso

1. El usuario abre la aplicación.
2. Ve una pantalla inicial personalizada.
3. Carga un archivo Word `.docx`.
4. El frontend envía el archivo al backend.
5. El backend convierte el Word a JSON.
6. El usuario elige cuántas preguntas quiere responder.
7. La app muestra las preguntas en orden aleatorio.
8. Las opciones también se muestran en orden aleatorio.
9. El usuario selecciona una o varias respuestas.
10. Debe verificar antes de pasar a la siguiente pregunta.
11. La app muestra si la respuesta fue correcta o incorrecta.
12. Al finalizar, se muestra el total de correctas y el tiempo utilizado.

---

## 🧪 Scripts disponibles

### Backend

```bash
npm run dev
```

Ejecuta el backend en modo desarrollo con `nodemon`.

```bash
npm start
```

Ejecuta el backend en modo producción.

### Frontend

```bash
npm run dev
```

Ejecuta el frontend en modo desarrollo.

```bash
npm run build
```

Genera la versión de producción.

```bash
npm run preview
```

Previsualiza la build de producción.

---





## 📌 Estado del proyecto

Proyecto en desarrollo.

Funcionalidades implementadas:

- Carga de archivo Word.
- Conversión de Word a JSON.
- Cuestionario interactivo.
- Verificación de respuestas.
- Aleatorización de preguntas.
- Aleatorización de opciones.
- Contador de tiempo.
- Contador de respuestas correctas.
- Pantalla inicial personalizada.
- Imágenes para respuestas correctas e incorrectas.

---

## 👤 Autor

Desarrollado por [Facundo Galindo](https://github.com/facundogalindo).
