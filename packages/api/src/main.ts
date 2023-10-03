import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
  // add validation pipe to validate input
  app.useGlobalPipes(new ValidationPipe())

  // port of backend application
  await app.listen(3000)
  console.log(`Application is running on: ${await app.getUrl()}`)
  console.log(`GraphQL is running on: ${await app.getUrl()}/graphql`)
}
bootstrap()
