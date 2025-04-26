from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from handler.web_scraper import WebScraper
from handler.blob_storage import BlobStorage

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (replace with specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/upload-input")
def upload_input(type: str = None, body: dict = Body(...)):
    random_uuid = BlobStorage.generate_uuid()
    if type == 'text':
        BlobStorage.upload_file(random_uuid, 'input_file.txt', str(body['payload']))
    elif type == 'url':
        website_soup = WebScraper.get_website_soup(body['payload'])
        website_content = WebScraper.scrape_website_soup(website_soup)
        BlobStorage.upload_file(random_uuid, 'input_file.txt', '\n'.join(website_content))
    else:
        raise HTTPException(status_code=400, detail="Input type not supported")
    return {"message": "File uploaded successfull", "resource_id": random_uuid}