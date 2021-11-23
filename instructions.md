1. docker run -d --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3.8-management-alpine
2. localhost:15672
    user: guest, pass: guest
3. Skapa användare: patrik, pass: patrik, role: administrator
4. Ge rättigheter till virtual host: /

3. cd NodeJS-PubSub
4. npm install amqplib --save
5. npm run pub
5. npm run sub