# Docker Hub Scrape

This is just a quick goober to scrape the DockerHub search API.  The DockerHub
search API is sitting behind some intermediate service which seems to limit the
result set to around 2500 search results, no matter what youre looking for.

It's possible that some combination of searches could give you a full result
set. DockerHub claims that there are more than 3M results that are actually
public on their page, but it's not clear if that's true or not. Anyway that
feels like a pretty fun academic exercise. I'll totally accept PRs for anyone
who can figure it out.

## Getting Started

```
$ npm install
$ createdb scrape_dev && psql scrape_dev < schema.sql
$ cp database.json.example database.json # and edit 
$ node app.js
```

