from fastapi import FastAPI
from plag_service import check_plagiarism, PlagiarismRequest

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"service": "plagiarism"}

# Delegate POST to plag_service
app.post("/check-plagiarism")(check_plagiarism)
