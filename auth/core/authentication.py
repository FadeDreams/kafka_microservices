import jwt, datetime
from rest_framework.authentication import BaseAuthentication
from rest_framework.authentication import get_authorization_header
from .models import User
from .serializers import UserSerializer
from rest_framework import exceptions

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = get_authorization_header(request)
        if not auth_header:
            return None
        prefix, token = auth_header.decode('utf-8').split(' ')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        user = User.objects.get(pk=payload['id'])
        return (user, token)


def create_access_token(id):
    return  jwt.encode({
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60) 
    }, 'secret', algorithm='HS256')


def create_refresh_token(id):
    return jwt.encode({
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, 'secret', algorithm='HS256')


def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('unauthenticated')
        return None

