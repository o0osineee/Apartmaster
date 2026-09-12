#!/bin/bash
# Runs once, only when the mysql container starts with an empty data volume.
# Imports schema, migrations, and sample data in filename order.
set -e

for f in /docker-entrypoint-initdb.d/sql/*.sql; do
  echo "apartmaster init: importing $f"
  mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" < "$f"
done

echo "apartmaster init: done seeding database and hashing sample passwords."
