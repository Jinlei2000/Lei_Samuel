import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from '../users.service'
import { Role } from '../entities/user.entity'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ROLES_KEY } from '../decorators/role.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      throw new Error('No roles defined')
    }

    const ctx = GqlExecutionContext.create(context)
    // Waarom werkt dit niet? omdat we zelf al guard hiervoor hebben
    const { user } = ctx.getContext().req

    const { role } = await this.usersService
      .findOneByUid(user.uid)
      .catch(() => {
        throw new Error('No roles defined')
      })

    return requiredRoles.includes(role)
  }
}
