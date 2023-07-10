from django.shortcuts import render
from . import spotify
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.db import connections
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Users
from rest_framework_simplejwt.tokens import AccessToken, Token
from rest_framework.decorators import api_view, permission_classes
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
        username = user["name"]
    else:
        username = user.name

    # 사용자 이름을 포함한 JSON 응답 생성
    response_data = {"username": username}
    return JsonResponse(response_data)


# Create your views here.
def search(request):
    if request.method == "POST":
        query = request.POST["query"]
        if len(query) > 0:
            results = spotify.search_spotify(query)
            context = {"results": results, "query": query}
            return render(request, "searchResult.html", context)
        else:
            context = {"result": "", "query": query}
            return render(request, "searchResult.html", context)
    else:
        return render(request, "search.html")


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


@api_view(["POST"])
def logout(request):
    token = request.data.get("token")
    if token:
        try:
            # 토큰 무효화
            # refresh_token = RefreshToken(token)
            # refresh_token.blacklist()

            return JsonResponse({"message": "토큰이 성공적으로 무효화되었습니다."})
        except Exception as e:
            return JsonResponse({"message": "토큰 무효화 중 오류가 발생했습니다."}, status=500)
    else:
        return JsonResponse({"message": "토큰이 제공되지 않았습니다."}, status=400)


@api_view(["POST"])
@csrf_exempt
def signup(request):
    if request.method == "POST":
        # POST 데이터 추출
        data = json.loads(request.body)

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


def topChart(request):
    if request.method == "POST":
        selected_genre = request.POST.get("genre")  # 선택된 장르 받음(스포티파이에 넘겨줄 값)
        selected_genre_name = request.POST.get("genre_name")  # 선택된 장르 이름 받음(ex K-R&B)
        results = spotify.get_top_songs_by_genre(selected_genre)
        context = {"results": results, "select_genre_name": selected_genre_name}
        return render(request, "topChart.html", context)
