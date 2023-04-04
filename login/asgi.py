"""
ASGI config for login project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
#os 모듈과 get_asgi_application 함수를 가져옵니다.
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'login.settings')
#DJANGO_SETTINGS_MODULE 환경 변수를 설정
application = get_asgi_application()
#get_asgi_application 함수를 사용하여 application 변수에 ASGI callable을 할당