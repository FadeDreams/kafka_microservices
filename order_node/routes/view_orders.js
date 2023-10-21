const { Kafka, KafkaConsumer } = require('node-rdkafka');

const consumer = new KafkaConsumer({
  'group.id': 'my-consumer-group',
  'metadata.broker.list': 'localhost:9092', // Replace with your Kafka broker list
});

// Subscribe to the "order_topic"
consumer.connect();

consumer.on('ready', () => {
  console.log('Kafka consumer is ready and connected.');

  consumer.subscribe(['order_topic']); // Subscribe to the topic(s) you want to consume

  consumer.consume();

  consumer.on('data', (message) => {
    console.log('Received message:', message.value.toString()); // Log the message content
  });
});

// Handle potential disconnection events
consumer.on('disconnected', () => {
  console.log('Kafka consumer disconnected.');
});

consumer.on('event.error', (err) => {
  console.error('Kafka consumer error:', err);
  process.exit(1);
});

