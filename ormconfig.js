"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
require("./src/boilerplate.polyfill");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const user_subscriber_1 = require("./src/entity-subscribers/user-subscriber");
const snake_naming_strategy_1 = require("./src/snake-naming.strategy");
dotenv_1.default.config();
exports.dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new snake_naming_strategy_1.SnakeNamingStrategy(),
    subscribers: [user_subscriber_1.UserSubscriber],
    entities: [
        'src/modules/**/*.entity{.ts,.js}',
        'src/modules/**/*.view-entity{.ts,.js}',
    ],
    migrations: ['src/database/migrations/*{.ts,.js}'],
});
//# sourceMappingURL=ormconfig.js.map