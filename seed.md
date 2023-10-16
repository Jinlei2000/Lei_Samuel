# Seeding the database

```bash
npx nestjs-command <SEED_COMMAND_NAME>
```

## Seeding the database with dummy data

```bash
npx nestjs-command seed:database:materials
npx nestjs-command seed:database:users
```

## Deleting data

```bash
npx nestjs-command seed:reset:materials
npx nestjs-command seed:reset:users
npx nestjs-command seed:reset:locations
npx nestjs-command seed:reset:absences
```


## Resetting the database

```bash
npx nestjs-command seed:reset
```
