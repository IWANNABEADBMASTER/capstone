import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

load_dotenv()
client_id = os.getenv("cid")
client_secret = os.getenv("secrete")

# 인증 정보 설정
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def search_spotify(query):
#   client_id = os.getenv('SPOTIFY_CLIENT_ID')
#   client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')

    # 검색 쿼리를 이용하여 음악 검색 limit: 검색 수
    results = sp.search(q=query, type='track', limit=10, offset=0)
    

    # 결과 반환
    # tracks = []
    # for track in results['tracks']['items']:
    #     artists = ', '.join([artist['name'] for artist in track['artists']])
    #     album = track['album']['name']
    #     tracks.append({'name': track['name'], 'artists': artists, 'album': album})
    tracks = results['tracks']['items']

    return tracks