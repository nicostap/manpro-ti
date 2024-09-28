import torch
from dataset import ImageDataset
import sys
from utils import load_checkpoint
from torch.utils.data import DataLoader
import torch.nn as nn
import torch.optim as optim
import config
from torchvision.utils import save_image
from generator_model import Generator
from super_image import MsrnModel, ImageLoader
from PIL import Image
import cv2 as cv
import numpy as np


def denoise_image(image_path):
    image = cv.imread(image_path)
    denoised_image = cv.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
    cv.imwrite(image_path, denoised_image)

def execute(loader, gen_H):
    image = next(iter(loader))
    image = image.to(config.DEVICE)
    use_amp = torch.cuda.is_available()
    with torch.cuda.amp.autocast() if use_amp else torch.enable_grad():
        fake_painting = gen_H(image)
    save_image(fake_painting * 0.5 + 0.5, f"{sys.argv[1]}/result.png")
    denoise_image(f"{sys.argv[1]}/result.png")

def main():
    gen_H = Generator(img_channels=3, num_residuals=9).to(config.DEVICE)
    load_checkpoint(f"{sys.argv[2]}.tar", gen_H)

    dataset = ImageDataset(root_image=sys.argv[1], transform=config.transforms)
    dataloader = DataLoader(dataset, batch_size=1, shuffle=False)

    execute(dataloader, gen_H)

    image = Image.open(f"{sys.argv[1]}/result.png")

    model = MsrnModel.from_pretrained('eugenesiow/msrn', scale=2)
    inputs = ImageLoader.load_image(image)

    preds = model(inputs)

    ImageLoader.save_image(preds, f"{sys.argv[1]}/result.png")

if __name__ == "__main__":
    main()
