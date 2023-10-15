import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AbsencesService } from './absences.service';
import { Absence } from './entities/absence.entity';
import { CreateAbsenceInput } from './dto/create-absence.input';
import { UpdateAbsenceInput } from './dto/update-absence.input';

@Resolver(() => Absence)
export class AbsencesResolver {
  constructor(private readonly absencesService: AbsencesService) {}

  @Mutation(() => Absence)
  createAbsence(@Args('createAbsenceInput') createAbsenceInput: CreateAbsenceInput) {
    return this.absencesService.create(createAbsenceInput);
  }

  @Query(() => [Absence], { name: 'absences' })
  findAll() {
    return this.absencesService.findAll();
  }

  @Query(() => Absence, { name: 'absence' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.absencesService.findOne(id);
  }

  @Mutation(() => Absence)
  updateAbsence(@Args('updateAbsenceInput') updateAbsenceInput: UpdateAbsenceInput) {
    return this.absencesService.update(updateAbsenceInput.id, updateAbsenceInput);
  }

  @Mutation(() => Absence)
  removeAbsence(@Args('id', { type: () => Int }) id: number) {
    return this.absencesService.remove(id);
  }
}
