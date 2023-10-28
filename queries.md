# Graphql Queries

- [Graphql Queries](#graphql-queries)
  - [Authorization](#authorization)
  - [Materials](#materials)
    - [materials(filters: , order: { field, direction }, searchString)](#materialsfilters--order--field-direction--searchstring)
    - [material(id)](#materialid)
    - [materialsByUserId(userId, filters: , order: { field, direction }, searchString)](#materialsbyuseriduserid-filters--order--field-direction--searchstring)
    - [createMaterial](#creatematerial)
    - [updateMaterial](#updatematerial)
    - [removeMaterial](#removematerial)
  - [Users](#users)
    - [users(filters, order: { field, direction }, searchString)](#usersfilters-order--field-direction--searchstring)
    - [user(id)](#userid)
    - [userByUid(uid)](#userbyuiduid)
    - [usersEmployeesAvailableByDate(date)](#usersemployeesavailablebydatedate)
    - [userIsAvailableTodayByUserId(userId)](#userisavailabletodaybyuseriduserid)
    - [userUpgradeToAdmin(id)](#userupgradetoadminid)
    - [updateUser](#updateuser)
    - [updateEmployeeRegister](#updateemployeeregister)
    - [removeUser](#removeuser)
    - [createStaff](#createstaff)
    - [createClient](#createclient)
  - [Locations](#locations)
    - [locations(order: { field, direction })](#locationsorder--field-direction-)
    - [locationsByUserId(userId)](#locationsbyuseriduserid)
    - [location(id)](#locationid)
    - [createLocation](#createlocation)
    - [updateLocation](#updatelocation)
    - [removeLocation](#removelocation)
  - [Mail](#mail)
    - [getMailTokenByToken(token)](#getmailtokenbytokentoken)
    - [removeAllMailTokensByUserId](#removeallmailtokensbyuserid)
  - [Absences](#absences)
    - [absences(filters: , order: { field, direction })](#absencesfilters--order--field-direction-)
    - [absencesByUserId(filters: , order: { field, direction })](#absencesbyuseridfilters--order--field-direction-)
    - [absence(id)](#absenceid)
    - [createAbsence](#createabsence)
    - [updateAbsence](#updateabsence)
    - [removeAbsence](#removeabsence)
  - [Schedules](#schedules)
    - [schedules(filters: , order: { field, direction })](#schedulesfilters--order--field-direction-)
    - [schedule(id)](#scheduleid)
    - [createSchedule](#createschedule)
    - [updateSchedule](#updateschedule)
    - [removeSchedule](#removeschedule)
  - [Appointments](#appointments)
    - [appointments(filters: , order: { field, direction })](#appointmentsfilters--order--field-direction-)
    - [appointment(id)](#appointmentid)
    - [createAppointment](#createappointment)
    - [updateAppointment](#updateappointment)
    - [removeAppointment](#removeappointment)

## Authorization

Most of queries and mutations require authorization. To authorize you need to pass `Authorization` header with `Bearer` token.

## Materials

```object
{
  id
  name
  user {
    # everything from user
  }
  isLoan
  serialNumber
  createdAt
  updatedAt
}
```

### materials(filters: , order: { field, direction }, searchString)

materials(filters: [String], order: { field: String, direction: String }, searchString: String)

Filters can be:

- `A` - available
- `NA` - not available
- `L` - loanable
- `NL` - not loanable

Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

Search by name

```graphql
query {
  materials(filters: ['A'], order: { field: "name", direction: ASC }, searchString: "search string") {
    id
    name
    user {
      # everything from user
    }
    isLoan
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
    user {
      # everything from user
    }
    isLoan
    serialNumber
    createdAt
    updatedAt
  }
}
```

### materialsByUserId(userId, filters: , order: { field, direction }, searchString)

materialsByUserId(userId: String, filters: [String], order: { field: String, direction: String }, searchString: String)

Filters can be:

- `A` - available
- `NA` - not available
- `L` - loanable
- `NL` - not loanable
  
Order can be:

- field = all fields from material model
- direction = `ASC` or `DESC`

Search by name

```graphql
query {
  materialsByUserId(
    userId: "651d55ade0e77efb23fdfe53", 
    filters: ['A'], 
    order: { field: "name", direction: DESC }) 
  {
    id
    name
    user {
      # everything from user
    }
    isLoan
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
      userId: "651d55ade0e77efb23fdfe53" # optional
      isLoan: false
      serialNumber: 123456789
    }
  ) {
    id
    name
    user {
      # everything from user
    }
    isLoan
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
      name: "Material 1" # optional
      isLoan: false # optional
      userId: "651d55ade0e77efb23fdfe53" # optional
      serialNumber: 123456789 # optional
    }
  ) {
    id
    name
    user {
      # everything from user
    }
    isLoan
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
    # everthing from locations
  }
  email
  telephone
  createdAt
  updatedAt
  absentCount
  invoiceOption
  company
  btwNumber
}
```

### users(filters, order: { field, direction }, searchString)

users(filters: [String], order: { field: String, direction: String }, searchString: String)

Filters can be:

- `A` - admin
- `E` - employee
- `C` - client
- `AV` - availability
- `NAV` - not availability
- `UID` - uid
- `NUID` - not uid

Order can be:

- field = all fields from user model
- direction = `ASC` or `DESC`

Search by fullname

```graphql	
query {
  users(filters: ["filter1", "filter2"], 
  order: { field: "fullname", direction: "ASC" }, 
  searchString: "search string") 
  {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
    # Additional fields for clients
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
  user(id: "651d55ade0e77efb23fdfe53") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
    # Additional fields for clients
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
  userByUid(uid: "651d55ade0e77efb23fdfe53") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
    # Additional fields for clients
    invoiceOption
    company
    btwNumber
  }
}

```

### usersEmployeesAvailableByDate(date)

usersEmployeesAvailableByDate(date: Date)

```graphql
query {
  usersEmployeesAvailableByDate(date: "2020-01-01") {
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
  }
}
```

### userIsAvailableTodayByUserId(userId)

userIsAvailableTodayByUserId(userId: String)

```graphql
query {
  userIsAvailableTodayByUserId(userId: "651d55ade0e77efb23fdfe53"){
    id
    uid
    locale
    role
    firstname
    lastname
    fullname
    url
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
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
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
  }
}
```

### updateUser

```graphql
mutation {
  updateUser(
    updateUserInput: {
      id: "xx"
      lastname: "xx" # optional
      firstname: "xx" # optional
      url: "xx" # optional
      uid: "xx" # optional
      locale: "xx" # optional
      locationIds: ["xx"] # optional
      email: "xx" # optional
      telephone: "xx" # optional
      # CLIENT ONLY 
      invoiceOption: "xx"  # optional
      company: true # optional
      btwNumber: "xx" # optional
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
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
    # Additional fields for clients
    invoiceOption
    company
    btwNumber
  }
}
```

### updateEmployeeRegister
  
```graphql
mutation {
  updateEmployeeRegister(
    updateUserInput: {
      id: "xx"
      lastname: "xx" # optional
      firstname: "xx" # optional
      uid: "xx" # optional
      locale: "xx" # optional
      email: "xx" # optional
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
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
  }
}
```

### removeUser

removeUser(id: String)

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
      telephone: "xx" # optional
      locale: "en" # optional
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
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for staff
    absentCount
  }
}
```

### createClient

```graphql
mutation {
  createClient(
    createClientInput: {
      uid: "x" 
      firstname: "x"
      lastname: "xx"
      email: "x@x.x"
      locale: "en" # optional
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
    email
    telephone
    createdAt
    updatedAt
    locations {
      # Include fields from the Location entity
    }
    # Additional fields for clients
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
  userId
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
    userId
    address
    createdAt
    updatedAt
  }
}
```

### locationsByUserId(userId)

locationsByUserId(userId: String)

```graphql
query {
  findAllByUserId(userId: "6522bd1cfabcb1f1d63dd63a") {
    id
    userId
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
    userId
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
      userId: "xx"
    }
  ) {
    id
    address
    userId
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
    userId
    address
    createdAt
    updatedAt
  }
}
```

### removeLocation

```graphql
mutation {
  removeLocation(id: "6522bd1cfabcb1f1d63dd63a")
}
```

## Mail

```object
{
  id
  token
  expirationDate
  userId
  createdAt
}
```	

### sendEmailToNewEmployeeById(userId)

sendEmailToNewEmployeeById(userId: String)

```graphql
query {
  sendEmailToNewEmployeeById(userId: "6522bd1cfabcb1f1d63dd63a")
}
```

### getMailTokenByToken(token)

getMailTokenByToken(token: String)

```graphql
 query {
    getMailTokenByToken(token: "6522bd1cfabcb1f1d63dd63a") {
      id
      userId
      token
      expirationDate
      createdAt
    }
  }
```

### removeAllMailTokensByUserId

```graphql
mutation {
  removeAllMailTokensByUserId(userId: "6522bd1cfabcb1f1d63dd63a")
}
```

## Absences

```object
{
  id
  user{
    # everything from user
  }
  description
  type
  startDate
  endDate
  totalDays
  createdAt
  updatedAt
}
```

start and end date are in format `YYYY-MM-DD`

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
  absences(filters: ['S'], order: { field: "startDate", direction: ASC }) {
    id
    user{
      # everything from user
    }
    description
    type
    startDate
    endDate
    totalDays
    createdAt
    updatedAt
  }
}
```

### absencesByUserId(filters: , order: { field, direction })

absencesByUserId(personId: String, filters: [String], order: { field: String, direction: String })

Filters can be:
- `S` - Sick
- `V` - Vacation
- `O` - Other

Order can be:
- field = all fields from absence model
- direction = `ASC` or `DESC`

```graphql
query {
  absencesByUserId(
    personId: "6522bd1cfabcb1f1d63dd63a", 
    filters: ['S'], 
    order: { field: "startDate", direction: ASC }) 
  {
    id
    user{
      # everything from user
    }
    description
    type
    startDate
    endDate
    totalDays
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
      # everything from user
    }
    description
    type
    startDate
    endDate
    totalDays
    createdAt
    updatedAt
  }
}
```

### createAbsence

Type:
- Sick
- Vacation
- Other

```graphql
mutation {
  createAbsence(
    createAbsenceInput: {
      userId: "6522bd1cfabcb1f1d63dd63a"
      startDate: "2020-01-01" # YYYY-MM-DD
      endDate: "2020-01-01" # YYYY-MM-DD
      type: "Sick"
      description: "x" # optional
    }
  ) {
    id
    user{
      # everything from user
    }
    description
    type
    startDate
    endDate
    totalDays
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
      userId: "6522bd1cfabcb1f1d63dd63a" # optional
      startDate: "2020-01-01" # YYYY-MM-DD # optional
      endDate: "2020-01-01" # YYYY-MM-DD # optional
      type: "S" # optional
      description: "x" # optional
    }
  ) {
    id
    user{
      # everything from user
    }
    description
    type
    startDate
    endDate
    totalDays
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

## Schedules

```object
{
  id
  appointments{
    # everything from appointment
  }
  employees{
    # everything from user
  }
  materials{
    # everything from material
  }
  finalDate
  createdBy
  createdAt
  updatedAt
}
```

### schedules(filters: , order: { field, direction })

schedules(filters: [String], order: { field: String, direction: String })

Filters can be:

- `FD` - Final date
- `NFD` - Not final date
- `P` - Past
- `F` - Future
- `T` - Today

Order can be:

- field = all fields from schedule model
- direction = `ASC` or `DESC`


```graphql
query {
  schedules(filters: ['P'], order: { field: "startDate", direction: ASC }) {
    id
    appointments{
      # everything from appointment
    }
    employees{
      # everything from user
    }
    materials{
      # everything from material
    }
    finalDate
    createdBy
    createdAt
    updatedAt
  }
}
```

### schedule(id)

schedule(id: String)

```graphql
query {
  schedule(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    appointments{
      # everything from appointment
    }
    employees{
      # everything from user
    }
    materials{
      # everything from material
    }
    finalDate
    createdBy
    createdAt
    updatedAt
  }
}
```

### createSchedule

```graphql
mutation {
  createSchedule(
    createScheduleInput: {
      appointmentIds: ["xx", "xx"]
      employeeIds: ["xx", "xx"]
      materialIds: ["xx", "xx"]
      finalDate: "2020-01-01" # YYYY-MM-DD
      createdBy: "xx" 
    }
  ) {
    id
    appointments{
      # everything from appointment
    }
    employees{
      # everything from user
    }
    materials{
      # everything from material
    }
    finalDate
    createdBy
    createdAt
    updatedAt
  }
}
```

### updateSchedule

```graphql
mutation {
  updateSchedule(
    updateScheduleInput: {
      id: "6522bd1cfabcb1f1d63dd63a"
      appointmentIds: ["xx", "xx"] # optional
      employeeIds: ["xx", "xx"] # optional
      materialIds: ["xx", "xx"] # optional
      finalDate: "2020-01-01" # YYYY-MM-DD # optional
      createdBy: "xx" # optional
    }
  ) {
    id
    appointments{
      # everything from appointment
    }
    employees{
      # everything from user
    }
    materials{
      # everything from material
    }
    finalDate
    createdBy
    createdAt
    updatedAt
  }
}
```

### removeSchedule

```graphql
mutation {
  removeSchedule(id: "6522bd1cfabcb1f1d63dd63a")
}
```

## Appointments

```object
{
  id
  user{
    # everything from user
  }
  location{
    # everything from location
  }
  price
  type
  startProposedDate
  endProposedDate
  isScheduled
  finalDate
  isDone
  description
  priority
  createdAt
  updatedAt
}
```

### appointments(filters: , order: { field, direction })

appointments(filters: [String], order: { field: String, direction: String })

Filters can be:

- `M` - Maintenance
- `R` - Repair
- `D` - Done
- `ND` - Not Done
- `S` - Scheduled
- `NS` - Not Scheduled
- `P` - Priority
- `NP` - Not Priority

Order can be:

- field = all fields from appointment model
- direction = `ASC` or `DESC`

```graphql
query {
  appointments(filters: ['M'], order: { field: "startDate", direction: ASC }) {
    id
    user{
      # everything from user
    }
    location{
      # everything from location
    }
    price
    type
    startProposedDate
    endProposedDate
    isScheduled
    finalDate
    isDone
    description
    priority
    createdAt
    updatedAt
  }
}
```

### appointment(id)

appointment(id: String)

```graphql
query {
  appointment(id: "6522bd1cfabcb1f1d63dd63a") {
    id
    user{
      # everything from user
    }
    location{
      # everything from location
    }
    price
    type
    startProposedDate
    endProposedDate
    isScheduled
    finalDate
    isDone
    description
    priority
    createdAt
    updatedAt
  }
}
```

### createAppointment

Type:
- Maintenance
- Repair

```graphql
mutation {
  createAppointment(
    createAppointmentInput: {
      userId: "xx"
      locationId: "xx"
      type: "Maintenance"
      startProposedDate: "2020-01-01" # YYYY-MM-DD
      endProposedDate: "2020-01-01" # YYYY-MM-DD
      isScheduled: true
      isDone: true
      description: "x" 
      priority: true
    }
  ) {
    id
    user{
      # everything from user
    }
    location{
      # everything from location
    }
    price
    type
    startProposedDate
    endProposedDate
    isScheduled
    finalDate
    isDone
    description
    priority
    createdAt
    updatedAt
  }
}
```

### updateAppointment

```graphql
mutation {
  updateAppointment(
    updateAppointmentInput: {
      id: "6522bd1cfabcb1f1d63dd63a"
      locationId: "xx" # optional
      price: 123 # optional
      type: "Maintenance" # optional
      startProposedDate: "2020-01-01" # YYYY-MM-DD # optional
      endProposedDate: "2020-01-01" # YYYY-MM-DD # optional
      finalDate: "2020-01-01" # YYYY-MM-DD # optional
      isScheduled: true # optional
      description: "x" # optional
      priority: true # optional
      isDone: true # optional
    }
  ) {
    id
    user{
      # everything from user
    }
    location{
      # everything from location
    }
    price
    type
    startProposedDate
    endProposedDate
    isScheduled
    finalDate
    isDone
    description
    priority
    createdAt
    updatedAt
  }
}
```

### removeAppointment

```graphql
mutation {
  removeAppointment(id: "6522bd1cfabcb1f1d63dd63a")
}
```








