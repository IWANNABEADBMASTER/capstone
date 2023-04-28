from django.shortcuts import render
from . import spotify

# Create your views here.
def main(request):
    return render(request, 'main.html')

def search(request):
    if request.method == 'POST':
        query = request.POST['query']
        results = spotify.search_spotify(query)
        context = {'results': results ,'query': query}
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