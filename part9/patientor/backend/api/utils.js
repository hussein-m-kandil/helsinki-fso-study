"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.NewEntrySchema = exports.NewPatientSchema = exports.AppError = void 0;
const types_1 = require("./types");
const zod_1 = __importDefault(require("zod"));
class AppError extends Error {
    constructor(name, msg, statusCode) {
        super(msg);
        this.name = name;
        this.statusCode = statusCode;
    }
    toString() {
        return `${this.name}: ${this.message}`;
    }
}
exports.AppError = AppError;
exports.NewPatientSchema = zod_1.default.object({
    ssn: zod_1.default.string().nonempty(),
    name: zod_1.default.string().nonempty(),
    gender: zod_1.default.nativeEnum(types_1.Gender),
    occupation: zod_1.default.string().nonempty(),
    dateOfBirth: zod_1.default.string().date(),
});
const NewEntryBaseSchema = zod_1.default.object({
    date: zod_1.default.string().date(),
    specialist: zod_1.default.string().nonempty(),
    description: zod_1.default.string().nonempty(),
    diagnosisCodes: zod_1.default.array(zod_1.default.string().nonempty()).optional(),
});
exports.NewEntrySchema = zod_1.default.discriminatedUnion('type', [
    NewEntryBaseSchema.extend({
        type: zod_1.default.literal(types_1.EntryType.HealthCheck),
        healthCheckRating: zod_1.default.nativeEnum(types_1.HealthCheckRating),
    }),
    NewEntryBaseSchema.extend({
        type: zod_1.default.literal(types_1.EntryType.Hospital),
        discharge: zod_1.default.object({
            criteria: zod_1.default.string().nonempty(),
            date: zod_1.default.string().date(),
        }),
    }),
    NewEntryBaseSchema.extend({
        type: zod_1.default.literal(types_1.EntryType.OccupationalHealthcare),
        employerName: zod_1.default.string().nonempty(),
        sickLeave: zod_1.default
            .object({
            startDate: zod_1.default.string().date(),
            endDate: zod_1.default.string().date(),
        })
            .optional(),
    }),
]);
const isNumber = (x) => {
    return typeof x === 'number' || x instanceof Number;
};
exports.isNumber = isNumber;
