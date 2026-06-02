#!/bin/bash

set -e

DB_NAME="edupay"
DB_USER="edupay_user"
DB_HOST="localhost"
MIGRATIONS_DIR="../server/migrations"

echo "Running migrations from: $MIGRATIONS_DIR"

for file in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
    version=$(basename "$file")

    echo ""
    echo "Applying migration: $version"

    already_applied=$(psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT 1 FROM schema_migrations WHERE version = '$version'")

    if [ "$already_applied" = "1" ]; then
        echo "Skipping already applied migration: $version"
        continue
    fi

    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$file"

    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c \
        "INSERT INTO schema_migrations (version) VALUES ('$version');"

    echo "Successfully applied: $version"
done

echo ""
echo "All migrations completed."
