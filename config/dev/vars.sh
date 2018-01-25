export PROJECT_NAME=cb_local_dev_compose
export ENV_TYPE="development"

export WEB_PORT=8080
export WEB_LOCAL_PORT=8080
export SERVER_PORT=3000
export SERVER_LOCAL_PORT=3000
export WEB_TO_SERVER_URL=localhost:${SERVER_LOCAL_PORT}
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_DBNAME=postgres
export DB_PORT=5432
export DB_LOCAL_PORT=5433
export SERVER_TO_DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@database:${DB_PORT}/${DB_DBNAME}"
export SERVER_CMD='/bin/bash -c "cd /data/server;npm install; npm run start"'
export WEB_CMD='/bin/bash -c "cd /data/web_front; npm install; npm run dev"'
