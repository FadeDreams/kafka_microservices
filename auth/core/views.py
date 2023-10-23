from django.core import signing
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions
from .serializers import UserSerializer
from .models import User, Reset
from django.contrib.auth import authenticate
from .authentication import create_access_token, create_refresh_token, decode_refresh_token, JWTAuthentication
# from rest_framework.authentication import get_authorization_header
import jwt


from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication


# Now you can use the get_authorization_header function


# Create your views here.
class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data

        if data['password'] != data['confirm_password']:
            raise exceptions.APIException('Passwords do not match.')
            # raise serializers.ValidationError({'password': 'Passwords must match.'})
        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        # try:
        # serializer.is_valid(raise_exception=True)
        # Continue processing if data is valid
        # except serializers.ValidationError as e:
        serializer.save()

        return Response(request.data)
        # serializer = RegisterSerializer(data=request.data)
        # if serializer.is_valid():
        # serializer.save()
        # return Response(serializer.data)
        # return Response(serializer.errors)


class LoginAPIView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        password = data.get('password', None)
        if email is None or password is None:
            raise exceptions.APIException('Email and password are required.')
        user = authenticate(email=email, password=password)
        if not user:
            raise exceptions.APIException('Incorrect email or password.')

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        serializer = UserSerializer(user)
        response = Response()
        response.set_cookie(key='refresh_token',
                            value=refresh_token, httponly=True)
        response.data = {
            'token': access_token,
            'refresh_token': refresh_token,
            'user': serializer.data
        }
        return response
        # return Response(serializer.data)
        # return Response({'message': 'Success!'})


class UserAPIView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
        # auth = get_authorization_header(request).split()
        # if auth and len(auth) == 2:
        # try:
        # token = auth[1]
        # payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        # user = User.objects.get(pk=payload['id'])
        # serializer = UserSerializer(user)
        # return Response(serializer.data)
        # except jwt.DecodeError as identifier:
        # raise exceptions.AuthenticationFailed('Your token is invalid.')
        # except jwt.ExpiredSignatureError as identifier:
        # raise exceptions.AuthenticationFailed('Your token is expired.')

        return Response({'message': 'Invalid token.'})


# class RefreshAPIView(APIView):
    # def post(self, request):
        # refresh_token = request.COOKIES.get('refresh_token')
        # payload = decode_refresh_token(refresh_token)
        # if payload is None:
        # raise exceptions.AuthenticationFailed('unauthenticated')
        # user = User.objects.get(pk=payload['id'])
        # access_token = create_access_token(user.id)
        # return Response({'token': access_token})

class RefreshAPIView(APIView):
    # Optional, you can remove this line if you don't need session or basic auth

    def post(self, request):
        # Get the refresh token from the Authorization header
        authorization_header = request.headers.get('Authorization')
        print(authorization_header)

        if not authorization_header:
            raise exceptions.AuthenticationFailed(
                'Refresh token is missing in the Authorization header')

        # Extract the token from the header
        _, refresh_token = authorization_header.split(' ')

        payload = decode_refresh_token(refresh_token)
        if payload is None:
            raise exceptions.AuthenticationFailed('Unauthenticated')

        user = User.objects.get(pk=payload['id'])
        access_token = create_access_token(user.id)

        return Response({'token': access_token})


class LogoutAPIView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('refresh_token')
        response.data = {
            'message': 'success'
        }
        return response


class ForgotAPIView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', None)
        if email is None:
            raise exceptions.APIException('Email is required.')
        user = User.objects.get(email=email)
        if not user:
            raise exceptions.APIException('User not found.')
        reset_token = signing.dumps(user.id)
        Reset.objects.create(email=email, token=reset_token)
        return Response({'token': reset_token})


class ResetAPIView(APIView):
    def post(self, request):
        data = request.data
        token = data.get('token', None)
        password = data.get('password', None)
        confirm_password = data.get('password_confirm', None)
        if password != confirm_password:
            raise exceptions.APIException('Passwords do not match.')
        user_id = signing.loads(token)
        user = User.objects.get(pk=user_id)
        user.set_password(password)
        user.save()
        return Response({'message': 'success'})


class DeductCreditsAPIView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        credits_to_deduct = request.data.get('amount')

        try:
            user = User.objects.get(id=user_id)
            if user.credit >= credits_to_deduct:
                user.credit -= credits_to_deduct
                user.save()
                return Response({'message': 'Credits deducted successfully.'})
            else:
                raise exceptions.APIException('Insufficient credits.')
        except User.DoesNotExist:
            raise exceptions.APIException('User not found.')


class AddCreditsAPIView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        credits_to_add = request.data.get('amount')

        try:
            user = User.objects.get(id=user_id)
            user.credit += credits_to_add
            user.save()
            return Response({'message': 'Credits deducted successfully.'})
        except User.DoesNotExist:
            raise exceptions.APIException('User not found.')
