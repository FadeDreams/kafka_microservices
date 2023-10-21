const { Kafka } = require('kafkajs');

async function checkKafkaAvailability() {
  const kafka = new Kafka({
    clientId: 'kafka-check',
    brokers: ['localhost:9092'], // Replace with your Kafka broker list
  });

  const admin = kafka.admin();

  try {
    await admin.connect();
    console.log('Kafka broker is available and ready.');
  } catch (error) {
    console.error('Kafka broker is not available:', error);
  } finally {
    await admin.disconnect();
  }
}

checkKafkaAvailability();

