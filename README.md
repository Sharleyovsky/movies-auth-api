# movies-auth-api

### Prerequisites
1. Docker
2. Docker Compose

### Installation
1. Get your api key from [omdb](https://omdbapi.com/apikey.aspx).
2. Clone this repo.
```bash
git clone https://github.com/Sharleyovsky/movies-api-express.git
```
3. Enter the project's directory in a terminal and enter the command provided below to start the services.
```bash
DB_PORT=27017 DB_USER=admin DB_PASS=secretpass JWT_SECRET=secret OMDB_API_KEY=YOUR_API_KEY docker-compose -f docker-compose.yml up --build
```

### Documentation
Documentation is available under the ``localhost:4000/swagger``  endpoint after successfully running movies service.


