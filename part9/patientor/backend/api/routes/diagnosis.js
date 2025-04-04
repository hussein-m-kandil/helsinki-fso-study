"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const diagnosisService_1 = __importDefault(require("../services/diagnosisService"));
const diagnosisRouter = (0, express_1.Router)();
diagnosisRouter.get('/', (_req, res) => {
    res.json(diagnosisService_1.default.getAllDiagnoses());
});
exports.default = diagnosisRouter;
