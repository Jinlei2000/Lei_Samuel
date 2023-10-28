import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { MailService } from './mail.service'
import { Mail } from './entities/mail.entity'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { Role } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/users/guards/roles.guard'

@Resolver(() => Mail)
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

  // Send email to new employee
  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => String, { name: 'sendEmailToNewEmployeeById' })
  sendEmailToNewEmployeeById(
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.mailService.sendMailByUserId(userId)
  }

  // Get mail token by token
  @Query(() => Mail, { name: 'getMailTokenByToken' })
  findOneByToken(
    @Args('token', { type: () => String }) token: string,
  ): Promise<Mail> {
    return this.mailService.findOneByToken(token)
  }
// TODO: add to documentation
  // Delete all mail tokens by userId
  @Mutation(() => [String], { name: 'removeAllMailTokensByUserId' })
  removeAllByUserId(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<string[]> {
    return this.mailService.removeAllByUserId(userId)
  }
}
