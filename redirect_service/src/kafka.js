import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'redirect-service',
  brokers: [process.env.KAFKA_BOOTSTRAP_SERVER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET,
  },
});

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer connected');
}

export async function publishClickEvent(shortCode, longUrl, req) {
  await producer.send({
    topic: 'click-events',
    messages: [
      {
        value: JSON.stringify({
          shortCode,
          longUrl,
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'] || null,
          ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        }),
      },
    ],
  });
}