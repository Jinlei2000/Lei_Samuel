# Graphql Queries

<!-- make here a contents table -->

1. [Materials](#materials)
   - [materials](#materials-1)
   - [material(id: String)](#materialid-string)
   - [createMaterial](#creatematerial)
   - [updateMaterial](#updatematerial)

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
