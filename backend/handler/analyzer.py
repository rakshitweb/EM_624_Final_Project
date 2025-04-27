from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from wordcloud import WordCloud

class Analyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        self.word_cloud = WordCloud(width=700, height=700, background_color="white")
    
    def get_sentiment_analysis(self, word_list: list):
        text = " ".join(word_list)
        result = self.analyzer.polarity_scores(text)
        return result
    
    def get_word_cloud(self, word_list: list):
        text = " ".join(word_list)
        word_cloud_img = self.word_cloud.generate(text)
        return word_cloud_img