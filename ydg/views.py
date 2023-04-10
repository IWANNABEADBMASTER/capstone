'''
Created on 2023. 4. 10.

@author: Desktop
'''

import base64
import requests
from django.shortcuts import redirect, render
from django.conf import settings
from django.http import HttpResponse

def login(request):
    # 클라이언트 ID 및 시크릿 키
    client_id = settings.SPOTIFY_CLIENT_ID
    client_secret = settings.SPOTIFY_CLIENT_SECRET

    # 스포티파이 API 인증 요청을 위한 인증 헤더 생성
    auth_header = base64.b64encode((client_id + ':' + client_secret).encode('ascii'))
    headers = {'Authorization': 'Basic %s' % auth_header.decode('ascii')}

    # 스포티파이 API 인증 요청을 보내기 위한 URL
    url = 'https://accounts.spotify.com/api/token'

    # 스포티파이 API 인증 요청을 위한 파라미터 설정
    data = {
        'grant_type': 'authorization_code',
        'code': request.GET.get('code') or '',
        'redirect_uri': 'http://localhost:8000/callback/'
    }

    # 스포티파이 API 인증 요청 보내기
    response = requests.post(url, headers=headers, data=data)

    # 스포티파이 API 인증 결과 확인
    if response.status_code == 200:
        # 인증 토큰 받기
        auth_token = response.json().get('access_token', '')

        # 스포티파이 API를 사용하여 유저 정보 가져오기
        user_info_url = 'https://api.spotify.com/v1/me'
        headers = {'Authorization': 'Bearer %s' % auth_token}
        user_info_response = requests.get(user_info_url, headers=headers)

        # 유저 정보 확인
        if user_info_response.status_code == 200:
            user_info = user_info_response.json()
            # 필요한 작업 수행

        # 인증 토큰 저장
        request.session['spotify_auth_token'] = auth_token

        return redirect('/spotify/?code=' + (request.GET.get('code', '') or ''))

def callback(request):
    return HttpResponse("This is a callback page")