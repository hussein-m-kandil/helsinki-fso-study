"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, _res, next) => {
    console.log(`${req.method}: ${req.originalUrl}\nBody: ${req.body}`);
    next();
});
app.get('/ping', (_req, res) => {
    res.send('pong');
});
app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
