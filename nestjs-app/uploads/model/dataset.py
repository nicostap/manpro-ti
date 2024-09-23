from PIL import Image
import os
from torch.utils.data import Dataset
import numpy as np

class ImageDataset(Dataset):
    def __init__(self, root_image, transform=None):
        self.root_image = root_image
        self.transform = transform
        self.source_image_name = "source.png"

        self.source_image_path = os.path.join(self.root_image, self.source_image_name)
        if not os.path.exists(self.source_image_path):
            raise FileNotFoundError(f"{self.source_image_name} not found in {self.root_image}")
        self.length_dataset = 1

    def __len__(self):
        return 1

    def __getitem__(self, index):
        image_img = np.array(Image.open(self.source_image_path).convert("RGB"))
        if self.transform:
            augmentations = self.transform(image=image_img)
            image_img = augmentations["image"]
        return image_img
