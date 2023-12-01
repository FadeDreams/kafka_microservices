from confluent_kafka import Producer, Consumer

# Kafka broker configuration
bootstrap_servers = 'localhost:29092'
group_id = 'my_consumer_group'
topic = 'my_topic'

# Produce messages
def produce_messages():
    producer_config = {
        'bootstrap.servers': bootstrap_servers,
    }

    producer = Producer(producer_config)

    for i in range(5):
        message = f'Message {i}'
        producer.produce(topic, value=message)
        producer.flush()

    print("Messages produced successfully")

# Consume messages
def consume_messages():
    consumer_config = {
        'bootstrap.servers': bootstrap_servers,
        'group.id': group_id,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(consumer_config)
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue
        if msg.error():
            print(f"Consumer error: {msg.error()}")
            continue

        print(f"Received message: {msg.value().decode('utf-8')}")

# Uncomment the following lines to run the producer and consumer
produce_messages()
consume_messages()

