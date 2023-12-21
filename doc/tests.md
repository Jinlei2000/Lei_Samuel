# Tests

Go to the backend folder

```bash
cd packages/api
```

## Backend unit tests

### Absences 

```bash
npx jest absences/absences.service.spec
npx jest materials/materials.service.spec
```

## Backend e2e tests

### Absences 

```bash
npm run test:e2e -w api
```

## Frontend e2e tests

go to packages/tuinbouw

```bash
npx playwright test --ui
```

or

```bash
npx playwright test
```




