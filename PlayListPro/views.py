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

def topChart(request):
    if request.method == 'POST':
        selected_genre = request.POST.get('genre')
        results = spotify.get_top_songs_by_genre(selected_genre)
        context = {'results': results, 'selected_genre':selected_genre}
        return render(request, 'topChart.html', context)
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