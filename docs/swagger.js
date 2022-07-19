const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "FitMate API",
            description:
                "Node.js Swaager 활용 RestFul API 클라이언트 UI",
        },
        servers: [
            {
                url: "http://localhost:8000", // 요청 URL
            },
        ],
    },
    apis: ["./docs/model.yaml", "./routes/v1/*.js", "./routes/v1/*/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }