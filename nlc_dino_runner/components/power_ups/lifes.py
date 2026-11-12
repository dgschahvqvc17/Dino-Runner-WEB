from pygame.sprite import Sprite

from nlc_dino_runner.utils.constants import HEART


class Life(Sprite):
    def __init__(self):
        self.image = HEART
        self.rect = self.image.get_rect()
        self.rect.x = 10
        self.rect.y = 10

    def draw(self, screen):
        screen.blit(self.image, self.rect)
