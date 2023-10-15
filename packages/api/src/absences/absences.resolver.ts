import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { AbsencesService } from './absences.service'
import { Absence } from './entities/absence.entity'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { Role, User } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/users/guards/roles.guard'
import { UsersService } from 'src/users/users.service'

@Resolver(() => Absence)
export class AbsencesResolver {
  constructor(
    private readonly absencesService: AbsencesService,
    private readonly usersService: UsersService,
  ) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Absence], { name: 'absences' })
  findAll() {
    return this.absencesService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Absence], { name: 'absencesByPersonId' })
  findAllByUserId(@Args('id', { type: () => String }) id: string) {
    return this.absencesService.findAllByUserId(id)
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => Absence, { name: 'absence' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.absencesService.findOne(id)
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Absence)
  createAbsence(
    @Args('createAbsenceInput') createAbsenceInput: CreateAbsenceInput,
  ) {
    return this.absencesService.create(createAbsenceInput)
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Absence)
  updateAbsence(
    @Args('updateAbsenceInput') updateAbsenceInput: UpdateAbsenceInput,
  ) {
    return this.absencesService.update(
      updateAbsenceInput.id,
      updateAbsenceInput,
    )
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String)
  removeAbsence(@Args('id', { type: () => String }) id: string) {
    return this.absencesService.remove(id)
  }

  // Resolve fields
  @ResolveField()
  user(@Parent() absence: Absence): Promise<User> {
    return this.usersService.findOne(absence.userId)
  }
}
