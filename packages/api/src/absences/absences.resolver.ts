import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { AbsencesService } from './absences.service'
import { Absence } from './entities/absence.entity'
import { CreateAbsenceInput } from './dto/create-absence.input'
import { UpdateAbsenceInput } from './dto/update-absence.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { Role } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/users/guards/roles.guard'

@Resolver(() => Absence)
export class AbsencesResolver {
  constructor(private readonly absencesService: AbsencesService) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Absence], { name: 'absences' })
  findAll() {
    return this.absencesService.findAll()
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Absence], { name: 'absencesByPersonId' })
  findAllByPersonId(@Args('id', { type: () => String }) id: string) {
    return this.absencesService.findAllByPersonId(id)
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

  @AllowedRoles(Role.ADMIN)
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
  @Mutation(() => Absence)
  removeAbsence(@Args('id', { type: () => String }) id: string) {
    return this.absencesService.remove(id)
  }
}
