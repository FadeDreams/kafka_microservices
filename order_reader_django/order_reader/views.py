from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import OrderSerializer
from .models import Order
from confluent_kafka import Producer
import json
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from rest_framework.views import APIView


# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .serializers import OrderSerializer
# from .models import Order
# from confluent_kafka import Producer
# from django.views.decorators.cache import cache_page
# import json


def produce_kafka_verify_order_message(order, order_data):
    # Define Kafka producer configuration
    producer = Producer({'bootstrap.servers': 'localhost:9092'})
    topic = 'verify_order_topic'
    # Convert the 'order_data' to a JSON string
    order_json = json.dumps(order_data)
    # Produce the message to Kafka
    producer.produce(topic, key=str(order.id), value=order_json)
    # Wait for any outstanding messages to be delivered and delivery reports to be received
    producer.flush()


@api_view(['POST', 'GET'])
def order_view(request, order_id=None, format=None):
    if request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            order.save()
            produce_kafka_verify_order_message(order, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        if order_id is not None:
            cached_data = cache.get(f'order_{order_id}')
            if cached_data:
                return Response(cached_data, status=status.HTTP_200_OK)

            try:

                order = Order.objects.get(pk=order_id)
                serializer = OrderSerializer(order)
                # Cache for 300 seconds (adjust as needed)
                cache.set(f'order_{order_id}', serializer.data, 300)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Order.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            cached_data = cache.get('all_orders')
            if cached_data:
                # Data is found in the cache
                return Response(cached_data, status=status.HTTP_200_OK)
            orders = Order.objects.all()
            serializer = OrderSerializer(orders, many=True)
            cache.set('all_orders', serializer.data, 300)
            return Response(serializer.data, status=status.HTTP_200_OK)


class OrderView(APIView):
    def post(self, request, format=None):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            # print('yes ser valid')
            order = serializer.save()
            order.save()
            # Produce Kafka message
            produce_kafka_verify_order_message(order, serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # else:
        # print('no ser valid')
        else:
            # print('no ser valid')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @cache_page(300)
# def get(self, request, order_id=None, format=None):
# if order_id is not None:
# # Retrieve an individual order by its ID
# try:
# order = Order.objects.get(pk=order_id)
# serializer = OrderSerializer(order)
# return Response(serializer.data, status=status.HTTP_200_OK)
# except Order.DoesNotExist:
# return Response(status=status.HTTP_404_NOT_FOUND)
# else:
# # List all orders
# orders = Order.objects.all()
# serializer = OrderSerializer(orders, many=True)
# return Response(serializer.data, status=status.HTTP_200_OK)
