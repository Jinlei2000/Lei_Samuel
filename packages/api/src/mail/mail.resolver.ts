import { Resolver, Query, Args } from '@nestjs/graphql'
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
  sendEmailToNewEmployeeById(@Args('id', { type: () => String }) id: string) {
    return this.mailService.sendMailByUserId(id)
  }
}
