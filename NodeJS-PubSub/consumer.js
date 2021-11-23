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

const processMessage = (msg) => {
  msg = JSON.parse(msg.content.toString());
  console.log("Consumed: ", msg);
  // call your email service here to send the email
}

const queue = 'logs';

(async () => {
  let connection;
  let channel;

  try {
    connection = await amqplib.connect(rabbitmqSettings);
    channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    await channel.consume(queue, (msg) => {
      processMessage(msg);
      channel.ack(msg);
    }, { noAck: false });
  } catch(e) {
    console.error('Error in subscribing to queue', e);
  } finally {
    console.info('Closing channel and connection if available');
    if (channel) await channel.close();
    console.info("Channel closed");
    if (connection) await connection.close();
    console.info("Connection closed");
  }

  process.exit(0);

})();