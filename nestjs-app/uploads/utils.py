import random, torch, os, numpy as np
import torch.nn as nn
import config
import copy

def load_checkpoint(checkpoint_file, model):
    checkpoint = torch.load(checkpoint_file, map_location=config.DEVICE)
    model.eval()
    model.load_state_dict(checkpoint["state_dict"])
