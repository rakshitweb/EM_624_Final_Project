import bs4 as bs
import requests
import numpy as np

class WebScraper:
    @staticmethod
    def get_website_soup(website_link: str):
        body = requests.get(website_link)
        soup = bs.BeautifulSoup(body.content, 'html.parser')
        return soup

    @staticmethod
    def scrape_website_soup(soup):
        paragraphs = []
        headings = []
        # Following are the heading tags a website might contain
        heading_types = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        for paragraph in soup.find_all('p'):
            paragraphs.append(paragraph.text)
        
        for heading_type in heading_types:
            for heading in soup.find_all(heading_type):
                headings.append(heading.text)
                
        return np.concat([headings, paragraphs])