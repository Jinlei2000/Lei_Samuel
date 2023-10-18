import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { GraphQLError } from 'graphql'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { newEmployee } from './email-templates/new-employee'
import { Mail } from './entities/mail.entity'
import { CreateMailInput } from './dto/create-mail.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(Mail)
    private readonly mailRepository: Repository<Mail>,
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
  ) {}

  // Send email to user
  async sendMailByUserId(userId: string): Promise<string> {
    const user: User = await this.userService.findOne(userId)

    // make a random token
    const token = Math.floor(1000 + Math.random() * 9000).toString()

    console.log('start sending email')

    const url = `${process.env.URL_FRONTEND}/auth/register-employee/?token=${token}`

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

    // Save token in database
    await this.saveToken({ userId: user.id.toString(), token: token })

    return 'Succesfully sent email!'
  }

  // Find all tokens by userId
  async findAllByUserId(userId: string): Promise<Mail[]> {
    const tokens = await this.mailRepository.find({
      where: { userId: userId },
    })

    if (!tokens) {
      throw new GraphQLError('Tokens not found!')
    }

    return tokens
  }

  // Save token
  async saveToken(createMailInput: CreateMailInput): Promise<Mail> {
    // check if this user already has a token
    const tokens = await this.findAllByUserId(createMailInput.userId)

    // if so, delete all tokens
    if (tokens.length > 0) {
      await this.removeAllByUserId(createMailInput.userId)
    }

    const m = new Mail()
    m.userId = createMailInput.userId
    m.token = createMailInput.token
    // 2 weeks expiration date
    m.expirationDate = new Date(Date.now() + 12096e5)

    return this.mailRepository.save(m)
  }

  // TODO: add to userService when user delete his account
  // Remove all tokens by userId
  async removeAllByUserId(userId: string): Promise<string[]> {
    const tokens = await this.findAllByUserId(userId)

    const ids = tokens.map(token => token.id.toString())

    await this.mailRepository.delete(ids)

    return ids
  }
}
