
import pickle
import os
import sys

# Define the model path
model_path = r'c:\Users\aryan\Downloads\Phone Link\test\ml model\scam_detector (1).pkl'

try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    
    print(f"Model loaded successfully.")
    print(f"Type: {type(model)}")
    print(f"Content: {model}")
    
    # Check if it has a predict method
    if hasattr(model, 'predict'):
        print("Model has a 'predict' method.")
        
    # Check if it has a transform method (vectorizer)
    if hasattr(model, 'transform'):
        print("Object has a 'transform' method.")
        
except Exception as e:
    print(f"Error loading model: {e}")
