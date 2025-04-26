import uvicorn
from dotenv import load_dotenv
import os

HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8080))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)