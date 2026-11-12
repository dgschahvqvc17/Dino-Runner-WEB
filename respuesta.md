# Documentación de errores y soluciones

Este documento describe los **9 errores intencionales** de la versión `errores` y cómo corregirlos.

## Resumen

| # | Error | Archivo principal |
|---|-------|-------------------|
| 1 | El dinosaurio retrocede al llegar a 2000 puntos | `web_app/static/js/game.js` |
| 2 | Los controles se invierten al llegar a 1000 puntos | `web_app/static/js/game.js` |
| 3 | Al morir redirige a YouTube | `web_app/static/js/game.js` |
| 4 | “Cómo jugar” recarga la página y pone la velocidad en 20000 | `web_app/templates/index.html` y `game.js` |
| 5 | Los puntos suben de 2 en 2 | `web_app/static/js/game.js` |
| 6 | Las nubes se mueven al revés | `web_app/static/js/game.js` |
| 7 | El escudo no protege (se desactiva al instante) | `web_app/static/js/game.js` |
| 8 | El botón “Jugar” cierra la pestaña y abre 6 ventanas | `web_app/templates/index.html` |
| 9 | Los corazones siempre muestran 5 vidas | `web_app/static/js/game.js` |

---

## Error 1 — El dinosaurio retrocede a los 2000 puntos

**Archivo:** `web_app/static/js/game.js`  
**Método:** `Game.update()`

**Código con error:**

```js
const stage = Math.trunc(this.points / 2e3);
if (stage) {
  this.player.X_POS = Math.max(0, 80 - Math.floor((this.points - 2e3) / 20));
  this.player.dino_rect.x = this.player.X_POS;
}
```

**Causa:** al superar los 2000 puntos se reduce `X_POS`, que es la posición horizontal base del dinosaurio.

**Efecto:** el dinosaurio empieza a moverse hacia la izquierda hasta salir de la pantalla.

**Solución:** eliminar ese bloque. La posición del dinosaurio debe mantenerse fija en `X_POS = 80`.

**Código corregido:**

```js
update(now) {
  this.player.update(this.user_input, this.points);
  this.obstacle_manager.update(this);
  this.power_up_manager.update(this.points, this.game_speed, this.player, this.user_input, now);
  this.cloud.update(this.game_speed);
}
```

---

## Error 2 — Los controles se invierten a los 1000 puntos

**Archivo:** `web_app/static/js/game.js`  
**Métodos:** `Dinosaur.update()` y `PowerUpManager.update()`

### 2.1 Salto y agacharse

**Código con error:**

```js
const pairs = [['up', 'down'], ['down', 'up']];
const pair = pairs[Math.floor(points / 1e3) % pairs.length];
const up = userInput[pair[0]];
const down = userInput[pair[1]];
```

**Causa:** a partir de 1000 puntos se selecciona el par invertido de controles.

**Efecto:** la flecha arriba hace que el dinosaurio se agache y la flecha abajo lo hace saltar.

**Solución:** usar siempre los controles normales.

**Código corregido:**

```js
const up = userInput.up;
const down = userInput.down;
```

### 2.2 Martillo

**Código con error:**

```js
const sequence = [1, -1];
const direction = sequence[Math.floor(points / 1e3) % sequence.length];

if (this.hammer_moving) {
  this.hammer.move(20 * direction, this);
}
```

**Causa:** a partir de 1000 puntos la dirección del martillo pasa a ser negativa.

**Efecto:** el martillo sale hacia atrás y no destruye los obstáculos que vienen de frente.

**Solución:** usar siempre la dirección positiva.

**Código corregido:**

```js
if (this.hammer_moving) {
  this.hammer.move(20, this);
}
```

---

## Error 3 — Al morir redirige a YouTube

**Archivo:** `web_app/static/js/game.js`  
**Método:** `ObstacleManager.triggerDeath()`

**Código con error:**

```js
const target = atob('aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL1VPRkVrVTFHU1I4');
window.location.assign(target);
```

**Causa:** el texto en Base64 se decodifica a una URL externa y se abre al terminar la partida.

**Efecto:** al perder las 5 vidas, el navegador abandona el juego y abre un video de YouTube.

**Solución:** eliminar esas dos líneas y dejar solamente el regreso al menú.

**Código corregido:**

```js
this.death_timeout = setTimeout(() => {
  this.death_timeout = null;
  this.dying = false;
  game.show_menu();
}, 500);
```

**URL que estaba oculta:** `https://www.youtube.com/shorts/UOFEkU1GSR8`

---

## Error 4 — “Cómo jugar” recarga la página y pone la velocidad en 20000

**Archivos:** `web_app/templates/index.html` y `web_app/static/js/game.js`

### 4.1 Botón de la landing

**Código con error:**

```html
<a class="btn btn-ghost" href="?v=2">Cómo jugar</a>
```

**Causa:** el enlace no apunta a la sección `#como-jugar`; navega a la misma página con el parámetro `v=2`, lo que provoca una recarga.

**Solución:** apuntar correctamente a la sección.

**Código corregido:**

```html
<a class="btn btn-ghost" href="#como-jugar">Cómo jugar</a>
```

### 4.2 Velocidad al iniciar

**Código con error:**

```js
const level = Number((window.location.search.match(/[?&]v=([0-9]+)/) || [])[1]) || 0;
this.points = 0;
this.game_speed = level ? level * 1e4 : 20;
this.x_pos_bg = 0;
this.player.X_POS = 80;
this.obstacle_manager.reset_obstacles();
if (level) this.obstacle_manager.game_speed = this.game_speed;
this.obstacle_manager.lifes = LIFES;
```

**Causa:** si la URL contiene `v=2`, la velocidad se multiplica por `10000`, es decir, pasa a 20000.

**Efecto:** el fondo y los obstáculos se mueven a una velocidad imposible.

**Solución:** quitar la lectura del parámetro y restaurar la velocidad inicial normal.

**Código corregido:**

```js
this.points = 0;
this.game_speed = 20;
this.x_pos_bg = 0;
this.player.X_POS = 80;
this.obstacle_manager.reset_obstacles();
this.obstacle_manager.lifes = LIFES;
```

---

## Error 5 — Los puntos suben de 2 en 2

**Archivo:** `web_app/static/js/game.js`  
**Método:** `Game.score()`

**Código con error:**

```js
this.points += 1 + (this.x_pos_bg < 0);
```

**Causa:** el fondo suele estar en una posición negativa, así que la condición suma 1 adicional en cada fotograma.

**Efecto:** el contador avanza al doble de velocidad y los umbrales de 1000/2000 puntos se alcanzan antes.

**Solución:** sumar siempre 1.

**Código corregido:**

```js
this.points += 1;
```

---

## Error 6 — Las nubes se mueven al revés

**Archivo:** `web_app/static/js/game.js`  
**Método:** `Cloud.update()`

**Código con error:**

```js
this.x -= -gameSpeed;
```

**Causa:** la doble negación convierte la resta en una suma.

**Efecto:** las nubes se desplazan hacia la derecha y no vuelven a aparecer.

**Solución:** restar la velocidad directamente.

**Código corregido:**

```js
this.x -= gameSpeed;
```

---

## Error 7 — El escudo no protege

**Archivo:** `web_app/static/js/game.js`  
**Método:** `Dinosaur.check_invincibility()`

**Código con error:**

```js
const time_to_show = round2((now - this.shield_time_up) / 1000);
if (time_to_show >= 0) {
```

**Causa:** la resta está invertida. `shield_time_up` está en el futuro, por lo que `now - shield_time_up` da un número negativo.

**Efecto:** el escudo se desactiva inmediatamente y no protege de ningún obstáculo.

**Solución:** calcular el tiempo restante como `shield_time_up - now`.

**Código corregido:**

```js
const time_to_show = round2((this.shield_time_up - now) / 1000);
if (time_to_show >= 0) {
```

La activación del escudo en `PowerUpManager.update()` ya es correcta:

```js
player.shield_time_up = startTime + randInt(6, 7) * 1000;
```

---

## Error 8 — El botón “Jugar” cierra la pestaña y abre 6 ventanas

**Archivo:** `web_app/templates/index.html`

### 8.1 Atributo del botón

**Código con error:**

```html
<button class="btn btn-primary btn-sm" type="button" data-plays>▶ Jugar</button>
```

**Causa:** el atributo `data-plays` no coincide con el selector `[data-play]`, así que el botón no inicia el juego y además se usa como disparador del comportamiento inesperado.

**Solución:** usar el atributo correcto.

**Código corregido:**

```html
<button class="btn btn-primary btn-sm" type="button" data-play>▶ Jugar</button>
```

### 8.2 Código que abre las ventanas

**Código con error:**

```js
var playButtons = document.querySelectorAll('[data-play], [data-plays]');

playButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    if (button.hasAttribute('data-plays')) {
      for (var i = 0; i < 6; i++) {
        window.open('about:blank', '_blank');
      }
      window.close();
      return;
    }

    var card = document.getElementById('juego');
    if (card && card.scrollIntoView) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    startGame();
  });
});
```

**Causa:** se añadió una rama especial para `data-plays` que abre 6 ventanas e intenta cerrar la pestaña.

**Solución:** eliminar la rama especial y dejar solo el comportamiento normal de los botones de juego.

**Código corregido:**

```js
var playButtons = document.querySelectorAll('[data-play]');

playButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var card = document.getElementById('juego');
    if (card && card.scrollIntoView) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    startGame();
  });
});
```

---

## Error 9 — Los corazones siempre muestran 5 vidas

**Archivo:** `web_app/static/js/game.js`  
**Método:** `Life.draw()`

**Código con error:**

```js
const total = LIFES - (lifes > LIFES ? lifes - LIFES : 0);
for (let i = 0; i < total; i++) {
```

**Causa:** mientras `lifes` esté entre 0 y 5, la expresión siempre devuelve `LIFES` (5).

**Efecto:** aunque el jugador reciba daño, la interfaz sigue mostrando 5 corazones.

**Solución:** dibujar tantos corazones como vidas queden.

**Código corregido:**

```js
for (let i = 0; i < lifes; i++) {
  ctx.drawImage(this.image, 10 + i * (this.w + 4), 10, this.w, this.h);
}
```

---

## Verificación final

Después de aplicar las 9 correcciones:

1. El dinosaurio debe mantenerse en su posición durante toda la partida.
2. Los controles deben funcionar igual antes y después de 1000 puntos.
3. Al morir debe volver al menú, sin abrir YouTube.
4. “Cómo jugar” debe bajar a la sección correspondiente.
5. Los puntos deben subir de 1 en 1.
6. Las nubes deben moverse hacia la izquierda.
7. El escudo debe durar entre 6 y 7 segundos.
8. El botón “Jugar” debe iniciar el juego sin abrir ventanas.
9. Los corazones deben disminuir al recibir daño.
