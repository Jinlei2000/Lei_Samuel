import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { MailResolver } from './mail.resolver'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'hotmail',
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [MailService, MailResolver],
  exports: [MailService],
})
export class MailModule {}
