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
import sys
from super_image import DrlnModel, ImageLoader
from PIL import Image


def execute(loader, gen_H):
    image = next(iter(loader))
    image = image.to(config.DEVICE)
    use_amp = torch.cuda.is_available()
    with torch.cuda.amp.autocast() if use_amp else torch.enable_grad():
        fake_painting = gen_H(image)
    save_image(fake_painting * 0.5 + 0.5, f"{sys.argv[1]}/result.png")


def main():
    gen_H = Generator(img_channels=3, num_residuals=9).to(config.DEVICE)
    load_checkpoint(config.CHECKPOINT_GEN_H,gen_H)
    dataset = ImageDataset(root_image=sys.argv[1],transform=config.transforms)
    dataloader = DataLoader(dataset, batch_size=1, shuffle=False)
    execute(dataloader, gen_H)
    
    image = Image.open(f"{sys.argv[1]}/result.png")
    model = DrlnModel.from_pretrained('eugenesiow/drln-bam', scale=2)
    inputs = ImageLoader.load_image(image)
    preds = model(inputs)
    ImageLoader.save_image(preds, f"{sys.argv[1]}/result.png")

if __name__ == "__main__":
    main()
