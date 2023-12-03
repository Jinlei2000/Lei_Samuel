# Seed commands

```bash
npx nestjs-command <SEED_COMMAND_NAME>
```

## All in one seed command

This command will seed all data of the database, firebase authentication.

```bash
npx nestjs-command seed
```

This command will delete all data of the database, firebase authentication.

```bash
npx nestjs-command seed:reset
```

## Firebase authentication

### Seeding firebase authentication

```bash
npx nestjs-command seed:firebase:auth
```

### Deleting firebase authentication data

```bash
npx nestjs-command seed:reset:firebase:auth
```

## Database (MongoDB)

### Seed all data of the database

```bash
npx nestjs-command seed:database
```

### Resetting the database

```bash
npx nestjs-command seed:reset:database
```

### Seeding the database with dummy data

```bash
npx nestjs-command seed:database:materials
npx nestjs-command seed:database:users
npx nestjs-command seed:database:schedules
```

### Deleting data of the database

```bash
npx nestjs-command seed:reset:appointments
npx nestjs-command seed:reset:materials
npx nestjs-command seed:reset:users
npx nestjs-command seed:reset:locations
npx nestjs-command seed:reset:absences
npx nestjs-command seed:reset:schedules
npx nestjs-command seed:reset:mail
```


