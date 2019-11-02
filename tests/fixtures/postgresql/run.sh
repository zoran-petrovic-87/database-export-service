docker build -t postgresql_test .
docker run \
-p 5432:5432 \
-e "POSTGRES_PASSWORD=test" \
-e "POSTGRES_USER=test" \
-e "POSTGRES_DB=test" \
-e "POSTGRES_PORT=5432" \
postgresql_test