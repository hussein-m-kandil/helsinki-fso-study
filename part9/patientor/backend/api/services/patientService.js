"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const patients_1 = __importDefault(require("../data/patients"));
exports.default = {
    getAllPatients() {
        return patients_1.default.map((_a) => {
            var { ssn: _ } = _a, patient = __rest(_a, ["ssn"]);
            return patient;
        });
    },
    findOnePatientById(id) {
        return patients_1.default.find((p) => p.id === id);
    },
    addOnePatient(newPatient) {
        const addedPatient = Object.assign({ id: (0, uuid_1.v4)() }, newPatient);
        if (!addedPatient.entries)
            addedPatient.entries = [];
        patients_1.default.push(addedPatient);
        return addedPatient;
    },
    addEntry(patientId, entry) {
        const patient = this.findOnePatientById(patientId);
        if (!patient) {
            throw new utils_1.AppError('Validation Error', 'invalid patient id', 400);
        }
        const addedEntry = Object.assign({ id: (0, uuid_1.v4)() }, entry);
        patient.entries.push(addedEntry);
        return addedEntry;
    },
};
