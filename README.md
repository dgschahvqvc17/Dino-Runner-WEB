# 🦖 NLC Dino Runner — Versión Web

Juego estilo **Chrome Dino** que ahora se ejecuta en el **navegador** como una
**landing page**: el juego está integrado y jugable en la sección principal,
junto a secciones de cómo jugar, power-ups y estadísticas en vivo.
La lógica del juego está hecha con **HTML5 Canvas + JavaScript** y se sirve
con un pequeño servidor **Flask**.

Este documento explica **cómo ejecutar el sistema en web paso a paso**.

---

## 📋 Requisitos

Antes de ejecutar, asegúrate de tener instalado:

| Requisito | Versión recomendada | Cómo comprobarlo |
|-----------|--------------------|------------------|
| Python | 3.9 o superior | `python --version` |
| pip | incluido con Python | `pip --version` |
| Navegador | Chrome, Edge, Firefox... | — |

> El juego funciona sin conexión a internet: todas las imágenes están incluidas
> en la carpeta del proyecto.

---

## 📁 Estructura del proyecto

```
NLC-Dino-Runner-main/
├── README.md                  ← este archivo
├── web_app/                   ← VERSIÓN WEB (la que se ejecuta)
│   ├── app.py                 ← servidor Flask
│   ├── requirements.txt       ← dependencias (flask)
│   ├── run_web.bat            ← lanzador rápido para Windows
│   ├── README.md
│   ├── templates/
│   │   └── index.html         ← página del juego
│   └── static/
│       ├── js/game.js         ← lógica del juego
│       └── assets/            ← imágenes del juego
└── nlc_dino_runner/           ← versión de escritorio original (Pygame)
```

> La carpeta `nlc_dino_runner/` se conserva solo como referencia.
> **No es necesario ejecutarla** para jugar en web.

---

## 🚀 Ejecución paso a paso

### Opción A — Windows (doble clic, la más fácil)

1. Abre la carpeta `web_app`.
2. Haz doble clic en **`run_web.bat`**.
3. La primera vez instalará Flask automáticamente.
4. Cuando aparezca en la consola:

   ```
   Running on http://127.0.0.1:5000
   ```

5. Abre el navegador en: **<http://localhost:5000>**

> Para detener el servidor: cierra la ventana de la consola o pulsa
> `Ctrl + C`.

---

### Opción B — Windows (PowerShell / CMD)

```powershell
cd web_app
pip install -r requirements.txt
python app.py
```

Luego abre **<http://localhost:5000>**.

---

### Opción C — Linux / macOS

```bash
cd web_app
python3 -m pip install -r requirements.txt
python3 app.py
```

Luego abre **<http://localhost:5000>**.

---

### Opción D — Entorno virtual (recomendado si tienes varios proyectos)

**Windows (PowerShell):**

```powershell
cd web_app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

**Linux / macOS:**

```bash
cd web_app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

> Si PowerShell bloquea la activación del entorno virtual, ejecuta una vez:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## 🎮 Controles

| Acción | Tecla |
|--------|-------|
| Saltar | `↑` (flecha arriba) |
| Agacharse | `↓` (flecha abajo) |
| Lanzar martillo | `Espacio` |
| Empezar / reiniciar | Clic en el juego o botón **Jugar** |

**En móvil / pantalla táctil:**

- Toca la **mitad superior** del juego → saltar.
- Toca la **mitad inferior** → agacharse.

---

## ⚙️ Configuración opcional

### Cambiar el puerto

Edita `web_app/app.py` y cambia el valor de `port`:

```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
#                                    ↑ cambia 5000 por el puerto que quieras
```

Luego abre `http://localhost:PUERTO`.

### Jugar desde otro dispositivo (misma red Wi-Fi)

El servidor ya escucha en todas las interfaces (`0.0.0.0`). Al arrancarlo verás
algo como:

```
Running on http://192.168.1.50:5000
```

Abre esa dirección desde el móvil u otro PC conectado a la misma red.
Si no carga, revisa el firewall de Windows y permite a Python en redes privadas.

---

## 🧪 Comprobar que funciona

Al abrir la página deberías ver:

1. La **landing page** con el título **“Corre, salta y sobrevive al desierto”**.
2. Una tarjeta oscura con el **juego** y el mensaje en español
   **“Haz clic en el juego para empezar”**.
3. Estadísticas en vivo (Puntos, Vidas, Muertes) y tu **récord** guardado.
4. Al pulsar **Jugar ahora** o hacer clic en el juego, el dinosaurio empieza a correr.
5. Secciones de **Power-ups** y **Cómo jugar** más abajo.

Si las imágenes aparecen y el dino responde a las teclas, todo está correcto.

> 💡 Las flechas y la barra espaciadora **no bloquean el scroll** de la landing
> hasta que el juego tiene el foco (al hacer clic o pulsar «Jugar»).

---

## 🛠️ Solución de problemas

| Problema | Solución |
|----------|----------|
| `python` no se reconoce como comando | Instala Python desde <https://python.org> y marca **“Add Python to PATH”** |
| `No module named flask` | Ejecuta `pip install -r requirements.txt` dentro de `web_app` |
| `pip` no se reconoce | Prueba `python -m pip install -r requirements.txt` |
| El puerto 5000 está ocupado | Cambia el puerto en `app.py` o cierra el otro programa |
| La página carga pero el juego se ve en blanco | Abre la consola del navegador (`F12`) y revisa errores; verifica que exista `static/assets/` |
| Solo veo texto sin imágenes | Confirma que estás entrando por `http://localhost:5000` y no abriendo `index.html` directamente |
| El navegador muestra “conexión rechazada” | El servidor no está corriendo: vuelve a ejecutar `python app.py` |

> ⚠️ Importante: **no abras `templates/index.html` con doble clic**. El juego debe
> servirse a través de Flask para que las rutas `/static/...` funcionen.

---

## 🕹️ Reglas del juego (resumen)

- Tienes **5 vidas** (corazones arriba a la izquierda).
- Esquiva **cactus** y **pájaros**; cada choque quita una vida.
- Al quedarte sin vidas, se muestra el menú con tu puntuación y el contador de muertes.
- Cada **30 puntos** aumenta la velocidad.
- Power-ups:
  - 🛡️ **Escudo**: invulnerable durante unos segundos.
  - 🔨 **Martillo**: pulsa `Espacio` para lanzarlo y destruir obstáculos (3 usos).

---

## 📌 Detener el servidor

Pulsa `Ctrl + C` en la consola donde se está ejecutando, o cierra la ventana.

---

## 📄 Notas

- La versión de escritorio original con **Pygame** sigue en `nlc_dino_runner/`
  por si quieres comparar, pero la versión oficial actual es la web.
- Todas las imágenes usadas por el juego están en `web_app/static/assets/`.
