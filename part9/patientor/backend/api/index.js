"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const utils_1 = require("./utils");
const express_1 = __importDefault(require("express"));
const diagnosis_1 = __importDefault(require("./routes/diagnosis"));
const patient_1 = __importDefault(require("./routes/patient"));
const node_path_1 = __importDefault(require("node:path"));
const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = node_path_1.default.join(__dirname, '../public');
const app = (0, express_1.default)();
app.use(express_1.default.static(PUBLIC_DIR));
app.use(express_1.default.json());
app.use((req, _res, next) => {
    console.log(`${req.method}: ${req.originalUrl}, Body: ${JSON.stringify(req.body, null, 2)}`);
    next();
});
app.get('/api/ping', (_req, res) => {
    res.send('pong');
});
app.use('/api/diagnoses', diagnosis_1.default);
app.use('/api/patients', patient_1.default);
app.use((req, res, next) => {
    // Forward any GET request to the client-side routing
    if (req.method === 'GET') {
        res.sendFile(`${PUBLIC_DIR}/index.html`);
    }
    else
        next();
});
app.use((error, _req, res, _next) => {
    const toJsonError = (e) => ({ error: { message: e.message } });
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({ error: error.issues[0] });
    }
    else if (error instanceof utils_1.AppError) {
        res.status(error.statusCode).json(toJsonError(error));
    }
    else if (error instanceof Error) {
        let statusCode;
        if ('statusCode' in error)
            statusCode = error.statusCode;
        else if ('status' in error)
            statusCode = error.status;
        if ((0, utils_1.isNumber)(statusCode)) {
            res.status(statusCode).json(toJsonError(error));
        }
        else {
            res.status(500).json(toJsonError(new Error('something went wrong')));
        }
    }
});
if (!process.env.SERVERLESS_FUNCTION) {
    app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
}
exports.default = app;
