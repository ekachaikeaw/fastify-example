import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyPostgres from "@fastify/postgres";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

async function userRoutes(fastify: FastifyInstance) {
  fastify.addHook(
    "onRequest",
    async (req: FastifyRequest, reply: FastifyReply) => {
      fastify.log.info("Got request");
    }
  );

  fastify.addHook(
    "onResponse",
    async (req: FastifyRequest, reply: FastifyReply) => {
      fastify.log.info(`Responding: ${reply.elapsedTime}`);
    }
  );

  fastify.addSchema({
    $id: "createUserSchema",
    type: "object",
    required: ["name"],
    properties: {
      name: {
        type: "string",
      },
    },
  });

  fastify.post("/", {
    schema: {
      body: { $ref: "createUserSchema#" },
      // กำหนด schema สำหรับ response 
      response: {
        201: {
          type: 'object',
          properties: {
            name: { type: 'string'},
            age: { type: 'number'}
          }  
        }
      }
    },
    handler: async (
      // กำหนด field ให้ body ผ่าน FastifyRequest interface(generic)
      req: FastifyRequest<{
        Body: {
          name: string;
          age: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const body = req.body;
      // const user = req.user;

      return reply.code(201).send(body);
    },
  });

  fastify.log.info("user routes registered");
}

fastify.get("/err/:age", {
  handler: async (
    req: FastifyRequest<{
      Params: {
        age: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    const age = req.params.age;
    return { age };
  },
});

async function customPostgres(fastify: FastifyInstance) {
  fastify.register(fastifyPostgres, {
    connectionString: "postgres://postgres:123456@localhost:5433/fastifydb",
  });

  fastify.ready(async () => {
    try {
      const res = await fastify.pg.query("SELECT 1");
      if (res.rowCount) {
        fastify.log.info("connected to database");
      } else {
        fastify.log.warn("database connection might be inactive");
      }
    } catch (error) {
      fastify.log.error("database connection check failed", error);
      process.exit(1);
    }
  });
}

declare module "fastify" {
  export interface FastifyRequest {
    user: {
      name: string;
    };
  }

  export interface Fastify {
    signJWT: () => string;
    verifyJWT: () => {
      name: string;
    };
  }
}

fastify.decorate("signJWT", () => {
  return "signedJWT";
});
fastify.decorate("verifyJWT", () => {
  return {
    name: "Tome",
  };
});
fastify.decorateRequest("user", null);
fastify.addHook(
  "preHandler",
  async (req: FastifyRequest, reply: FastifyReply) => {
    req.user = {
      name: "jame",
    };
  }
);

fastify.register(customPostgres);
fastify.register(userRoutes, { prefix: "/api/users" });

async function main() {
  try {
    await fastify.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});
main();
