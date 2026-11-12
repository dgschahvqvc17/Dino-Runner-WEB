# Chrome Dino Runner — Versión Web (landing page)

Esta carpeta contiene la versión **web** del juego (antes de escritorio con Pygame).
La página es una **landing page** con el juego jugable integrado en la sección
principal, además de secciones de cómo jugar, power-ups y estadísticas en vivo.
El juego se ejecuta en el navegador usando **HTML5 Canvas + JavaScript**, y un
servidor **Flask** muy ligero sirve la página y los recursos.

## Requisitos

- Python 3.9 o superior
- Flask (`pip install -r requirements.txt`)

## Cómo ejecutarlo

```bash
cd web_app
pip install -r requirements.txt
python app.py
```

Luego abre en el navegador:

```
http://localhost:5000
```

## Controles

| Acción           | Tecla            |
|------------------|------------------|
| Saltar           | `↑` (flecha arriba) |
| Agacharse        | `↓` (flecha abajo)  |
| Lanzar martillo  | `Espacio`        |
| Empezar/Reiniciar| Clic en el juego o botón **Jugar** |

En pantallas táctiles: toca la mitad superior para saltar y la inferior para agacharte.

## Estructura

```
web_app/
├── app.py                 # Servidor Flask
├── requirements.txt       # Dependencias
├── templates/
│   └── index.html         # Página del juego
└── static/
    ├── js/game.js         # Toda la lógica del juego (port de Pygame)
    └── assets/            # Imágenes del juego original
```

## Diferencias con la versión de escritorio

- La lógica (dinosaurio, obstáculos, power-ups, vidas, puntuación, velocidad,
  fondo con scroll infinito, nubes y corazones) es la misma que en Python.
- El bucle corre a 30 FPS fijos para mantener la misma sensación de juego.
- Se añadieron controles táctiles básicos y mensajes de error si falta algún recurso.
