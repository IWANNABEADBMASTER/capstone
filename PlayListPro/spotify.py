import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup

load_dotenv()
client_id = os.getenv("cid")
client_secret = os.getenv("secrete")

# 인증 정보 설정
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def search_spotify(query):
    # 검색 쿼리를 이용하여 음악 검색 limit: 검색 수
    results = sp.search(q=query, type='track', limit=50, offset=0)
    tracks = results['tracks']['items']
    return tracks

def get_top_songs_by_genre(genre):
    results = sp.search(q='genre:"{}"'.format(genre), type='track', limit=10, market='KR')  # 장르별로 10개의 노래 검색
    tracks = results['tracks']['items']
    return tracks