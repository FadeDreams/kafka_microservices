from django.core.management.base import BaseCommand
from confluent_kafka import Consumer, KafkaError, TopicPartition
from django.test import RequestFactory
from order_reader.views import OrderView  # Import your OrderView


class Command(BaseCommand):
    help = 'Watch Kafka for incoming messages'

    def handle(self, *args, **options):
        # Configure the Kafka consumer with a group.id
        consumer = Consumer({
            'bootstrap.servers': 'localhost:9092',
            'group.id': 'OrderProcessorGroup',  # Set your consumer group ID
        })

        # Assign partitions and seek to an earlier offset
        # Replace with the desired partition and offset
        partitions = [TopicPartition('order_topic', 0, 0)]
        consumer.assign(partitions)

        # Create a RequestFactory to simulate an HTTP request
        request_factory = RequestFactory()

        # Create an instance of the OrderView
        order_view = OrderView.as_view()

        while True:
            msg = consumer.poll(1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    self.stderr.write(self.style.ERROR(
                        f"Error while receiving message: {msg.error()}"))
                    continue

            # Deserialize the message data if needed
            order_data = msg.value()
            print(order_data)

            # Simulate an HTTP POST request to the OrderView
            request = request_factory.post(
                '/order_reader/orders/', data=order_data, content_type='application/json')
            response = order_view(request)
            print(response)
            print(f"Response status code: {response.status_code}")

