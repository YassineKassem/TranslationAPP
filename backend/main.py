# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

app = FastAPI()

# Load the English-to-German translation model
model_name = "Helsinki-NLP/opus-mt-en-de"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# Define a request model for translation input
class TranslationRequest(BaseModel):
    text: str

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    # Tokenize input text
    inputs = tokenizer(request.text, return_tensors="pt", padding=True).to(device)
    
    # Generate translation
    outputs = model.generate(inputs["input_ids"], max_length=100, num_beams=4, early_stopping=True)
    translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return {"translated_text": translated_text}
