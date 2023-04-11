from django.shortcuts import render

# Create your views here.
def main(request):
    return render(request, 'html/main.html')
def search(request):
    return render(request, 'html/search.html')
def myplaylist(request):
    return render(request, 'html/myplaylist.html')
def profile(request):
    return render(request, 'html/profile.html')
def profileUpdate(request):
    return render(request, 'html/profileUpdate.html')
def passwordUpdate(request):
    return render(request, 'html/passwordUpdate.html')
def login(request):
    return render(request, 'html/login.html')
def signup(request):
    return render(request, 'html/signup.html')    