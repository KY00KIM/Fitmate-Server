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
            {
                url: "http://localhost:8000/v1"
            },
        ],
        tags: [
            {
                name: "users",
                description: "Operations about users"
            },
            {
                name: "posts",
                description: "Operations about posts"
            },
            {
                name: "matching",
                description: "Operation check matching"
            },
            {
                name: "reviews",
                description: "Operation about reviews"
            },
            {
                name: "push",
                description: "Operation about push notification"
            },
            {
                name: "location",
                description: "Operation about locations"
            },
            {
                name: "fitnesscenter",
                description: "Operation about fitnesscenters"
            },
            {
                name: "appointments",
                description: "Operation about appointments"
            },
            {
                name: "fitnesspart",
                description: "Operation about fitnesspart"
            }
        ],
    },
    apis: ["./docs/*.yaml"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }