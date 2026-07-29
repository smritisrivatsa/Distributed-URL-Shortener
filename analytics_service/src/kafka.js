import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET,
  },
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

export async function connectConsumer(onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'click-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      await onMessage(event);
    },
  });

  console.log('Kafka consumer connected');
}