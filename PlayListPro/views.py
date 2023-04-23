from django.shortcuts import render

# Create your views here.
def main(request):
    return render(request, 'main.html')
def search(request):
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