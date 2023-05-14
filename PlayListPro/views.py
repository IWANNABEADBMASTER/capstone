from django.shortcuts import render
from . import spotify

# Create your views here.
def main(request):
    return render(request, 'main.html')

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

def myplaylist(request):
    return render(request, 'myplaylist.html')
def profile(request):
    return render(request, 'profile.html')
def profileUpdate(request):
    return render(request, 'profileUpdate.html')
def passwordUpdate(request):
    return render(request, 'passwordUpdate.html')
def login(request):
    return render(request, 'login.html')
def signup(request):
    return render(request, 'signup.html')    
    
def topChart(request):
    if request.method == 'POST':
        selected_genre = request.POST.get('genre') #선택된 장르 받음(스포티파이에 넘겨줄 값)
        selected_genre_name = request.POST.get('genre_name') #선택된 장르 이름 받음(ex K-R&B)
        results = spotify.get_top_songs_by_genre(selected_genre)
        context = {'results': results, 'select_genre_name':selected_genre_name}
        return render(request, 'topChart.html', context)