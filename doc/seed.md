# Seed commands

Don't seed the database multiple times. This will cause errors.

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

The default password for the newly created user is specified in the [users.json](https://github.com/Jinlei2000/Lei_Samuel/blob/4a38cfbbe78bce8e8d4296fe162309a3addfbaee/packages/api/src/seed/data/users.json) file and is set to 123456. Feel free to modify it there.

```bash
npx nestjs-command seed:firebase:auth
```

### Deleting firebase authentication data

```bash
npx nestjs-command seed:reset:firebase:auth
```

## Firebase storage

### Deleting firebase storage data

```bash
npx nestjs-command seed:reset:firebase:storage
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


