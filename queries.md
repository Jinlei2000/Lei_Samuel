# Graphql Queries

1. [Materials](#materials)
   - [materials](#materials-1)
   - [material](#materialid-string)
   - [materialsByPersonId](#materialsByPersonIdpersonId-string-filters-liststring-order--field-string-direction-string-)
   - [createMaterial](#creatematerial)
   - [updateMaterial](#updatematerial)
   - [removeMaterial](#removematerial)

## Authorization

Most of queries and mutations require authorization. To authorize you need to pass `Authorization` header with `Bearer` token.

## Materials

### materials

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

### material(id: String)

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

### materialsByPersonId(personId: String, filters: List<String>, order: { field: String, direction: String })

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
