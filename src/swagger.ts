import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 3000;
const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            version: "1.0.0",
            description: "API documentation for Express and MySQL with TypeScript",
        },
        servers: [{ url: `http://localhost:${PORT}` }]
    },
    apis: ["./src/server.ts"], // Location of API routes
};
const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };

