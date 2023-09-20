from django.shortcuts import render
from . import spotify
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.db import connections
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import IntegrityError
from .models import Users, Playlist, Music
from django.conf import settings

# from .models import Users, Playlist, Music
from rest_framework_simplejwt.tokens import AccessToken, Token
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.decorators import authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([])
def main(request):
    user = request.user

    # 토큰에서 사용자 이름 가져오기
    if isinstance(user, Token):
        userId = user["username"]
        username = user["name"]
    else:
        userId = user.username
        username = user.name

    # 사용자 이름을 포함한 JSON 응답 생성
    response_data = {"success": True, "userId": userId, "username": username}
    return JsonResponse(response_data, status=200)


@api_view(["POST"])
@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("userId")  # 사용자 아이디 입력 받기
        password = data.get("password")  # 비밀번호 입력 받기

        # 사용자 인증 수행
        certification = authenticate(request, username=username, password=password)

        if certification is not None:
            # 인증에 성공한 경우, 로그인 처리를 진행합니다.
            # 예를 들어 세션에 사용자 정보를 저장하거나 JWT 토큰을 발급하는 등의 작업을 수행할 수 있습니다.
            # 이 예시에서는 인증 성공 메시지와 토큰을 반환합니다.
            access_token = str(AccessToken.for_user(certification))
            message = "로그인에 성공하였습니다."

            response = JsonResponse(
                {"message": message, "success": True, "access_token": access_token}
            )
            return response
        else:
            # 인증에 실패한 경우, 실패 메시지를 반환합니다.
            message = "아이디 또는 비밀번호가 일치하지 않습니다."
            return JsonResponse({"message": message, "success": False}, status=401)
    else:
        # POST 요청이 아닌 경우 에러 반환
        response_data = {"message": "잘못된 요청입니다.", "success": False}
        return JsonResponse(response_data, status=400)


@csrf_exempt
def spotify_url(request):
    clientId = "4037ec337517476ab7c59266ca50f4b2"
    redirectUri = (
        f"http://{settings.MY_IP_ADDRESS}:3000/"  # settings에서 MY_IP_ADDRESS 값을 가져옴
    )
    clientSecret = ""

    context = {
        "clientId": clientId,
        "redirectUri": redirectUri,
        "clientSecret": clientSecret,
    }
    return JsonResponse(context)


@api_view(["POST"])
@csrf_exempt
def signup(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)

        # 사용자 중복 확인
        if Users.objects.filter(name=data.get("username")).exists():
            return JsonResponse(
                {"success": False, "message": "이미 해당 이름으로 가입한 아이디가 있습니다."}
            )

        # 아이디 중복 확인
        if Users.objects.filter(username=data.get("userId")).exists():
            return JsonResponse({"success": False, "message": "이미 존재하는 아이디입니다."})

        # 사용자 정보 생성
        user = Users.objects.create_user(
            username=data.get("userId"),  # 사용자 아이디
            name=data.get("username"),  # 사용자 이름
            password=data.get("password"),
            email=data.get("email"),
        )

        # 회원가입 성공 메시지 반환
        return JsonResponse({"success": True})
    else:
        # POST 요청이 아닌 경우 에러 반환
        response_data = {"success": False, "message": "잘못된 요청입니다."}
        return JsonResponse(response_data, status=400)


@api_view(["POST"])
def update(request):
    # 토큰에서 사용자 정보 가져오기
    authentication = JWTAuthentication()
    user, _ = authentication.authenticate(request)

    # 입력받은 데이터 추출
    password = request.data.get("password")
    new_password = request.data.get("newPassword")

    # 사용자 인증 수행
    if not user or not authenticate(username=user.username, password=password):
        response_data = {"success": False, "message": "현재 비밀번호가 일치하지 않습니다."}
        return JsonResponse(response_data, status=400)

    # 비밀번호 업데이트
    user.set_password(new_password)
    user.save()

    response_data = {"success": True, "message": "비밀번호가 성공적으로 변경되었습니다."}
    return JsonResponse(response_data, status=200)


@api_view(["POST"])
@csrf_exempt
def search(request):
    if request.method == "POST":
        data = json.loads(request.body)
        query = data.get("query")
        if len(query) > 0:
            result_data = spotify.search_spotify(query)
            context = {
                "results": result_data["tracks"],
                "track_ids": result_data["track_ids"],
            }
        else:
            context = {"result": [], "track_ids": ""}
    else:
        context = {"results": [], "track_ids": ""}
    return JsonResponse(context)


@api_view(["POST"])
@csrf_exempt
def playlist(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        userId = data.get("userId")

        # userId에 해당하는 playlist 테이블의 정보 조회
        try:
            playlists = Playlist.objects.filter(userId=userId)
            playlist_data = []
            for playlist in playlists:
                image_url = get_first_song_image(playlist.playlistId)
                playlist_data.append(
                    {
                        "playlistId": playlist.playlistId,
                        "playlistname": playlist.playlistname,
                        "playlistcomment": playlist.playlistcomment,
                        "imageURL": image_url,
                    }
                )
            response_data = {"playlists": playlist_data}
        except Exception as e:
            response_data = {"message": "플레이리스트 조회 실패"}

        return JsonResponse(response_data)

    else:
        response_data = {"message": "플레이리스트 조회 실패"}

    return JsonResponse(response_data)


def get_first_song_image(playlistId):
    try:
        # 해당 playlistId에 해당하는 Music 중 가장 처음 노래의 이미지 URL을 반환
        music = Music.objects.filter(playlistId=playlistId).first()
        if music:
            return music.album_img
    except Exception as e:
        print("노래 조회 실패:", e)
    return None


@api_view(["POST"])
@csrf_exempt
def createplaylist(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        userId = data.get("userId")
        playlistname = data.get("playlistname")
        playlistcomment = data.get("playlistcomment")
        # Playlist 테이블에 데이터 생성
        try:
            # Users 모델에서 userId에 해당하는 인스턴스 가져오기
            user_instance = Users.objects.get(username=userId)

            # Playlist 테이블에 데이터 생성
            playlist = Playlist.objects.create(
                userId=user_instance,
                playlistname=playlistname,
                playlistcomment=playlistcomment,
            )
            playlistId = playlist.playlistId  # 생성한 playlistId 값 가져오기
            response_data = {
                "success": True,
                "message": "플레이리스트 생성 성공",
                "playlistId": playlistId,  # 생성한 playlistId 값을 반환
            }
        except Exception as e:
            response_data = {"success": False, "message": "플레이리스트 생성 실패"}

        return JsonResponse(response_data)

    else:
        response_data = {"success": False, "message": "플레이리스트 생성 실패"}

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def addmusic(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        playlistId = data.get("playlistId")
        trackId = data.get("trackId")
        music_title = data.get("music_title")
        artist = data.get("artist")
        album_image = data.get("album_image")
        time = data.get("time")

        # Playlist 모델의 인스턴스를 가져옵니다.
        playlist = Playlist.objects.get(playlistId=playlistId)

        # 이미 해당 플레이리스트에 동일한 trackId가 있는지 확인
        try:
            existing_music = Music.objects.get(playlistId=playlist, trackId=trackId)
            response_data = {"success": False, "message": "이미 해당 노래가 추가되었습니다."}
        except Music.DoesNotExist:
            # Music 모델에 새로운 레코드 추가
            music = Music.objects.create(
                playlistId=playlist,
                trackId=trackId,
                title=music_title,
                album_img=album_image,
                artist=artist,
                time=time,
            )
            response_data = {"success": True, "message": "노래 추가 성공"}

    else:
        response_data = {"success": False, "message": "노래 추가 실패"}

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def addspotifymusic(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        playlistId = data.get("playlistId")
        tracks = data.get("tracks")  # 여러 노래가 담긴 배열

        # Playlist 모델의 인스턴스를 가져옵니다.
        playlist = Playlist.objects.get(playlistId=playlistId)

        # 각 노래 정보를 처리합니다.
        for track in tracks:
            trackId = track["track"]["id"]
            music_title = track["track"]["name"]
            artist = ", ".join([artist["name"] for artist in track["track"]["artists"]])
            album_image = track["track"]["album"]["images"][0]["url"]
            duration_ms = track["track"]["duration_ms"]

            # 밀리초(ms)를 분과 초로 변환합니다.
            minutes, seconds = divmod(duration_ms / 1000, 60)
            formatted_duration = f"{int(minutes)}:{int(seconds):02}"

            # Music 테이블에 노래 추가
            music = Music.objects.create(
                playlistId=playlist,
                trackId=trackId,
                title=music_title,
                album_img=album_image,
                artist=artist,
                time=formatted_duration,
            )

        response_data = {
            "success": True,
            "message": "노래 추가 성공",
        }

    else:
        response_data = {"success": False, "message": "노래 추가 실패"}

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def playlistmusic(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        playlistId = data.get("playlistId")

        # playlistId 값을 갖는 노래 중 첫번째 노래의 이미지를 가져옴
        playlistImg = get_first_song_image(playlistId)

        # playlistId에 해당하는 Music 테이블의 정보 조회
        try:
            music_data = Music.objects.filter(playlistId=playlistId)
            music_list = []
            for music in music_data:
                music_list.append(
                    {
                        "trackId": music.trackId,
                        "title": music.title,
                        "album_img": music.album_img,
                        "artist": music.artist,
                        "time": music.time,
                    }
                )

            # 결과 데이터 구성
            response_data = {"playlistImg": playlistImg, "music_list": music_list}
        except Exception as e:
            response_data = {"message": "음악 데이터 조회 실패", "music_list": []}
        return JsonResponse(response_data)

    else:
        response_data = {"message": "플레이리스트 조회 실패", "music_list": []}

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def deletemusic(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        playlistId = data.get("playlistId")
        trackId = data.get("trackId")

        try:
            music_data = Music.objects.get(playlistId=playlistId, trackId=trackId)
            music_data.delete()
            response_data = {
                "success": True,
                "messageTitle": "Music 삭제 성공",
                "message": "해당 노래를 삭제했습니다.",
            }
        except Music.DoesNotExist:
            response_data = {
                "success": False,
                "messageTitle": "Music 삭제 실패",
                "message": "해당 노래를 찾을 수 없습니다.",
            }
    else:
        response_data = {
            "success": False,
            "messageTitle": "Music 삭제 실패",
            "message": "플레이리스트 조회 실패",
        }

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def deleteplaylist(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        playlistId = data.get("playlistId")

        try:
            # Music 테이블에서 해당 playlistId 값을 갖는 데이터 삭제
            music_data = Music.objects.filter(playlistId=playlistId)
            music_data.delete()

            # Playlist 테이블에서 해당 playlistId 값을 갖는 데이터 삭제
            playlist_data = Playlist.objects.get(playlistId=playlistId)
            playlist_data.delete()

            response_data = {
                "success": True,
                "messageTitle": "플레이리스트 삭제 성공",
                "message": "해당 플레이리스트를 삭제했습니다.",
            }
        except Playlist.DoesNotExist:
            response_data = {
                "success": False,
                "messageTitle": "플레이리스트 삭제 실패",
                "message": "해당 플레이리스트를 찾을 수 없습니다.",
            }
    else:
        response_data = {
            "success": False,
            "messageTitle": "플레이리스트 삭제 실패",
            "message": "플레이리스트 조회 실패",
        }

    return JsonResponse(response_data)


@api_view(["POST"])
@csrf_exempt
def chartmusic(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)
        selected_genre = data.get("selectedGenreKey")  # 선택된 장르의 key 값 (스포티파이에 넘겨줄 값)
        result_data = spotify.get_top_songs_by_genre(selected_genre)
        context = {
            "results": result_data["tracks"],
            "track_ids": result_data["track_ids"],
        }
    return JsonResponse(context)
