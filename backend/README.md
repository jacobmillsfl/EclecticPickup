# TAF Backend



## The Back End Stack

API               - Flask
DB                - MySQL
O/RM              - SQLAlchemy
Schema Management - Flask Migrate

## Schema Management
Flask-Migrate is an extension for Flask that helps manage database migrations for SQLAlchemy. It allows you to easily create, apply, and manage database schema changes, including adding new tables, altering existing tables, or dropping tables, all while preserving existing data.

Here's a basic overview of how Flask-Migrate works:

1. **Initialization**: First, you set up Flask-Migrate to work with your Flask app. You initialize it to create a migrations directory and configure it to work with SQLAlchemy.

2. **Generating Migrations**: When you make changes to your SQLAlchemy models (e.g., adding new tables or modifying existing ones), you generate a migration script using Flask-Migrate's `migrate` command. This command inspects the current state of your database models and generates a migration script that captures the changes needed to update the database schema.

3. **Applying Migrations**: After generating the migration script, you use the `upgrade` command to apply these changes to the database. This command executes the migration script, modifying the database schema to match the changes made in your models.

To use Flask-Migrate for managing your database schema:

1. **Installation**: Install Flask-Migrate via pip:

    ```bash
    pip install Flask-Migrate
    ```

2. **Initialization**: Initialize Flask-Migrate in your Flask app. Typically, you'd use a command like this in your terminal:

    ```bash
    flask db init
    ```

    This command initializes Flask-Migrate and creates a `migrations` directory in your project.

3. **Generate Migrations**: Whenever you make changes to your models, generate a migration script:

    ```bash
    flask db migrate -m "Description of changes"
    ```

    This command inspects the current state of your models and generates a migration script based on the changes made since the last migration. The `-m` flag allows you to add a description for the migration, which can be helpful for documentation.

4. **Apply Migrations**: After generating the migration script, apply it to your database:

    ```bash
    flask db upgrade
    ```

    This command applies the generated migration script to the database, making the necessary changes to the schema.

By following these steps, Flask-Migrate helps you manage incremental changes to your database schema while retaining existing data. It's a powerful tool for maintaining consistency between your SQLAlchemy models and the actual database structure.

## Server Configuration

This solution is designed to have `nginx` running externally.
`nginx` can forward traffic to docker containers using a reverse proxy.
The best way to set this up initially would be to create an entry in
`/etc/nginx/sites-available/` that includes the following configuration
to reverse proxy app and api traffic to the docker containers.
```
# Complete Nginx Docker reverse proxy config file
server {
  listen 80;
  listen [::]:80;
  server_name tafers.net;

  location / {
    index index.html index.htm;
    proxy_pass http://0.0.0.0:3000/;
  }
}

server {
  listen 80;
  listen [::]:80;
  server_name api.tafers.net;

  location / {
    index index.html index.htm;
    proxy_pass http://0.0.0.0:8080/;
  }
}
```