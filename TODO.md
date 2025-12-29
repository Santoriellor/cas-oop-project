# TODO List
# API endpoints
## Authentication relevant features:
### Minimum viable product:
-[X] API endpoint for getting a user profile (/me) → Rémy
-[X] API endpoint for registering a new user → Rémy
-[X] API endpoint for checking email availability → Rémy
-[X] API endpoint for checking username availability → Rémy
-[X] API endpoint for authenticating a user → Rémy
## Courses relevant features:
### Minimum viable product:
-[X] API endpoint for getting all courses → Jonathan
-[ ] API endpoint for getting courses (filtering and sorting allowed, if possible paginating)
-[ ] API endpoint for getting a specific course detail
### Future features: teacher dashboard
-[X] API endpoint for creating a new course (teacher only) → Jonathan
-[X] API endpoint for updating a specific course (teacher only) → Jonathan
-[X] API endpoint for deleting a specific course (teacher only) → Jonathan

## Documents relevant features:
### Minimum viable product:
-[X] API endpoint for getting all documents for a specific course → Jonathan
-[ ] API endpoint for getting all documents for a specific user
### Future features: teacher dashboard
-[X] API endpoint for uploading a new document (teacher only) → Jonathan
-[ ] API endpoint for deleting a specific document (teacher only)

## Certifications relevant features:
### Minimum viable product:
-[ ] API endpoint for getting certifications for a specific user (filtering and sorting allowed, if possible paginating)
### Future features: teacher dashboard
-[ ] API endpoint for creating a new certification (teacher only)
-[ ] API endpoint for updating a specific certification (teacher only)
-[ ] API endpoint for deleting a specific certification (teacher only)

# API data transfer objects (DTOs) definintion
## Authentication relevant DTOs:
### API endpoint for registering a new user :
Defined in [API-documentation](API-documentation.md)

### API endpoint checking email availability :
Defined in [API-documentation](API-documentation.md)

### API endpoint checking username availability :
Defined in [API-documentation](API-documentation.md)

### API endpoint for authenticating a user :
Defined in [API-documentation](API-documentation.md)

### API endpoint for authenticated user (/me)
Defined in [API-documentation](API-documentation.md)

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

# Tests
## Unit tests
### General app functionality
-[ ] Display of welcoming page
-[ ] Display of error pages (404, 500, etc.)
-[ ] Display of navigation bar (if needed)
### Pro feature
-[X] Unit tests for authentication → Rémy
-[ ] Unit tests for courses
-[ ] Unit tests for documents
-[ ] Unit tests for certifications
## Integration tests
### Pro feature
-[X] Integration tests for authentication → Rémy
-[ ] Integration tests for courses
-[ ] Integration tests for documents
-[ ] Integration tests for certifications