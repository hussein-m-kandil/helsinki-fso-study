"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils");
const patientService_1 = __importDefault(require("../services/patientService"));
const patientRouter = (0, express_1.Router)();
patientRouter.get('/', (_req, res) => {
    res.json(patientService_1.default.getAllPatients());
});
patientRouter.get('/:id', (req, res) => {
    const patient = patientService_1.default.findOnePatientById(req.params.id);
    if (patient)
        res.json(patient);
    else
        res.status(404).json({ error: { message: 'patient not found' } });
});
patientRouter.post('/', (req, _res, next) => {
    try {
        req.body = utils_1.NewPatientSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
}, (req, res) => {
    res.json(patientService_1.default.addOnePatient(req.body));
});
patientRouter.post('/:id/entries', (req, res, next) => {
    try {
        const newEntry = utils_1.NewEntrySchema.parse(req.body);
        res.json(patientService_1.default.addEntry(req.params.id, newEntry));
    }
    catch (error) {
        next(error);
    }
});
exports.default = patientRouter;
