"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseForce_1 = __importDefault(require("./BaseForce"));
class Force2D extends BaseForce_1.default {
    constructor(magnitude, direction, x) {
        super(magnitude, direction, x, 0);
    }
}
exports.default = Force2D;
