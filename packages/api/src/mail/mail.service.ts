import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { newEmployee } from './email-templates/new-employee'

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  // Send email to user
  async sendMailByUserId(id: string): Promise<string> {
    const user: User = await this.userService.findOne(id)

    // make a random token
    const token = Math.floor(1000 + Math.random() * 9000).toString()

    console.log('start sending email')

    // TODO: change this to the frontend url
    // TODO: how to handle the token?
    const url = `http://localhost:5173/auth/register/staff/?token=${token}`

    const result = await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Welcome to the team! Make your account now!',
        context: {
          // ✏️ filling curly brackets with content
          name: user.firstname,
          url,
        },
        // ✏️ our html template
        html: newEmployee(user, url),
      })
      .then(() => {
        console.log('Succesfully sent email')
      })
      .catch(error => {
        console.log(error)
        throw new GraphQLError("Couldn't send email")
      })

    return 'Succesfully sent email!'
  }
}
