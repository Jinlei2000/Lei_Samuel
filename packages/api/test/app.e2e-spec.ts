import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { AbsencesService } from 'src/absences/absences.service'
import { absenceStub } from 'src/absences/stubs/absences.stub'

const GQL_ENDPOINT = '/graphql'
const dummyJwtToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1ZCI6ImFkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1dGhfdGltZSI6MTY5NzM4OTcxOSwidXNlcl9pZCI6IjBQSVQ4RVVldVVadmJreGV6NEhWd0tzNUdWazEiLCJzdWIiOiIwUElUOEVVZXVVWnZia3hlejRIVndLczVHVmsxIiwiaWF0IjoxNjk4OTIyMTIwLCJleHAiOjE2OTg5MjU3MjAsImVtYWlsIjoic2RxZnFkc2ZxZHNmZHNkc2ZxcWZnQGRkZC5kZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzZHFmcWRzZnFkc2Zkc2RzZnFxZmdAZGRkLmRkIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.aTZu66nOt8Sx9JeCbN_Q2cI2AnffvPok4dbcYJm8Gad0Xfz-DpUAw524i7LGpXbOraftd5PlkUjeMmD1fYpstezUdsnckoHmAmh_NaLZQ3OZ5HhjYfdtd-tsKRCnxQuWqd_QC5xo9rT8rpBb2WatXhaMZVbDgB7QbPUUJy4dLSQwAr73paAVJ3eave9R4-8c8q4FU7HXB6_Qeih5Ie-i54xEWoA-da3gHs0A_rWWwDOSgnh4pqMEWWMbe5PZQ0szjOykTS0nDafcL4_R0NdEeUYIR7RXBxy0LOO8WP8k5DF0oZlbtZBQc1UFiVKlquuSv2xZzsHQ-VALID-A'
const dummyInvalidJwtToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1ZCI6ImFkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1dGhfdGltZSI6MTY5NzM4OTcxOSwidXNlcl9pZCI6IjBQSVQ4RVVldVVaINVALID6NEhWd0tzNUdWazEiLCJzdWIiOiIwUElUOEVVZXVVWnZia3hlejRIVndLczVHVmsxIiwiaWF0IjoxNjk4OTIyMTIwLCJleHAiOjE2OTg5MjU3MjAsImVtYWlsIjoic2RxZnFkc2ZxZHNmZHNkc2ZxcWZnQGRkZC5kZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzZHFmcWRzZnFkc2Zkc2RzZnFxZmdAZGRkLmRkIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.aTtu66nOt8Sx9JeCbN_Q2cI2AnffvPok4dbcYJm8Gad0Xfz-DpUAw524i7LGpXbOraftd5PlkUjeMmD1fYpstezUdsnckoHmAmh_NaLZQ3OZ5HhjYfdtd-tsKRCnxQuWqd_QC5xo9rT8rpBb2WatXhaMZVbDgB7QbPUUJy4dLSQwAr73paAVJ3eave9R4-8c8q4FU7HXB6_Qeih5Ie-i54xEWoA-da3gHs0A_rWWwDOSgnh4pqMEWWMbe5PZQ0szjOykTS0nDafcL4_R0NdEeUYIR7RXBxy0LOO8WP8k5DF0oZlbtZBQc1UFiVKlquuSv2xZzsHQ-INVALID-A'

describe('AppController (e2e)', () => {
  let app: INestApplication

  let absencesServiceMockData = {
    findAll: () => [absenceStub()],
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AbsencesService)
      .useValue(absencesServiceMockData)
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
          .set(
            'Authorization',
            `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1ZCI6ImFkdi1mdWxsLXN0YWNrLTIwMjItdGVzdCIsImF1dGhfdGltZSI6MTY5NzM4OTcxOINVALIDI6IjBQSVQ4RVVldVVadmJreGV6NEhWd0tzNUdWazEiLCJzdWIiOiIwUElUOEVVZXVVWnZia3hlejRIVndLczVHVmsxIiwiaWF0IjoxNjk4OTIyMTIwLCJleHAiOjE2OTg5MjU3MjAsImVtYWlsIjoic2RxZnFkc2ZxZHNmZHNkc2ZxcWZnQGRkZC5kZCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJzZHFmcWRzZnFkc2Zkc2RzZnFxZmdAZGRkLmRkIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.aTtu66nOt8Sx9JeCbN_Q2cI2AnffvPok4dbcYJm8Gad0Xfz-DpUAw524i7LGpXbOraftd5PlkUjeMmD1fYpstezUdsnckoHmAmh_NaLZQ3OZ5HhjYfdtd-tsKRCnxQuWqd_QC5xo9rT8rpBb2WatXhaMZVbDgB7QbPUUJy4dLSQwAr73paAVJ3eave9R4-8c8q4FU7HXB6_Qeih5Ie-i54xEWoA-da3gHs0A_rWWwDOSgnh4pqMEWWMbe5PZQ0szjOykTS0nDafcL4_R0NdEeUYIR7RXBxy0LOO8WP8k5DF0oZlbtZBQc1UFiVKlquuSv2xZzsHQ-INVALID-A}`,
          )
          .expect(200)
          .expect(res => {
            expect(res.body.errors[0].message).toEqual('Unauthorized')
          })
      })

      it('should return all absences with valid bearer token', () => {
        return request(app.getHttpServer())
          .post(GQL_ENDPOINT)
          .send({
            query: '{ observations { id , bird {id,name} } }',
          })
          .set('Authorization', `Bearer ${dummyJwtToken}`)
          .expect(200)
          .expect(res => {
            expect(res.body.data.observations).toEqual([
              {
                id: '5f9d4a3f9d6c6a1d9c9bce1a',
                type: 'sick',
              },
            ])
          })
      })
    })
  })

  // fix warning (so you test will close properly)
  afterAll(async () => {
    await app.close()
  })
})
