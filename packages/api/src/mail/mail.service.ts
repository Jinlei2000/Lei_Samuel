import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendNewAccountMail(user: User, token: string) {
    // TODO: change this to the frontend url
    const url = `http://localhost:5173/auth/register/staff/?token=${token}`

    console.log(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    )

    await this.mailerService
      .sendMail({
        // to: user.email,
        // TODO: make dynamic
        to: 'jinleix3@hotmail.com',
        from: 'info@tuinbouw.club', // override default from
        subject: 'Welcome to the team! Make your account now!',
        template: './newAccount', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.firstname,
          url,
        },
      })
      .then(() => {
        console.log('Email sent')
      })
      .catch(error => {
        console.log(error)
      })
  }
}
