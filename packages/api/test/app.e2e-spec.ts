import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { AbsencesService } from 'src/absences/absences.service'
import { absenceStub } from 'src/absences/stubs/absences.stub'
import { MaterialsService } from 'src/materials/materials.service'
import { materialStub } from 'src/materials/stubs/materials.stub'
import { FirebaseAuthStrategyMock } from './firebase.strategy.mock'
import { FirebaseAuthStrategy } from 'src/authentication/firebase.strategy'
import { UsersService } from 'src/users/users.service'
import { User } from 'src/users/entities/user.entity'
import {
  userAdminStub,
  userClientStub,
  userEmployeeStub,
} from 'src/users/stubs/users.stub'

const GQL_ENDPOINT = '/graphql'
const dummyJwtToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1ZCI6ImFkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1dGhfdGltZSI6MTY5NzM4OTcxOSwidXNlcl9pZCI6IjBQSVQ4RVVldVVadmJreGV6NEhWd0tzNUdWazEiLCJzdWIiOiIwUElUOEVVZXVVWnZia3hlejRIVndLczVHVmsxIiwiaWF0IjoxNjk4OTIyMTIwLCJleHAiOjE2OTg5MjU3MjAsImVtYWlsIjoic2RxZnFkc2ZxZHNmZHNkc2ZxcWZnQGRkZC5kZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzZHFmcWRzZnFkc2Zkc2RzZnFxZmdAZGRkLmRkIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.aTZu66nOt8Sx9JeCbN_Q2cI2AnffvPok4dbcYJm8Gad0Xfz-DpUAw524i7LGpXbOraftd5PlkUjeMmD1fYpstezUdsnckoHmAmh_NaLZQ3OZ5HhjYfdtd-tsKRCnxQuWqd_QC5xo9rT8rpBb2WatXhaMZVbDgB7QbPUUJy4dLSQwAr73paAVJ3eave9R4-8c8q4FU7HXB6_Qeih5Ie-i54xEWoA-da3gHs0A_rWWwDOSgnh4pqMEWWMbe5PZQ0szjOykTS0nDafcL4_R0NdEeUYIR7RXBxy0LOO8WP8k5DF0oZlbtZBQc1UFiVKlquuSv2xZzsHQ-VALID-A'
const dummyInvalidJwtToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1ZCI6ImFkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1dGhfdGltZSI6MTY5NzM4OTcxOSwidXNlcl9pZCI6IjBQSVQ4RVVldVVaINVALID6NEhWd0tzNUdWazEiLCJzdWIiOiIwUElUOEVVZXVVWnZia3hlejRIVndLczVHVmsxIiwiaWF0IjoxNjk4OTIyMTIwLCJleHAiOjE2OTg5MjU3MjAsImVtYWlsIjoic2RxZnFkc2ZxZHNmZHNkc2ZxcWZnQGRkZC5kZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzZHFmcWRzZnFkc2Zkc2RzZnFxZmdAZGRkLmRkIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.aTtu66nOt8Sx9JeCbN_Q2cI2AnffvPok4dbcYJm8Gad0Xfz-DpUAw524i7LGpXbOraftd5PlkUjeMmD1fYpstezUdsnckoHmAmh_NaLZQ3OZ5HhjYfdtd-tsKRCnxQuWqd_QC5xo9rT8rpBb2WatXhaMZVbDgB7QbPUUJy4dLSQwAr73paAVJ3eave9R4-8c8q4FU7HXB6_Qeih5Ie-i54xEWoA-da3gHs0A_rWWwDOSgnh4pqMEWWMbe5PZQ0szjOykTS0nDafcL4_R0NdEeUYIR7RXBxy0LOO8WP8k5DF0oZlbtZBQc1UFiVKlquuSv2xZzsHQ-INVALID-A'

describe('AppController (e2e)', () => {
  let app: INestApplication

  let absencesServiceMockData = {
    findAll: () => [absenceStub()],
    findAllByUserId: () => [absenceStub()],
    findOne: () => absenceStub(),
    create: () => absenceStub(),
    update: () => absenceStub(),
    remove: () => '5f9d4a3f9d6c6a1d9c9bce1a',
  }

  let materialsServiceMockData = {
    findAll: () => [materialStub()],
    findAllByUserId: () => [materialStub()],
    findOne: () => materialStub(),
    create: () => materialStub(),
    update: () => materialStub(),
    remove: () => '5f9d4a3f9d6c6a1d9c9bce1a',
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AbsencesService)
      .useValue(absencesServiceMockData)
      .overrideProvider(MaterialsService)
      .useValue(materialsServiceMockData)
      .overrideProvider(FirebaseAuthStrategy)
      .useClass(FirebaseAuthStrategyMock)
      .overrideProvider(UsersService)
      .useValue({
        findAll: () => [userAdminStub(), userClientStub(), userEmployeeStub()],
        findOneByUid: jest.fn(), // we will mock this in the test, so we can return a user with role USER or ADMIN
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  describe(GQL_ENDPOINT, () => {
    describe('ABSENCES', () => {
      describe('absences', () => {
        it('all absences should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absences { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('all absences should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absences { id } }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should return all absences with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absences { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.absences).toEqual([
                {
                  id: '5f9d4a3f9d6c6a1d9c9bce1a',
                  type: 'sick',
                },
              ])
            })
        })

        it('should return all absences, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absences { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should return all absences, but role EMPLOYEE not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absences { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })
      })
      describe('absencesByUserId', () => {
        it('all absencesByUserId should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                '{ absencesByUserId(userId: "5f9d4a3f9d6c6a1d9c9bce1a") { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('all absencesByUserId should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                '{ absencesByUserId(userId: "5f9d4a3f9d6c6a1d9c9bce1a") { id } }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should return all absencesByUserId with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                '{ absencesByUserId(userId: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.absencesByUserId).toEqual([
                {
                  id: '5f9d4a3f9d6c6a1d9c9bce1a',
                  type: 'sick',
                },
              ])
            })
        })

        it('should return all absencesByUserId, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                '{ absencesByUserId(userId: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should return all absencesByUserId with role EMPLOYEE', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                '{ absencesByUserId(userId: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.absencesByUserId).toEqual([
                {
                  id: '5f9d4a3f9d6c6a1d9c9bce1a',
                  type: 'sick',
                },
              ])
            })
        })
      })
      describe('absence', () => {
        it('absence should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absence(id: "5f9d4a3f9d6c6a1d9c9bce1a") { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('absence should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absence(id: "5f9d4a3f9d6c6a1d9c9bce1a") { id } }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should return absence with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absence(id: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.absence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })

        it('should return absence, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absence(id: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should return absence with role EMPLOYEE', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ absence(id: "5f9d4a3f9d6c6a1d9c9bce1a") { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.absence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })
      })
      describe('createAbsence', () => {
        it('createAbsence should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { createAbsence(createAbsenceInput: { type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('createAbsence should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { createAbsence(createAbsenceInput: { type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id } }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should createAbsence with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { createAbsence(createAbsenceInput: { type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.createAbsence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })

        it('should createAbsence, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { createAbsence(createAbsenceInput: { type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should createAbsence with role EMPLOYEE', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { createAbsence(createAbsenceInput: { type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.createAbsence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })
      })
      describe('updateAbsence', () => {
        it('updateAbsence should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { updateAbsence(updateAbsenceInput: { id: "5f9d4a3f9d6c6a1d9c9bce1a", type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('updateAbsence should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { updateAbsence(updateAbsenceInput: { id: "5f9d4a3f9d6c6a1d9c9bce1a", type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id } }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should updateAbsence with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { updateAbsence(updateAbsenceInput: { id: "5f9d4a3f9d6c6a1d9c9bce1a", type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.updateAbsence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })

        it('should updateAbsence, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { updateAbsence(updateAbsenceInput: { id: "5f9d4a3f9d6c6a1d9c9bce1a", type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should updateAbsence with role EMPLOYEE', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { updateAbsence(updateAbsenceInput: { id: "5f9d4a3f9d6c6a1d9c9bce1a", type: "sick", startDate: "2020-10-30T00:00:00.000Z", endDate: "2020-10-31T00:00:00.000Z", userId: "5f9d4a3f9d6c6a1d9c9bce1a" }) { id, type } }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.updateAbsence).toEqual({
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              })
            })
        })
      })
      describe('removeAbsence', () => {
        it('removeAbsence should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { removeAbsence(id: "5f9d4a3f9d6c6a1d9c9bce1a") }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('removeAbsence should give Unauthorized when invalid bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { removeAbsence(id: "5f9d4a3f9d6c6a1d9c9bce1a") }',
            })
            .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })

        it('should removeAbsence with role ADMIN', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userAdminStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { removeAbsence(id: "5f9d4a3f9d6c6a1d9c9bce1a") }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.removeAbsence).toEqual(
                '5f9d4a3f9d6c6a1d9c9bce1a',
              )
            })
        })

        it('should removeAbsence, but role CLIENT not allowed', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userClientStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { removeAbsence(id: "5f9d4a3f9d6c6a1d9c9bce1a") }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Forbidden resource')
            })
        })

        it('should removeAbsence with role EMPLOYEE', () => {
          const usersService = app.get(UsersService)
          jest
            .spyOn(usersService, 'findOneByUid')
            .mockImplementation((uid: string): Promise<User> => {
              const user = userEmployeeStub()
              user.uid = uid
              return Promise.resolve(user)
            })
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query:
                'mutation { removeAbsence(id: "5f9d4a3f9d6c6a1d9c9bce1a") }',
            })
            .set('Authorization', `Bearer ${dummyJwtToken}`)
            .expect(200)
            .expect(res => {
              expect(res.body.data.removeAbsence).toEqual(
                '5f9d4a3f9d6c6a1d9c9bce1a',
              )
            })
        })
      })
    })

    describe('USERS', () => {
      it('give Unauthorized when invalid bearer token', () => {
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ users { id } }',
          })
          .set('Authorization', `Bearer ${dummyInvalidJwtToken}}`)
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Unauthorized')
          })
      })

      it('should return all users with role ADMIN', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userAdminStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ users { id } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.data.users.length).toEqual(3)
          })
      })

      it('should return all users, but role CLIENT not allowed', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userClientStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ users { id } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource')
          })
      })

      it('should return all users, but role EMPLOYEE not allowed', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userEmployeeStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ users { id } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource')
          })
      })
    })

    describe('MATERIALS', () => {
      describe('materials', () => {
        it('all materials should give Unauthorized when no bearer token', () => {
          return request(app.getHttpServer())
            .post(GQL_ENDPOINT)
            .send({
              query: '{ materials { id } }',
            })
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].message).toEqual('Unauthorized')
            })
        })
      })

      it('all materials should give Unauthorized when invalid bearer token', () => {
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ materials { id } }',
          })
          .set('Authorization', `Bearer ${dummyInvalidJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Unauthorized')
          })
      })

      it('should return all materials with role ADMIN', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userAdminStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ materials { id, isLoan } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.data.materials).toEqual([
              {
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                isLoan: true,
              },
            ])
          })
      })

      it('should return all materials with role  EMPLOYEE', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userEmployeeStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ materials { id, isLoan } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.data.materials).toEqual([
              {
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                isLoan: true,
              },
            ])
          })
      })

      it('should return all materials, but role CLIENT not allowed', () => {
        const usersService = app.get(UsersService)
        jest
          .spyOn(usersService, 'findOneByUid')
          .mockImplementation((uid: string): Promise<User> => {
            const user = userClientStub()
            user.uid = uid
            return Promise.resolve(user)
          })
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ materials { id, isLoan } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Forbidden resource')
          })
      })
    })
  })

  // fix warning (so you test will close properly)
  afterAll(async () => {
    await app.close()
  })
})
