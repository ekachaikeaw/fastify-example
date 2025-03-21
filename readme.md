# Fastify Server with Plugins, Hooks, and Decorators

This project demonstrates how to set up a Fastify server with structured plugins, logging, graceful shutdown, decorators, hooks, and validation schemas.

## Features

### 1. Basic Server with `pino-pretty` Logger
- Uses `pino-pretty` for readable logs.
- Root route (`/`) responds with `{ message: "hello world" }`.
- Option object configuration included.
- Defines body type in `FastifyRequest` generics.

### 2. Graceful Shutdown
- Handles shutdown signals to close database connections and cleanup.

### 3. Plugins
- **Routes Plugin:** Manages API routes.
- **Database Plugin:** Handles database connection.
- **Custom Plugin:** Adds custom functionality.

### 4. Decorators
- **FastifyRequest:** Adds custom properties/methods.
- **FastifyInstance:** Enhances Fastify instance.
- **Type Definitions:** Ensures TypeScript support.

### 5. Hooks
- **onRequest Hook:** Runs before request processing.
- **onResponse Hook:** Runs after response is sent.
- **Nested Hooks:** Hooks applied within specific routes.

### 6. Validation Schema
- Defines `createUserSchema` for request validation.
- Adds schema to route options.
- Specifies response schema for structured responses.

## Installation
```sh
npm install
