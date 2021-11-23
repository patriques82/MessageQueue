import amqplib from 'amqplib';

const rabbitmqSettings = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'patrik',
  password: 'patrik',
  vhost: '/',
  authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

const queue = 'logs';

const createMessage = (id) => {
  return {id, email: `test${id}@email.com`};
}

(async () => {
  let connection;
  let channel;

  try {
    connection = await amqplib.connect(rabbitmqSettings);
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    for (let i in [1,2,3,4]) {
      const msg = createMessage(i)
      const success = channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      if (success) {
        console.log("Published %s", msg);
      } else {
        console.warn("Failed to send %s", msg)
      }
    }
  } catch(e) {
    console.error('Error in publishing messages to queue', e);
  } finally {
    console.info('Closing channel and connection if available');
    if (channel) await channel.close();
    console.info("Channel closed");
    if (connection) await connection.close();
    console.info("Connection closed");
  }

  process.exit(0);

})();