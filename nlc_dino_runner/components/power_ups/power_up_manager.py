import random
import pygame

from nlc_dino_runner.components.power_ups.shield import Shield
from nlc_dino_runner.components.power_ups.hammer_power_up import HammerPowerUp
from nlc_dino_runner.utils.constants import HAMMER, DEFAULT_TYPE, HAMMERS, SHIELD_TYPE, HAMMER_TYPE
from nlc_dino_runner.components.power_ups.hammer import Hammer


class PowerUpManager:
    def __init__(self):
        self.power_ups = []
        self.shield_type = []
        self.when_appears = 0
        self.points = 0
        self.option_numbers = list(range(1, 10))
        self.hammer = Hammer()
        self.hammer_moving = False
        self.hammer_available = HAMMERS

    def reset_power_ups(self, points):
        self.power_ups = []
        self.power_ups_manager = [Shield, Hammer]
        self.points = points
        self.when_appears = random.randint(200, 300) + self.points

    def generate_power_ups(self, points):
        self.points = points
        if len(self.power_ups) == 0:
            if self.when_appears == self.points:
                print("generating powerup")
                self.when_appears = random.randint(self.when_appears + 300, 400 + self.when_appears)
                random.shuffle(self.option_numbers)
                if self.option_numbers[0] <= 4:
                    self.power_ups.append(Shield())
                    self.shield_type.append(self.power_ups[0])
                else:
                    self.power_ups.append(Hammer())
        return self.power_ups, self.shield_type

    def update(self, points, game_speed, player, user_input):
        self.generate_power_ups(points)
        for power_up in self.power_ups:
            power_up.update(15, self.power_ups)
            if player.dino_rect.colliderect(power_up.rect):
                if power_up.type == SHIELD_TYPE:
                    power_up.start_time = pygame.time.get_ticks()
                    player.shield = True
                    player.show_text = True
                    player.type = power_up.type
                    power_up.start_time = pygame.time.get_ticks()
                    time_random = random.randrange(6, 8)
                    player.shield_time_up = power_up.start_time + (time_random * 1000)
                    self.power_ups.remove(power_up)

                elif power_up.type == HAMMER_TYPE:
                    player.hammer = True
                    player.type = power_up.type
                    self.power_ups.remove(power_up)

                else:
                    power_up.start_time = pygame.time.get_ticks()
                    player.shield = True
                    player.show_text = True
                    player.type = power_up.type
                    power_up.start_time = pygame.time.get_ticks()
                    time_random = random.randrange(12, 13)
                    player.shield_time_up = power_up.start_time + (time_random * 1000)
                    self.power_ups.remove(power_up)

        if player.hammer and user_input[pygame.K_SPACE] and not self.hammer_moving:
            self.hammer_available -= 1
            self.hammer_moving = True
            self.hammer.rect.x = player.dino_rect.x
            self.hammer.rect.y = player.dino_rect.y
        if self.hammer_available == 0:
            self.hammer_available = 3
            player.type = DEFAULT_TYPE
            player.hammer = False

        if self.hammer_moving:
            self.hammer.move(20, self)

    def draw(self, screen):
        for power_up in self.power_ups:
            power_up.draw(screen)

        if self.hammer_moving:
            self.hammer.draw(screen)
            