from nlc_dino_runner.utils.constants import SCREEN_WIDTH
from pygame.sprite import Sprite
import random


class Obstacle(Sprite):

    def __init__(self, image, type):
        self.image = image
        self.type = type
        self.rect = self.image[self.type].get_rect()
        self.rect.x = SCREEN_WIDTH
        self.time = 0
        self.points = 0
        self.game_speed = 15

    def update(self, obstacles, game_speed):
        self.rect.x -= game_speed
        if self.rect.x < -self.rect.width:
            obstacles.pop()
        return self.game_speed

    def draw(self, screen):
        screen.blit(self.image[self.type], self.rect)

