import pygame

from nlc_dino_runner.utils.constants import RUNNING, DUCKING, JUMPING, DEFAULT_TYPE, DUCKING_SHIELD, SHIELD_TYPE, \
    RUNNING_SHIELD, JUMPING_SHIELD, RUNNING_HAMMER, DUCKING_HAMMER, JUMPING_HAMMER, HAMMER_TYPE
from pygame.sprite import Sprite


class Dinosaur(Sprite):
    X_POS = 80
    Y_POS = 310
    Y_POS_DUCK = 340
    JUMP_VEL = 10

    FONT_STYLE = "freesansbold.ttf"
    black_color = (0, 0, 0)

    def __init__(self):
        # self.image = RUNNING[0]
        self.run_img = {DEFAULT_TYPE: RUNNING, SHIELD_TYPE: RUNNING_SHIELD, HAMMER_TYPE: RUNNING_HAMMER}
        self.duck_img = {DEFAULT_TYPE: DUCKING, SHIELD_TYPE: DUCKING_SHIELD, HAMMER_TYPE: DUCKING_HAMMER}
        self.jump_img = {DEFAULT_TYPE: JUMPING, SHIELD_TYPE: JUMPING_SHIELD, HAMMER_TYPE: JUMPING_HAMMER}
        self.type = DEFAULT_TYPE
        self.image = self.run_img[self.type][0]
        self.shield = False
        self.shield_time_up = 0
        self.show_text = False
        self.dino_rect = self.image.get_rect()
        self.dino_rect.x = self.X_POS
        self.dino_rect.y = self.Y_POS
        self.step_index = 0
        self.dino_run = True
        self.dino_duck = False
        self.dino_jump = False
        self.jum_vel = self.JUMP_VEL
        self.hammer = False
        self.hammer_time_up = 0
        self.hammer_speed = 15
        self.throw_hammer = False

    def update(self, user_input):
        if self.dino_run:
            self.run()
        if self.dino_duck:
            self.duck()
        if self.dino_jump:
            self.jump()

        if user_input[pygame.K_DOWN] and not self.dino_jump:
            self.dino_run = False
            self.dino_duck = True
            self.dino_jump = False
        elif user_input[pygame.K_UP] and not self.dino_jump:
            self.dino_run = False
            self.dino_duck = False
            self.dino_jump = True
        elif not self.dino_jump:
            self.dino_run = True
            self.dino_duck = False
            self.dino_jump = False

        if self.step_index == 10:
            self.step_index = 0

    def draw(self, screen):
        screen.blit(self.image, (self.dino_rect.x, self.dino_rect.y))

    def run(self):
        # self.image = RUNNING[0] if self.step_index < 5 else RUNNING[1]
        self.image = self.run_img[self.type][self.step_index // 5]
        self.dino_rect = self.image.get_rect()
        self.dino_rect.x = self.X_POS
        self.dino_rect.y = self.Y_POS
        self.step_index += 1

    def duck(self):
        # self.image = DUCKING[0] if self.step_index < 5 else DUCKING[1]
        self.image = self.duck_img[self.type][self.step_index // 5]
        self.dino_rect = self.image.get_rect()
        self.dino_rect.x = self.X_POS
        self.dino_rect.y = self.Y_POS_DUCK
        self.step_index += 1

    def jump(self):
        # self.image = JUMPING
        self.image = self.jump_img[self.type]
        if self.dino_jump:
            self.dino_rect.y -= self.jum_vel * 4
            self.jum_vel -= 1
        if self.jum_vel < -self.JUMP_VEL:
            self.dino_rect.y = self.Y_POS
            self.dino_jump = False
            self.jum_vel = self.JUMP_VEL

    def check_invincibility(self, screen):
        if self.shield:
            time_to_show = round((self.shield_time_up - pygame.time.get_ticks()) / 1000, 2)
            if time_to_show >= 0:
                if self.show_text:
                    font = pygame.font.Font(self.FONT_STYLE, 15)
                    text = font.render("Shield enable for {time_to_show}", True, self.black_color)
                    text_rect = text. get_rect()
                    text_rect.center = (500, 50)
                    screen.blit(text, text_rect)
            else:
                self.shield = False
                self.update_type_to_default(SHIELD_TYPE)

    def update_type_to_default(self, current_type):
        if self.type == current_type:
            self.type = DEFAULT_TYPE

    