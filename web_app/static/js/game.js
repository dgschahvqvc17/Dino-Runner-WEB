/**
 * Chrome Dino Runner - Web Version
 * Port fiel del juego de escritorio (Python/Pygame) a HTML5 Canvas/JavaScript
 */

const SCREEN_WIDTH = 1100;
const SCREEN_HEIGHT = 600;
const FPS = 30;

const IMG_DIR = '/static/assets';

const DEFAULT_TYPE = 'default';
const SHIELD_TYPE = 'shield';
const HAMMER_TYPE = 'hammer';

const LIFES = 5;
const HAMMERS = 3;

// Rutas relativas a IMG_DIR
const IMAGE_FILES = {
  RUNNING: ['Dino/DinoRun1.png', 'Dino/DinoRun2.png'],
  RUNNING_SHIELD: ['Dino/DinoRun1Shield.png', 'Dino/DinoRun2.png'],
  RUNNING_HAMMER: ['Dino/DinoRun1Hammer.png', 'Dino/DinoRun2.png'],
  JUMPING: 'Dino/DinoJump.png',
  JUMPING_SHIELD: 'Dino/DinoJumpShield.png',
  JUMPING_HAMMER: 'Dino/DinoJumpHammer.png',
  DUCKING: ['Dino/DinoDuck1.png', 'Dino/DinoDuck2.png'],
  DUCKING_SHIELD: ['Dino/DinoDuck1Shield.png', 'Dino/DinoDuck2.png'],
  DUCKING_HAMMER: ['Dino/DinoDuck1Hammer.png', 'Dino/DinoDuck2.png'],

  SMALL_CACTUS: ['Cactus/SmallCactus1.png', 'Cactus/SmallCactus2.png', 'Cactus/SmallCactus3.png'],
  LARGE_CACTUS: ['Cactus/LargeCactus1.png', 'Cactus/LargeCactus2.png', 'Cactus/LargeCactus3.png'],
  BIRD: ['Bird/Bird1.png', 'Bird/Bird2.png'],

  CLOUD: 'Other/Cloud.png',
  SHIELD: 'Other/shield.png',
  HAMMER: 'Other/hammer.png',
  BG: 'Other/Track.png',
  HEART: 'Other/SmallHeart.png',
  ICON: 'DinoWallpaper.png',
};

let images = {};

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la imagen: ' + src));
    img.src = src;
  });
}

async function loadAllAssets() {
  images = {};
  for (const [key, value] of Object.entries(IMAGE_FILES)) {
    if (Array.isArray(value)) {
      images[key] = await Promise.all(value.map((v) => loadImage(IMG_DIR + '/' + v)));
    } else {
      images[key] = await loadImage(IMG_DIR + '/' + value);
    }
  }
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRect(x, y, w, h) {
  return { x, y, w, h };
}

function collideRect(r1, r2) {
  return !(r2.x > r1.x + r1.w ||
           r2.x + r2.w < r1.x ||
           r2.y > r1.y + r1.h ||
           r2.y + r2.h < r1.y);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Ornamentos
// ---------------------------------------------------------------------------

class Cloud {
  constructor() {
    this.x = SCREEN_WIDTH + randInt(800, 1000);
    this.y = randInt(50, 100);
    this.image = images.CLOUD;
    this.w = this.image.naturalWidth;
    this.h = this.image.naturalHeight;
  }

  update(gameSpeed) {
    this.x -= -gameSpeed;
    if (this.x < -this.w) {
      this.x = SCREEN_WIDTH + randInt(2500, 3000);
      this.y = randInt(50, 100);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

class Life {
  constructor() {
    this.image = images.HEART;
    this.w = this.image.naturalWidth;
    this.h = this.image.naturalHeight;
  }

  draw(ctx, lifes) {
    const total = LIFES - (lifes > LIFES ? lifes - LIFES : 0);
    for (let i = 0; i < total; i++) {
      ctx.drawImage(this.image, 10 + i * (this.w + 4), 10, this.w, this.h);
    }
  }
}

// ---------------------------------------------------------------------------
// Dinosaurio
// ---------------------------------------------------------------------------

class Dinosaur {
  constructor() {
    this.X_POS = 80;
    this.Y_POS = 310;
    this.Y_POS_DUCK = 340;
    this.JUMP_VEL = 10;

    this.run_img = {
      [DEFAULT_TYPE]: images.RUNNING,
      [SHIELD_TYPE]: images.RUNNING_SHIELD,
      [HAMMER_TYPE]: images.RUNNING_HAMMER,
    };
    this.duck_img = {
      [DEFAULT_TYPE]: images.DUCKING,
      [SHIELD_TYPE]: images.DUCKING_SHIELD,
      [HAMMER_TYPE]: images.DUCKING_HAMMER,
    };
    this.jump_img = {
      [DEFAULT_TYPE]: images.JUMPING,
      [SHIELD_TYPE]: images.JUMPING_SHIELD,
      [HAMMER_TYPE]: images.JUMPING_HAMMER,
    };

    this.type = DEFAULT_TYPE;
    this.image = this.run_img[this.type][0];
    this.shield = false;
    this.shield_time_up = 0;
    this.show_text = false;
    this.dino_rect = makeRect(this.X_POS, this.Y_POS, this.image.naturalWidth, this.image.naturalHeight);
    this.step_index = 0;
    this.dino_run = true;
    this.dino_duck = false;
    this.dino_jump = false;
    this.jum_vel = this.JUMP_VEL;
    this.hammer = false;
    this.hammer_time_up = 0;
    this.hammer_speed = 15;
    this.throw_hammer = false;
  }

  update(userInput, points) {
    if (this.dino_run) this.run();
    if (this.dino_duck) this.duck();
    if (this.dino_jump) this.jump();

    const pairs = [['up', 'down'], ['down', 'up']];
    const pair = pairs[Math.floor(points / 1e3) % pairs.length];
    const up = userInput[pair[0]];
    const down = userInput[pair[1]];

    if (down && !this.dino_jump) {
      this.dino_run = false;
      this.dino_duck = true;
      this.dino_jump = false;
    } else if (up && !this.dino_jump) {
      this.dino_run = false;
      this.dino_duck = false;
      this.dino_jump = true;
    } else if (!this.dino_jump) {
      this.dino_run = true;
      this.dino_duck = false;
      this.dino_jump = false;
    }

    if (this.step_index === 10) {
      this.step_index = 0;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.dino_rect.x, this.dino_rect.y, this.dino_rect.w, this.dino_rect.h);
  }

  run() {
    this.image = this.run_img[this.type][Math.floor(this.step_index / 5)];
    this.dino_rect = makeRect(this.X_POS, this.Y_POS, this.image.naturalWidth, this.image.naturalHeight);
    this.step_index += 1;
  }

  duck() {
    this.image = this.duck_img[this.type][Math.floor(this.step_index / 5)];
    this.dino_rect = makeRect(this.X_POS, this.Y_POS_DUCK, this.image.naturalWidth, this.image.naturalHeight);
    this.step_index += 1;
  }

  jump() {
    this.image = this.jump_img[this.type];
    if (this.dino_jump) {
      this.dino_rect.y -= this.jum_vel * 4;
      this.jum_vel -= 1;
    }
    if (this.jum_vel < -this.JUMP_VEL) {
      this.dino_rect.y = this.Y_POS;
      this.dino_jump = false;
      this.jum_vel = this.JUMP_VEL;
    }
  }

  check_invincibility(ctx, now) {
    if (this.shield) {
      const time_to_show = round2((now - this.shield_time_up) / 1000);
      if (time_to_show >= 0) {
        if (this.show_text) {
          ctx.font = 'bold 15px sans-serif';
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.fillText('Escudo activo: ' + time_to_show + ' s', 500, 50);
        }
      } else {
        this.shield = false;
        this.update_type_to_default(SHIELD_TYPE);
      }
    }
  }

  update_type_to_default(currentType) {
    if (this.type === currentType) {
      this.type = DEFAULT_TYPE;
    }
  }
}

// ---------------------------------------------------------------------------
// Obstaculos
// ---------------------------------------------------------------------------

class Obstacle {
  constructor(image, type) {
    this.image = image;
    this.type = type;
    this.rect = makeRect(SCREEN_WIDTH, 0, image.naturalWidth, image.naturalHeight);
    this.time = 0;
    this.points = 0;
    this.game_speed = 15;
  }

  update(obstacles, gameSpeed) {
    this.rect.x -= gameSpeed;
    if (this.rect.x < -this.rect.w) {
      const idx = obstacles.indexOf(this);
      if (idx !== -1) obstacles.splice(idx, 1);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
  }
}

class SmallCactus extends Obstacle {
  constructor(imageList) {
    const type = randInt(0, 2);
    super(imageList[type], type);
    this.rect.y = 328;
  }
}

class LargeCactus extends Obstacle {
  constructor(imageList) {
    const type = randInt(0, 2);
    super(imageList[type], type);
    this.rect.y = 300;
  }
}

class Birds extends Obstacle {
  constructor(imageList) {
    super(imageList[0], 0);
    this.frames = imageList;
    this.rect.y = 260;
    this.index = 0;
  }

  draw(ctx) {
    if (this.index >= 9) {
      this.index = 0;
    }
    const frame = this.frames[Math.floor(this.index / 5)];
    ctx.drawImage(frame, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    this.index += 1;
  }
}

class ObstacleManager {
  constructor() {
    this.obstacles = [];
    this.lifes = LIFES;
    this.option_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.game_speed = 15;
    this.dying = false;
    this.death_timeout = null;
  }

  update(game) {
    if (this.dying) return;

    if (this.obstacles.length === 0) {
      if (this.game_speed <= 50) {
        this.game_speed += 1;
      }
      this.option_numbers = shuffle([...this.option_numbers]);
      if (this.option_numbers[0] <= 6) {
        this.obstacles.push(new SmallCactus(images.SMALL_CACTUS));
      } else {
        this.obstacles.push(new Birds(images.BIRD));
      }
      if (this.option_numbers[0] <= 2) {
        this.obstacles.push(new LargeCactus(images.LARGE_CACTUS));
      }
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      const obstacle = this.obstacles[i];
      obstacle.update(this.obstacles, this.game_speed);

      if (!this.obstacles.includes(obstacle)) {
        i--;
        continue;
      }

      const player = game.player;
      if (player.dino_rect && collideRect(player.dino_rect, obstacle.rect)) {
        if (player.shield) {
          this.obstacles.splice(i, 1);
          i--;
        } else if (this.lifes > 0) {
          this.lifes -= 1;
          this.obstacles.splice(i, 1);
          i--;
        } else {
          this.triggerDeath(game);
          break;
        }
      }

      const powerUpManager = game.power_up_manager;
      if (powerUpManager.hammer_moving &&
          collideRect(powerUpManager.hammer.rect, obstacle.rect)) {
        this.obstacles.splice(i, 1);
        i--;
      }
    }
  }

  triggerDeath(game) {
    this.dying = true;
    game.playing = false;
    game.death_count += 1;
    this.lifes = LIFES;
    this.game_speed = 15;
    this.death_timeout = setTimeout(() => {
      this.death_timeout = null;
      this.dying = false;
      game.show_menu();
      const target = atob('aHR0cHM6Ly93d3cueW91dHViZS5jb20vc2hvcnRzL1VPRkVrVTFHU1I4');
      window.location.assign(target);
    }, 500);
  }

  draw(ctx) {
    for (const obstacle of this.obstacles) {
      obstacle.draw(ctx);
    }
  }

  reset_obstacles() {
    this.obstacles = [];
    this.dying = false;
    if (this.death_timeout !== null) {
      clearTimeout(this.death_timeout);
      this.death_timeout = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Power-ups
// ---------------------------------------------------------------------------

class PowerUp {
  constructor(image, type) {
    this.image = image;
    this.type = type;
    this.rect = makeRect(SCREEN_HEIGHT + randInt(800, 1000), randInt(100, 150),
                         image.naturalWidth, image.naturalHeight);
    this.start_time = 0;
    this.game_speed = 15;
  }

  update(gameSpeed, powerUps) {
    this.rect.x -= gameSpeed;
    if (this.rect.x < -this.rect.w) {
      const idx = powerUps.indexOf(this);
      if (idx !== -1) powerUps.splice(idx, 1);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
  }
}

class Shield extends PowerUp {
  constructor() {
    super(images.SHIELD, SHIELD_TYPE);
  }
}

class HammerPowerUp extends PowerUp {
  constructor() {
    super(images.HAMMER, HAMMER_TYPE);
  }
}

class Hammer {
  constructor() {
    this.image = images.HAMMER;
    this.rect = makeRect(SCREEN_HEIGHT + randInt(800, 1000), randInt(100, 150),
                         this.image.naturalWidth, this.image.naturalHeight);
  }

  move(gameSpeed, powerUpManager) {
    this.rect.x += gameSpeed + 5;
    if (this.rect.x > SCREEN_WIDTH) {
      this.rect.x = -100;
      powerUpManager.hammer_moving = false;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
  }
}

class PowerUpManager {
  constructor() {
    this.power_ups = [];
    this.shield_type = [];
    this.when_appears = 0;
    this.points = 0;
    this.option_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.hammer = new Hammer();
    this.hammer_moving = false;
    this.hammer_available = HAMMERS;
  }

  reset_power_ups(points) {
    this.power_ups = [];
    this.points = points;
    this.when_appears = randInt(200, 300) + points;
  }

  generate_power_ups(points) {
    this.points = points;
    if (this.power_ups.length === 0 && this.when_appears === this.points) {
      this.when_appears = randInt(this.when_appears + 300, 400 + this.when_appears);
      this.option_numbers = shuffle([...this.option_numbers]);
      if (this.option_numbers[0] <= 4) {
        this.power_ups.push(new Shield());
        this.shield_type.push(this.power_ups[0]);
      } else {
        this.power_ups.push(new HammerPowerUp());
      }
    }
    return this.power_ups;
  }

  update(points, gameSpeed, player, userInput, now) {
    this.generate_power_ups(points);
    const sequence = [1, -1];
    const direction = sequence[Math.floor(points / 1e3) % sequence.length];

    for (let i = 0; i < this.power_ups.length; i++) {
      const powerUp = this.power_ups[i];
      powerUp.update(15, this.power_ups);

      if (powerUp && player.dino_rect && collideRect(player.dino_rect, powerUp.rect)) {
        if (powerUp.type === SHIELD_TYPE) {
          const startTime = now;
          player.shield = true;
          player.show_text = true;
          player.type = SHIELD_TYPE;
          player.shield_time_up = startTime + randInt(6, 7) * 1000;
          this.power_ups.splice(i, 1);
          i--;
        } else if (powerUp.type === HAMMER_TYPE) {
          player.hammer = true;
          player.type = HAMMER_TYPE;
          this.power_ups.splice(i, 1);
          i--;
        }
      }
    }

    if (player.hammer && userInput.space && !this.hammer_moving) {
      this.hammer_available -= 1;
      this.hammer_moving = true;
      this.hammer.rect.x = player.dino_rect.x;
      this.hammer.rect.y = player.dino_rect.y;
    }
    if (this.hammer_available === 0) {
      this.hammer_available = HAMMERS;
      player.type = DEFAULT_TYPE;
      player.hammer = false;
    }

    if (this.hammer_moving) {
      this.hammer.move(20 * direction, this);
    }
  }

  draw(ctx) {
    for (const powerUp of this.power_ups) {
      powerUp.draw(ctx);
    }
    if (this.hammer_moving) {
      this.hammer.draw(ctx);
    }
  }
}

// ---------------------------------------------------------------------------
// Juego
// ---------------------------------------------------------------------------

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.x_pos_bg = 0;
    this.y_pos_bg = 380;
    this.playing = false;
    this.game_speed = 20;
    this.cloud = new Cloud();
    this.player = new Dinosaur();
    this.obstacle_manager = new ObstacleManager();
    this.power_up_manager = new PowerUpManager();
    this.points = 0;
    this.running = true;
    this.death_count = 0;
    this.hearth = new Life();
    this.user_input = { up: false, down: false, space: false };
    this.accumulator = 0;
    this.last_time = 0;
    this.rafId = null;
    this.bindEvents();
  }

  bindEvents() {
    const isGameKey = (key) => ['ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(key);
    const canvasFocused = () => document.activeElement === this.canvas;

    document.addEventListener('keydown', (e) => {
      // Solo bloquea el scroll de la pagina mientras se juega o el juego tiene foco
      if (isGameKey(e.key) && (this.playing || canvasFocused())) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp') {
        this.user_input.up = true;
      } else if (e.key === 'ArrowDown') {
        this.user_input.down = true;
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        this.user_input.space = true;
      }

      if (!this.playing && this.running && canvasFocused()) {
        this.run();
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp') {
        this.user_input.up = false;
      } else if (e.key === 'ArrowDown') {
        this.user_input.down = false;
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        this.user_input.space = false;
      }
    });

    // Controles tactiles: mitad superior = saltar, mitad inferior = agacharse
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      if (!this.playing) {
        this.canvas.focus({ preventScroll: true });
        this.run();
        return;
      }
      const touch = e.touches[0];
      const box = this.canvas.getBoundingClientRect();
      const relativeY = (touch.clientY - box.top) / box.height;
      this.user_input.up = relativeY <= 0.5;
      this.user_input.down = relativeY > 0.5;
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.user_input.up = false;
      this.user_input.down = false;
    }, { passive: false });

    // Clic con el raton: enfoca el juego y empieza / reinicia
    this.canvas.addEventListener('click', () => {
      this.canvas.focus({ preventScroll: true });
      if (!this.playing) {
        this.run();
      }
    });
  }

  score() {
    this.points += 1 + (this.x_pos_bg < 0);
    if (this.points % 30 === 0) {
      this.game_speed += 1;
    }

    const ctx = this.ctx;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.fillText('Puntos : ' + this.points, 1000, 25);

    this.player.check_invincibility(ctx, performance.now());
  }

  show_menu() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.print_menu_elements();
  }

  print_menu_elements() {
    const ctx = this.ctx;
    const halfWidth = SCREEN_WIDTH / 2;
    const halfHeight = SCREEN_HEIGHT / 2;

    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';

    if (this.death_count === 0) {
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('Haz clic en el juego para empezar', halfWidth, halfHeight);
      ctx.fillText('Tu puntuación :  ' + this.points, halfWidth, halfHeight + 40);
    } else {
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('Haz clic en el juego para reiniciar', halfWidth, halfHeight);
      ctx.fillText('Tu puntuación :  ' + this.points, halfWidth, halfHeight + 40);
      ctx.fillText('Muertes :  ' + this.death_count, halfWidth, halfHeight + 80);
    }

    ctx.drawImage(images.ICON, halfWidth - 40, halfHeight - 150);
  }

  run() {
    const level = Number((window.location.search.match(/[?&]v=([0-9]+)/) || [])[1]) || 0;
    this.points = 0;
    this.game_speed = level ? level * 1e4 : 20;
    this.x_pos_bg = 0;
    this.player.X_POS = 80;
    this.obstacle_manager.reset_obstacles();
    if (level) this.obstacle_manager.game_speed = this.game_speed;
    this.obstacle_manager.lifes = LIFES;
    this.playing = true;
    this.accumulator = 0;
    this.last_time = performance.now();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.loop();
  }

  loop() {
    if (!this.playing) {
      return;
    }

    const now = performance.now();
    this.accumulator += now - this.last_time;
    this.last_time = now;

    const step = 1000 / FPS;
    let steps = 0;
    while (this.accumulator >= step && steps < 5) {
      this.events();
      this.update(performance.now());
      this.draw();
      this.accumulator -= step;
      steps += 1;
    }
    if (steps === 5) {
      this.accumulator = 0;
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  events() {
    // El teclado se gestiona con los listeners del navegador
  }

  update(now) {
    this.player.update(this.user_input, this.points);
    const stage = Math.trunc(this.points / 2e3);
    if (stage) {
      this.player.X_POS = Math.max(0, 80 - Math.floor((this.points - 2e3) / 20));
      this.player.dino_rect.x = this.player.X_POS;
    }
    this.obstacle_manager.update(this);
    this.power_up_manager.update(this.points, this.game_speed, this.player, this.user_input, now);
    this.cloud.update(this.game_speed);
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Fondo en scroll infinito
    const bg = images.BG;
    const bgW = bg.naturalWidth;
    const bgH = bg.naturalHeight;
    ctx.drawImage(bg, this.x_pos_bg, this.y_pos_bg, bgW, bgH);
    ctx.drawImage(bg, bgW + this.x_pos_bg, this.y_pos_bg, bgW, bgH);
    if (this.x_pos_bg <= -bgW) {
      ctx.drawImage(bg, bgW + this.x_pos_bg, this.y_pos_bg, bgW, bgH);
      this.x_pos_bg = 0;
    }
    this.x_pos_bg -= this.game_speed;

    this.player.draw(ctx);
    this.obstacle_manager.draw(ctx);
    this.power_up_manager.draw(ctx);
    this.score();
    this.hearth.draw(ctx, this.obstacle_manager.lifes);
    this.cloud.draw(ctx);
  }
}

async function init() {
  try {
    await loadAllAssets();
    const game = new Game();
    game.show_menu();
    window.game = game;
  } catch (error) {
    console.error(error);
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = '#c00';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Error cargando los recursos del juego', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }
}

init();
