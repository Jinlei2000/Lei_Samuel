# Graphql Queries

- [Graphql Queries](#graphql-queries)
  - [Authorization](#authorization)
  - [Materials](#materials)
    - [materials(filters: , order: { field, direction })](#materialsfilters--order--field-direction-)
    - [material(id)](#materialid)
    - [materialsByPersonId(personId, filters: , order: { field, direction })](#materialsbypersonidpersonid-filters--order--field-direction-)
    - [materialsBySearchString(searchString)](#materialsbysearchstringsearchstring)
    - [createMaterial](#creatematerial)
    - [updateMaterial](#updatematerial)
    - [removeMaterial](#removematerial)
  - [Users](#users)
    - [users(filters, order: { field, direction })](#usersfilters-order--field-direction-)
    - [user(id)](#userid)
    - [userByUid(uid)](#userbyuiduid)
    - [usersBySearchString(searchString)](#usersbysearchstringsearchstring)
    - [userUpgradeToAdmin(id)](#userupgradetoadminid)
    - [updateUser](#updateuser)
    - [removeUser](#removeuser)
    - [createStaff](#createstaff)
    - [createClient](#createclient)
  - [Locations](#locations)
    - [locations(order: { field, direction })](#locationsorder--field-direction-)
    - [locationsByUid(uid)](#locationsbyuiduid)
    - [location(id)](#locationid)
    - [createLocation](#createlocation)
    - [updateLocation](#updatelocation)
  - [Mail](#mail)
    - [sendEmailToNewEmployeeById(id)](#sendemailtonewemployeebyidid)
  - [Absences](#absences)
    - [absences(filters: , order: { field, direction })](#absencesfilters--order--field-direction-)
    - [absencesByPersonId(filters: , order: { field, direction })](#absencesbypersonidfilters--order--field-direction-)
    - [absence(id)](#absenceid)
    - [createAbsence](#createabsence)
    - [updateAbsence](#updateabsence)
    - [removeAbsence](#removeabsence)

## Authorization

Most of queries and mutations require authorization. To authorize you need to pass `Authorization` header with `Bearer` token.

## Materials
// TODO: personId is a resolve field
```object
{
  id
  name
  isAvailable
  user {
    // everything from user
  }
  isDefect
  serialNumber
  createdAt
  updatedAt
}
```

### materials(filters: , order: { field, direction })

materials(filters: [String], order: { field: String, direction: String })

Filters can be:

- `A` - available
- `NA` - not available
- `D` - defect
- `ND` - not defect

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

```graphql
query {
  materials {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```

### material(id)

material(id: String)

```graphql
query {
  material(id: "651d55ade0e77efb23fdfe53") {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```

### materialsByPersonId(personId, filters: , order: { field, direction })

materialsByPersonId(personId: String, filters: [String], order: { field: String, direction: String })

Filters can be:

- `A` - available
- `NA` - not available
- `D` - defect
- `ND` - not defect

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

```graphql
query {
  materialsByPersonId(
    personId: "651d55ade0e77efb23fdfe53"
    filters: ["NA", "ND"]
    order: { field: "name", direction: "ASC" }
  ) {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```

### materialsBySearchString(searchString)

materialsBySearchString(searchString: String)

```graphql
query {
  materialsBySearchString(searchString: "hoe") {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```


### createMaterial

```graphql
mutation {
  createMaterial(
    createMaterialInput: {
      name: "Material 1"
      isAvailable: true
      personId: "651d55ade0e77efb23fdfe53" // optional
      serialNumber: 123456789
    }
  ) {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```

### updateMaterial

```graphql
mutation {
  updateMaterial(
    updateMaterialInput: {
      id: "651d55ade0e77efb23fdfe53"
      name: "Material 1"
      isAvailable: true
      personId: "651d55ade0e77efb23fdfe53"
      serialNumber: 123456789
    }
  ) {
    id
    name
    isAvailable
    personId
    isDefect
    serialNumber
    createdAt
    updatedAt
  }
}
```

### removeMaterial

```graphql
mutation {
  removeMaterial(id: "651d55ade0e77efb23fdfe53")
}
```

## Users

```object
{
  id
  uid
  locale
  role
  firstname
  lastname
  fullname
  url
  locations {
    // everthing from locations
  }
  email
  telephone
  availability
  createdAt
  updatedAt
  absentCount
  invoiceOption
  company
  btwNumber
}
```

### users(filters, order: { field, direction })

users(filters: [String], order: { field: String, direction: String })

Filters can be:

- `A` - admin
- `E` - employee
- `C` - client
- `AV` - availability
- `NAV` - not availability
- `UID` - uid
- `NUID` - not uid

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

```graphql	
query {
  users {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    invoiceOption
    company
    btwNumber
  }
}
```

### user(id)

user(id: String)

```graphql
query {
  user(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    invoiceOption
    company
    btwNumber
  }
}
```

### userByUid(uid)

userByUid(uid: String)

```graphql
query {
  userByUid(uid: "6522bd1cfabcb1f1d63dd63a") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
   invoiceOption
    company
    btwNumber
  }
}
```

### usersBySearchString(searchString)

usersBySearchString(searchString: String)

```graphql
query {
  usersBySearchString(searchString: "x") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
   invoiceOption
    company
    btwNumber
  }
}
```

### userUpgradeToAdmin(id)

userUpgradeToAdmin(id: String)

can be used only by admin user to upgrade staff to admin

```graphql
query {
  userUpgradeToAdmin(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    invoiceOption
    company
    btwNumber
  }
}
```

### updateUser

```graphql
mutation {
  updateUser(
    updateUserInput: {
      id: "xx"
      lastname: "xx"
      firstname: "xx"
      url: "xx"
      uid: "xx"
      locationIds: ["xx"]
      email: "xx"
      telephone: "xx"
      availability: true
      // STAFF ONLY
      absentCount: number
      // CLIENT ONLY
      invoiceOption: "xx" 
      company: true
      btwNumber: "xx"
    }
  ) {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    invoiceOption
    company
    btwNumber
  }
}
```

### removeUser

```graphql
mutation {
  removeUser(id: "6522bd1cfabcb1f1d63dd63a")
}
```

### createStaff

only admin user can create new staff employee

```graphql
mutation {
  createStaff(
    createStaffInput: {
      firstname: "x"
      lastname: "xx"
      email: "x@x.x"
      telephone: "xx" // optional
      locale: "en" // optional
    }
  ) {
    id
    uid
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    absentCount
    createdAt
    updatedAt
  }
}
```

### createClient

```graphql
mutation {
  createClient(
    createClientInput: {
      firstname: "x"
      lastname: "xx"
      email: "x@x.x"
      locale: "en" // optional
    }
  ) {
    id
    uid
    firstname
    lastname
    fullname
    url
    locations {
      // everthing from locations
    }
    email
    telephone
    availability
    absentCount
    createdAt
    updatedAt
    invoiceOption
    company
    btwNumber
  }
}

```

## Locations

```object
{
  id
  uid
  address
  createdAt
  updatedAt
}
```

### locations(order: { field, direction })

locations(order: { field: String, direction: String })

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

```graphql
query {
  locations {
    id
    uid
    address
    createdAt
    updatedAt
  }
}
```

### locationsByUid(uid)

locationsByUid(uid: String)

```graphql
query {
  locationsByUid(uid: "6522bd1cfabcb1f1d63dd63a") {
    id
    uid
    address
    createdAt
    updatedAt
  }
}
```

### location(id)

location(id: String)

```graphql
query {
  location(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    uid
    address
    createdAt
    updatedAt
  }
}
```

### createLocation

```graphql
mutation {
  createLocation(
    createLocationInput: {
      address: "x"
      uid: "xx"
    }
  ) {
    id
    address
    uid
    createdAt
    updatedAt
  }
}
```

### updateLocation

```graphql
mutation {
  updateLocation(
    updateLocationInput: {
      id: "6522bd1cfabcb1f1d63dd63a"
      address: "x"
    }
  ) {
    id
    uid
    address
    createdAt
    updatedAt
  }
}

### removeLocation

```graphql
mutation {
  removeLocation(id: "6522bd1cfabcb1f1d63dd63a")
}
```

## Mail
### sendEmailToNewEmployeeById(id)

sendEmailToNewEmployeeById(id: String)

```graphql
query {
  sendEmailToNewEmployeeById(id: "6522bd1cfabcb1f1d63dd63a")
}
```

## Absences

```object
{
  id
  user{
    // everything from user
  }
  startDate
  endDate
  createdAt
  updatedAt
}
```

### absences(filters: , order: { field, direction })

absences(filters: [String], order: { field: String, direction: String })

Filters can be:
- `S` - Sick
- `V` - Vacation
- `O` - Other

Order can be:
- field = all fields from absence model
- direction = `ASC` or `DESC`

```graphql
query {
  absences {
    id
    user{
      // everything from user
    }
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

### absencesByPersonId(filters: , order: { field, direction })

absencesByPersonId(personId: String, filters: [String], order: { field: String, direction: String })

Filters can be:
- `S` - Sick
- `V` - Vacation
- `O` - Other

Order can be:
- field = all fields from absence model
- direction = `ASC` or `DESC`

```graphql
query {
  absencesByPersonId(personId: "6522bd1cfabcb1f1d63dd63a") {
    id
    user{
      // everything from user
    }
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

### absence(id)

absence(id: String)

```graphql
query {
  absence(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    user{
      // everything from user
    }
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

### createAbsence

```graphql
mutation {
  createAbsence(
    createAbsenceInput: {
      userId: "6522bd1cfabcb1f1d63dd63a"
      startDate: "2020-01-01"
      endDate: "2020-01-01"
      type: "S"
      description: "x" // optional
    }
  ) {
    id
    user{
      // everything from user
    }
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

### updateAbsence

```graphql
mutation {
  updateAbsence(
    updateAbsenceInput: {
      id: "6522bd1cfabcb1f1d63dd63a"
      userId: "6522bd1cfabcb1f1d63dd63a"
      startDate: "2020-01-01"
      endDate: "2020-01-01"
      type: "S"
      description: "x"
    }
  ) {
    id
    user{
      // everything from user
    }
    startDate
    endDate
    createdAt
    updatedAt
  }
}
```

### removeAbsence

```graphql
mutation {
  removeAbsence(id: "6522bd1cfabcb1f1d63dd63a")
}
```






