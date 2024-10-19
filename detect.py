# detect.py
import os
import json
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array

# Load the trained model
model = tf.keras.models.load_model('object_detection_model.keras')

# Paths
images_dir = 'dataset/images'


def load_image(image_file):
    img_path = os.path.join(images_dir, image_file)

    # Check if the image file exists
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"File not found: {img_path}")

    img = cv2.imread(img_path)

    # Check if the image was loaded successfully
    if img is None:
        raise ValueError(f"Could not load image from {img_path}. Check the file path and format.")

    img_resized = cv2.resize(img, (224, 224))  # Resize to the input size of the model
    img_array = img_to_array(img_resized) / 255.0  # Normalize
    return img, np.expand_dims(img_array, axis=0)


def detect_objects(image_file):
    # Load the image
    original_img, img_array = load_image(image_file)

    # Make predictions
    pred_bbox = model.predict(img_array)[0]  # Predict bounding box

    # Convert bbox from normalized to pixel coordinates
    h, w, _ = original_img.shape
    x_center, y_center, width, height = pred_bbox
    x1 = int((x_center - width / 2) * w)
    y1 = int((y_center - height / 2) * h)
    x2 = int((x_center + width / 2) * w)
    y2 = int((y_center + height / 2) * h)

    # Draw bounding box on the image
    output_img = cv2.rectangle(original_img, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # Display the image with the bounding box
    cv2.imshow("Detected Objects", output_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# Example detection on a new image
image_file = 'batch_01_frame_10.jpg'
detect_objects(image_file)

