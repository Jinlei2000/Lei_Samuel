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
    - [users(filters: , order: { field, direction })](#usersfilters--order--field-direction-)
    - [user(id)](#userid)
    - [userByUid(uid)](#userbyuiduid)
    - [usersBySearchString(searchString)](#usersbysearchstringsearchstring)
    - [userUpgradeToAdmin(id)](#userupgradetoadminid)
    - [updateUser](#updateuser)
    - [removeUser](#removeuser)
    - [createStaff](#createstaff)
    - [createClient](#createclient)

## Authorization

Most of queries and mutations require authorization. To authorize you need to pass `Authorization` header with `Bearer` token.

## Materials
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
### users(filters: , order: { field, direction })

users(filters: [String], order: { field: String, direction: String })

Filters can be:

- `A` - admin
- `E` - employee
- `C` - client

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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
      locationId: "xx"
      email: "xx"
      telephone: "xx"
      availability: true
      // STAFF ONLY
      absentCount: number
      // CLIENT ONLY
      InvoiceOption: "xx" 
      Company: true
      BtwNumber: "xx"
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
    locationId
    email
    telephone
    availability
    createdAt
    updatedAt
    absentCount
    InvoiceOption
    Company
    BtwNumber
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
      locationId: "xx"
      telephone: "xx"
      locale: "en"
    }
  ) {
    id
    uid
    firstname
    lastname
    fullname
    url
    locationId
    email
    telephone
    availability
    absentCount
    isAdmin
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
      locale: "en"
    }
  ) {
    id
    uid
    firstname
    lastname
    fullname
    url
    locationId
    email
    telephone
    availability
    absentCount
    isAdmin
    createdAt
    updatedAt
    InvoiceOption
    Company
    BtwNumber
  }
}

```
