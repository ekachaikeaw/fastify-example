1. create basic server with pino-pretty logger
    - create root route with object with message: hello world
    -- create with option object 
    -- define body type of FastifyRequest from generic itself with Body field
2. create graceful shutdown
3. create plugin
    - routes
    - database
    - custom

4. create Decorator
    |- decorate to FastifyRequest
    |- decorate to FastifyInstance
      |- add type definition
5. create Hook
    |- onRequest
    |- onResponse
    |- nested hook in routes

6. Validation Schema
    |- create createUserSchema
    |- add to option object at end point
    |- define response schema