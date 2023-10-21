import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-kafka-producer',
  brokers: ['localhost:9092'], // Replace with your Kafka broker list
});

const producer = kafka.producer();

export async function sendMessage(order) {
  try {
    await producer.connect();
    console.log('Kafka producer is ready and connected.');
    //const message = {
    //id: 123, // Your order ID or relevant data
    //productName: 'Sample Product',
    //quantity: 5,
    //};
    // Produce the message to the "order_topic"
    await producer.send({
      topic: 'order_topic',
      messages: [{ value: JSON.stringify(order) }],
    });

    console.log('Message sent successfully to "order_topic".');
  } catch (error) {
    console.error('Kafka producer error:', error);
  } finally {
    await producer.disconnect();
    console.log('Kafka producer disconnected.');
  }
}

export async function checkKafkaCon() {
  try {
    await producer.connect();
    console.log('Kafka producer is ready and connected.');
  } catch (error) {
    console.error('Kafka producer connection error:', error);
  } finally {
    await producer.disconnect();
    console.log('Kafka producer disconnected.');
  }
}

