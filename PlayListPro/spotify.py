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
client_credentials_manager = SpotifyClientCredentials(
    client_id=client_id, client_secret=client_secret
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


def search_spotify(query):
    # 검색 쿼리를 이용하여 음악 검색 limit: 검색 수
    results = sp.search(q=query, type="track", limit=50, offset=0)
    tracks = results["tracks"]["items"]

    # 각 노래 정보에서 trackId 값 추출
    track_ids = [track["id"] for track in tracks]
    return {"tracks": tracks, "track_ids": track_ids}


def get_top_songs_by_genre(genre):
    results = sp.search(
        q='genre:"{}"'.format(genre), type="track", limit=10, market="KR"
    )  # 장르별로 10개의 노래 검색
    tracks = results["tracks"]["items"]

    return tracks


def get_top_songs_by_genre(genre):
    if genre == "top":
        results = sp.search(q="Top 50: korea", type="playlist", limit=1)
        playlist_id = results["playlists"]["items"][0]["id"]
        tracks_response = sp.playlist_items(playlist_id, additional_types=["track"])
        tracks = tracks_response["items"]
        result = []
        for track in tracks:
            result.append(track["track"])
        return result
    else:
        results = sp.search(
            q='genre:"{}"'.format(genre), type="track", limit=50, market="KR"
        )  # 장르별로 10개의 노래 검색
        sorted_results = sorted(
            results["tracks"]["items"], key=lambda x: x["popularity"], reverse=True
        )
        # 각 노래 정보에서 trackId 값 추출
        track_ids = [track["id"] for track in sorted_results]
        return {"tracks": sorted_results, "track_ids": track_ids}
