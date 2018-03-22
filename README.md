# Massdrop JobQueue API

A RESTful API for a job queue whose workers fetch data from a URL and store the results in a database.

## Setup
  $ npm install
  $ npm start
  
## JSON Objects returned by API:

### Jobs

```JSON
{
  "status": "pending",
  "_id": 5,
  "target_url": "http://www.google.com",
  "createdAt": "2018-03-21T23:23:15.061Z",
  "updatedAt": "2018-03-21T23:23:15.067Z",
  "target_html": "<html>HTML</html>"
}

### Errors and Status Codes

If a given URL does not exist or is not formatted correctly (eg missing http://), the returned job's status will show as 'failed.'

Example:
```JSON
{
  "status": "failed: Invalid URL",
  "_id": 10,
  "target_url": "http://www.google1.com"
}

### Other codes:

404 if the requested resource cannot be found.
440 for a request that does not contain a target_url.
500 for miscellaneous errors.

## API Endpoints

`GET /api/jobs`

Returns an array of all jobs in the database.

`POST /api/jobs`

Example request body:
```JSON
{
  "target_url": "http://www.google.com"
}

Returns the job.

`GET /api/jobs/:job`

Returns a job.

`PUT /api/jobs/:job`

Example request body:
```JSON
{
  "target_url": "https://www.wikipedia.org"
}

Returns the updated job.

`DELETE /api/jobs/:job`

Returns a message saying the deletion was successful or an error.
