import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv
import numpy as np
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

# def get_top_songs_by_genre(genre):
#     results = sp.search(q='genre:"{}"'.format(genre), type='track', limit=10, market='KR')  # 장르별로 10개의 노래 검색
#     tracks = results['tracks']['items']
#     return tracks

def get_top_songs_by_genre(genre):
    if genre == 'top':
        results = sp.search(q='Top 50: korea', type='playlist', limit=1)
        playlist_id = results['playlists']['items'][0]['id']
        tracks_response = sp.playlist_items(playlist_id, additional_types=['track'])
        tracks = tracks_response['items']
        result = []
        for track in tracks:
            result.append(track['track'])
        return result
    else:
        results = sp.search(q='genre:"{}"'.format(genre), type='track', limit=50, market='KR')  # 장르별로 10개의 노래 검색
        sorted_results = sorted(results['tracks']['items'], key=lambda x: x['popularity'], reverse=True)
        return sorted_results



def search_song_id(song_title, artist_name):
    # 노래제목과 아티스트 이름을 입력으로 주면 해당 곡의 id 출력
    result = sp.search(q=f'track:{song_title} artist:{artist_name}', type='track', limit=1)
    if len(result['tracks']['items']) > 0:
        song_id = result['tracks']['items'][0]['id']
        return song_id
    else:
        print("No search results for", song_title)
        return None

def get_recommendation(song_id):
    # 노래 id를 입력으로 주면 해당 노래로 recommendation 메소드 돌려서 50개 노래 뽑은 후, 50개 노래와 코사인 유사도를 구해서 유사도 높은순으로 출력

    # 추천 노래 목록 가져오기
    recommendations = sp.recommendations(seed_tracks=[song_id], limit=50)

    # 추천된 노래들의 ID 목록 가져오기
    track_ids = [track["id"] for track in recommendations["tracks"]]

    # 선택한 노래와 추천 노래들의 특성 추출
    features = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness',
                'liveness', 'valence', 'tempo']
    song_features = sp.audio_features([song_id])[0]
    song_features = [song_features[feature] for feature in features]
    song_features = np.array(song_features)

    rec_features = [sp.audio_features([track['id']])[0] for track in recommendations['tracks']]
    rec_features = [[track[feature] for feature in features] for track in rec_features]
    rec_features = np.array(rec_features)

    # 선택한 노래와 추천 노래들 간의 코사인 유사도 계산
    similarity = np.dot(rec_features, song_features) / (np.linalg.norm(rec_features, axis=1) * np.linalg.norm(song_features))

    # 유사도가 높은 순서대로 노래 출력
    sorted_indices = np.argsort(similarity)[::-1]
    for i in sorted_indices:
        print(recommendations['tracks'][i]['name'], similarity[i])
