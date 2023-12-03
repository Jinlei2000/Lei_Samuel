import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedModule } from './seed/seed.module'
import { MaterialsModule } from './materials/materials.module'
import { AuthenticationModule } from './authentication/authentication.module'
import { ConfigModule } from '@nestjs/config'
import { LocationsModule } from './locations/locations.module'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'
import { AbsencesModule } from './absences/absences.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { SchedulesModule } from './schedules/schedules.module'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { FirebaseUsersModule } from './firebase-users/firebase-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: process.env.NODE_ENV == 'production' ? false : true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          const mongo = await MongoMemoryServer.create({
            instance: {
              dbName: process.env.DB_NAME,
            },
          })

          const mongoUri = mongo.getUri()
          console.log('🍃 mongoUri', mongoUri)

          return {
            type: 'mongodb',
            url: `${mongoUri}${process.env.DB_NAME}`,
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: process.env.NODE_ENV == 'production' ? false : true, // Careful with this in production
            useNewUrlParser: true,
            useUnifiedTopology: true, // Disable deprecated warnings
          }
        } else {
          return {
            type: 'mongodb',
            url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, // DOCKER
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: process.env.NODE_ENV == 'production' ? false : true, // Careful with this in production
            useNewUrlParser: true,
            useUnifiedTopology: true, // Disable deprecated warnings
          }
        }
      },
    }),

    UsersModule,
    LocationsModule,
    AppointmentsModule,
    MaterialsModule,
    AuthenticationModule,
    SeedModule,
    MailModule,
    AbsencesModule,
    SchedulesModule,
    FirebaseUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
