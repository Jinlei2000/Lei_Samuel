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
  - [Staffs](#staffs)
    - [staffs(filters: , order: { field, direction })](#staffsfilters--order--field-direction-)
    - [staff(id)](#staffid)
    - [staffsBySearchString(searchString)](#staffsbysearchstringsearchstring)
    - [staffUpgradeToAdmin(id)](#staffupgradetoadminid)
    - [createStaff](#createstaff)
    - [updateStaff](#updatestaff)
    - [removeStaff](#removestaff)
  - [Locations](#locations)
    - [locations](#locations-1)
    - [location(id)](#locationid)
    - [createLocation](#createlocation)
    - [updateLocation](#updatelocation)

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

## Staffs
### staffs(filters: , order: { field, direction })

staffs(filters: [String], order: { field: String, direction: String })

Filters can be:

- `A` - admin
- `E` - employee

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

```graphql	
query {
  staffs {
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

### staff(id)

staff(id: String)

```graphql
query {
  staff(id: "6522bd1cfabcb1f1d63dd63a") {
    id
  }
}
```


### staffsBySearchString(searchString)

staffsBySearchString(searchString: String)

```graphql
query {
  staffsBySearchString(searchString: "x") {
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

### staffUpgradeToAdmin(id)

staffUpgradeToAdmin(id: String)

can be used only by admin user to upgrade staff to admin

```graphql
mutation {
  staffUpgradeToAdmin(id: "6522bd1cfabcb1f1d63dd63a") {
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


### createStaff

```graphql
mutation {
  createStaff(
    createStaffInput: {
      firstname: "x"
      lastname: "xx"
      email: "x@x.x"
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

### updateStaff

```graphql
mutation {
  updateStaff(
    updateStaffInput: {
      id: "6522bd1cfabcb1f1d63dd63a"
      firstname: "x"
      lastname: "xx"
      email: "x@x.x"
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

### removeStaff

```graphql
mutation {
  removeStaff(id: "6522bd1cfabcb1f1d63dd63a")
}
```

## Locations

### locations

```graphql
query {
  locations {
    id
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
    }
  ) {
    id
    address
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
    address
    createdAt
    updatedAt
  }
}
```
