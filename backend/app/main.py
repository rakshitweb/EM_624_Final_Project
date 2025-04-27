from fastapi.responses import Response
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from handler.web_scraper import WebScraper
from handler.blob_storage import BlobStorage
from handler.analyzer import Analyzer
from collections import Counter
import json
import os
from nltk.util import bigrams

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
    return {"message": "Word Scrapping successful", "word_frequency": dict(range_frequency), "total_words": sum(frequency.values())}

@app.post('/filter-words')
def filter_words(resource_id: str, body: dict = Body(...)):
    try:
        BlobStorage.verify_resource_id('input_files', resource_id)
    except FileNotFoundError as error:
        return {"error": str(error)}
    stop_words = body['stop_words']
    file_data = BlobStorage.get_file_data('input_files', resource_id, 'input_file.txt')
    word_list = WebScraper.scrape_words_from_file(file_data, stop_words)
    analyzer = Analyzer()
    sentiment_score = analyzer.get_sentiment_analysis(word_list)
    unique_word_ratio = len(set(word_list))/len(word_list)
    top_pairs = Counter(bigrams(word_list)).most_common(5)
    BlobStorage.upload_file('output_files', resource_id, 'sentiment.json', json.dumps({"sentiment_score":sentiment_score, "lexical_score": unique_word_ratio, "bigrams": top_pairs}))
    word_cloud_img = analyzer.get_word_cloud(word_list)
    directory_path = BlobStorage.get_directory_path('output_files', resource_id)
    word_cloud_img.to_file(f"{directory_path}/word_cloud.png")
    return {"message": "Generated the analysis"}

@app.get('/output')
def get_output(resource_id: str):
    try:
        BlobStorage.verify_resource_id('input_files', resource_id)
    except FileNotFoundError as error:
        return {"error": str(error)}
    directory_path = BlobStorage.get_directory_path('output_files', resource_id)
    sentiment_analysis_path = f"{directory_path}/sentiment.json"
    sentiment_analysis = None
    if os.path.exists(sentiment_analysis_path):
        with open(sentiment_analysis_path, 'r', encoding='utf-8') as f:
            sentiment_analysis = json.load(f)
    return {
        "stats": sentiment_analysis, 
    }

@app.get("/output-image")
def get_image(resource_id: str):
    try:
        BlobStorage.verify_resource_id('input_files', resource_id)
    except FileNotFoundError as error:
        return {"error": str(error)}
    directory_path = BlobStorage.get_directory_path('output_files', resource_id)
    word_cloud_image_path = f"{directory_path}/word_cloud.png"
    with open(word_cloud_image_path, "rb") as f:
        image_data = f.read()
    return Response(content=image_data, media_type="image/png")   
        