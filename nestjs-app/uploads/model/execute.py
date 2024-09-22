import torch
from dataset import ImageDataset
import sys
from utils import save_checkpoint, load_checkpoint
from torch.utils.data import DataLoader
import torch.nn as nn
import torch.optim as optim
import config
from tqdm import tqdm
from torchvision.utils import save_image
from discriminator_model import Discriminator
from generator_model import Generator
import sys


def execute(dataset, gen_H):
    image = dataset[0]

    with torch.cuda.amp.autocast() if use_amp else torch.enable_grad():
        fake_painting = gen_H(image)
    save_image(fake_painting * 0.5 + 0.5, f"{sys.argv[1]}/result.png")


def main():
    gen_H = Generator(img_channels=3, num_residuals=9).to(config.DEVICE)
    
    load_checkpoint(
        config.CHECKPOINT_GEN_H,
        gen_H,
        opt_gen,
        config.LEARNING_RATE,
    )

    dataset = ImageDataset(
        root_image=sys.argv[1],
        transform=config.transforms,
    )

    execute(dataset, gen_H)

if __name__ == "__main__":
    main()
