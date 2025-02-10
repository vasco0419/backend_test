"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const PORT = process.env.PORT || 3000;
const options = {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
