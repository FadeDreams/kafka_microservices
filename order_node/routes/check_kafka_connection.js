const { Producer } = require('node-rdkafka');

const producer = new Producer({
  'metadata.broker.list': 'localhost:9092', // Replace with your Kafka broker list
});

producer.on('event.error', (err) => {
  console.error('Kafka producer error:', err);
  process.exit(1);
});

producer.on('event.log', (log) => {
  console.log('Kafka producer log:', log);
});

producer.connect();

producer.on('ready', () => {
  console.log('Kafka producer is ready and connected.');
  producer.disconnect(); // Disconnect after confirming the connection
});

// Handle potential disconnection events
producer.on('disconnected', () => {
  console.log('Kafka producer disconnected.');
  process.exit(0);
});

