from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI()

class PlagiarismRequest(BaseModel):
    text: str
    reference: str

@app.post("/check-plagiarism")
def check_plagiarism(req: PlagiarismRequest):
    try:
        texts = [req.text, req.reference]
        
        # Convert the texts to TF-IDF feature vectors
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(texts)

        # Calculate cosine similarity between them
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        # Return similarity as plagiarism score
        return {"plagiarism_score": float(similarity)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
