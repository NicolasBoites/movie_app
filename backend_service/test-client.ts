import { ClientProxyFactory, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 4000 },
  });

  await client.connect();

  const response = await client
    .send({ cmd: 'get_movies' }, { page: 1, limit: 10 })
    .toPromise();
  console.log(response);

  process.exit(0);
}

bootstrap();
