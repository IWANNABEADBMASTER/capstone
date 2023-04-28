from django.shortcuts import render
from . import spotify

# Create your views here.
def main(request):
    return render(request, 'main.html')

def search(request):
    if request.method == 'POST':
        query = request.POST['query']
        results = spotify.search_spotify(query)
        context = {'results': results}
        return render(request, 'search/searchResult.html', context)
    else:
        return render(request, 'search/search.html')

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

def topSong(request):
    if request.method == 'POST':
        selected_genre = request.POST['genre']     #선택된 장르 받음
        results = spotify.get_top_songs_by_genre(selected_genre)    #
        context = {'results': results}
        return render(request, 'topSong.html', context)
    else:
        return render(request, 'topSong.html')