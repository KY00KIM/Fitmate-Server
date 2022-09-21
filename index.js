const express = require("express");
const app = express();
const path = require('path');
const logger = require('./config/winston');
const morgan = require('morgan');
const { registerPush } = require('./controller/push');
require("dotenv").config();
const { swaggerUi, specs } = require("./docs/swagger");

const helmet = require('helmet');
const combined = ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

// 기존 combined 포멧에서 timestamp만 제거
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : combined;

// NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발
console.log(morganFormat);

const connect = require('./utils/connection');
const router = require('./routes');

const cors = require('cors');
app.use(cors());

// JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// morgan 로그 설정 
app.use(morgan(morganFormat, { stream: logger.stream }));

// const cspOptions = {
//     directives: {
//         // 기본 옵션을 가져옵니다.
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//
//         // 구글 API 도메인과 인라인된 스크립트를 허용합니다.
//         "script-src": ["'self'", "*.googleapis.com", "'unsafe-inline'"],
//     }
// }

// 보안 설정
app.use(helmet());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// MongoDB 연결
connect();
registerPush();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);


const port = process.env.PORT || 8000


app.listen(port, () => {
    process.send('ready');
    console.log(`Server Listening on ${port}`);
});

process.on('SIGINT', function () {
    app.close(function () {
        console.log('server closed');
        process.exit(0)
    })
});