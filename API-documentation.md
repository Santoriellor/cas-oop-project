# API data transfer objects (DTOs) definintion
## Authentication relevant DTOs:
### API endpoint for registering a new user POST :
#### JSON format :
1) Request :
   {
   "email": "user@example.com",
   "username": "john_doe",
   "password": "securePassword123"
   }
2) Response :
   {
   "token": "jwt-token-string"
   }

   Error ->
   {
   "error": "Email already in use"
   }
   or
   {
   "error": "Username already in use"
   }

### API endpoint checking email availability GET :
1) Response :
{
"available": true
}
or
{
"available": false
}

### API endpoint checking username availability GET :
1) Response :
{
"available": true
}
or
{
"available": false
}

### API endpoint for authenticating a user POST :
#### JSON format :
1) Request :
   {
   "email": "user@example.com",
   "password": "securePassword123"
   }
2) Response :
   {
   "token": "jwt-token-string"
   }

   Error ->
   {
   "error": "Invalid credentials"
   }

### API endpoint for authenticated user GET (/me) :
#### JSON format :
1) Response :
   {
   "id": "550e8400-e29b-41d4-a716-446655440000",
   "email": "jane.doe@example.com",
   "username": "janedoe",
   "roles": ["ROLE_USER"],
   "createdAt": "2025-09-01T10:15:30+02:00",
   "lastLogin": "2025-12-22T08:41:12+01:00"
   }

Not authenticated : 401 Unauthorized

## Courses relevant DTOs:
### API endpoint for getting courses :
JSON format : // to be defined
### API endpoint for getting a specific course detail :
JSON format : // to be defined
## Documents relevant DTOs:
### API endpoint for getting all documents for a specific course :
JSON format : // to be defined
### API endpoint for getting all documents for a specific user :
JSON format : // to be defined
## Certifications relevant DTOs:
### API endpoint for getting certifications for a specific user :
JSON format : // to be defined