from nlc_dino_runner.components.power_ups.power_up import PowerUp
from nlc_dino_runner.utils.constants import HAMMER, SCREEN_WIDTH, HAMMER_TYPE


class Hammer(PowerUp):
    def __init__(self):
        self.image = HAMMER
        self.type = HAMMER_TYPE
        super().__init__(self.image, self.type)

    def move(self, game_speed, moving):
        self.rect.x += game_speed + 5

        if self.rect.x > SCREEN_WIDTH:
            self.rect.x = -100
            moving.hammer_moving = False

    def draw(self, screen):
        screen.blit(self.image, self.rect)
