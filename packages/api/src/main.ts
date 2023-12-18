import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log('URL_FRONTEND', process.env.URL_FRONTEND)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.URL_FRONTEND,
    ],
    credentials: true,
  })
  // add validation pipe to validate input
  app.useGlobalPipes(new ValidationPipe())

  // port of backend application
  await app.listen(3001)
  console.log(`Application is running on: ${await app.getUrl()}`)
  console.log(`GraphQL is running on: ${await app.getUrl()}/graphql`)
}
bootstrap()
