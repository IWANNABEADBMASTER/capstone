from django.shortcuts import render
from . import spotify
from .models import Users
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
def search(request):
    if request.method == 'POST':
        query = request.POST['query']
        if len(query)>0:
            results = spotify.search_spotify(query)
            context = {'results': results ,'query': query}
            return render(request, 'searchResult.html', context)
        else:
            context = {'result': '', 'query': query}
            return render(request, 'searchResult.html', context)
    else:
        return render(request, 'search.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('id')  # 사용자 아이디 입력 받기
        password = request.POST.get('password')  # 비밀번호 입력 받기

        User = get_user_model()

        try:
            # 사용자 정보를 확인하기 위해 데이터베이스에서 해당 사용자를 조회합니다.
            user = User.objects.get(username=username)

            # 사용자가 입력한 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
            if user.check_password(password):
                # 비밀번호가 일치하는 경우, 사용자 정보가 맞음을 알리는 메시지를 전달합니다.
                message = "사용자 정보가 일치합니다."
            else:
                # 비밀번호가 일치하지 않는 경우, 사용자 정보가 틀림을 알리는 메시지를 전달합니다.
                message = "비밀번호가 일치하지 않습니다."
        except User.DoesNotExist:
            # 사용자가 존재하지 않는 경우, 사용자 정보가 틀림을 알리는 메시지를 전달합니다.
            message = "사용자 정보가 일치하지 않습니다."
    else:
        # GET 요청인 경우, 아무런 처리를 하지 않습니다.
        message = "None"

    return render(request, 'signup_result.html', {'message': message})
    
@csrf_exempt  # CSRF 토큰 검증 비활성화
def signup(request):
    # POST 요청으로 전달된 데이터 가져오기
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            userId = data['userId']  # 사용자 아이디
            username = data['username']  # 사용자 이름
            password = data['password']  # 비밀번호
            email = data['email']  # 이메일

            # 새로운 Users 객체를 생성합니다.
            new_user = Users(userid=userId, username=username, password=password, email=email)

            # 데이터베이스에 새로운 사용자를 저장합니다.
            new_user.save()

            # 응답 반환 (JSON 형식으로)
            return JsonResponse({'success': True})
        
        except json.JSONDecodeError as e:
            response_data = {
                'message': '잘못된 요청입니다. JSON 형식이 올바르지 않습니다.',
            }
            return JsonResponse(response_data, status=400)
    else:
        # POST 요청이 아닌 경우 에러 반환
        response_data = {
        'message': '잘못된 요청입니다.'
        }
        return JsonResponse(response_data, status=400) 
    
def topChart(request):
    if request.method == 'POST':
        selected_genre = request.POST.get('genre') #선택된 장르 받음(스포티파이에 넘겨줄 값)
        selected_genre_name = request.POST.get('genre_name') #선택된 장르 이름 받음(ex K-R&B)
        results = spotify.get_top_songs_by_genre(selected_genre)
        context = {'results': results, 'select_genre_name':selected_genre_name}
        return render(request, 'topChart.html', context)
