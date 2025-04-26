from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from handler.web_scraper import WebScraper
from handler.blob_storage import BlobStorage
from collections import Counter

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
        data = str(body['payload'])
    elif type == 'url':
        website_soup = WebScraper.get_website_soup(body['payload'])
        website_content = WebScraper.scrape_website_soup(website_soup)
        data = '\n'.join(website_content)
    else:
        raise HTTPException(status_code=400, detail="Input type not supported")
    BlobStorage.upload_file('input_files', random_uuid, 'input_file.txt', data)
    
    return {"message": "File uploaded successfull", "resource_id": random_uuid}

@app.get('/scrape-words')
def get_scraped_words(resource_id: str, range: int = 15):
    try:
        BlobStorage.verify_resource_id('input_files', resource_id)
    except FileNotFoundError as error:
        return {"error": str(error)}
    file_data = BlobStorage.get_file_data('input_files', resource_id, 'input_file.txt')
    word_list = WebScraper.scrape_words_from_file(file_data)
    frequency = Counter(word_list)
    range_frequency = frequency.most_common(int(range))
    return {"message": "Word Scrapping successful", "word_frequency": dict(range_frequency)}