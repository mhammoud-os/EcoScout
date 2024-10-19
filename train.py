# train.py
import os
import json
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import img_to_array

# Paths
annotations_path = './dataset/annotations/annotations.json'
distribution_path = './dataset/annotations/train_val_test_distribution_file.json'
images_dir = './dataset/images/'

# Load annotations and dataset split
with open(annotations_path) as f:
    annotations = json.load(f)

with open(distribution_path) as f:
    distribution = json.load(f)

train_images = distribution['train']  # List of training image filenames

def load_image_and_annotations(image_file):
    # Find the corresponding annotation in the JSON file
    img_path = os.path.join(images_dir, image_file)
    img = cv2.imread(img_path)
    img = cv2.resize(img, (224, 224))  # Resize for the model
    img = img_to_array(img) / 255.0  # Normalize
    return img

def extract_bboxes(image_file):
    bboxes = []
    for ann in annotations['annotations']:
        if ann['image_id'] == image_file:
            bbox = ann['bbox']  # Format is [x, y, width, height]
            bboxes.append(bbox)
    return bboxes[0] if bboxes else [0, 0, 0, 0]  # Return first bbox or a dummy one

# Create the dataset for training
X_train = []
y_train = []

for img_file in train_images:
    img = load_image_and_annotations(img_file)
    bbox = extract_bboxes(img_file)
    X_train.append(img)
    y_train.append(bbox)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Build the model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D(2, 2),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D(2, 2),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.MaxPooling2D(2, 2),
    layers.Flatten(),
    layers.Dense(512, activation='relu'),
    layers.Dense(4)  # Output for bounding box [x, y, width, height]
])

model.compile(optimizer='adam', loss='mse', metrics=['accuracy'])

# Train the model
history = model.fit(X_train, y_train, epochs=30, batch_size=80)

# Save the model
model.save('object_detection_model.keras')

print("Model training complete")
