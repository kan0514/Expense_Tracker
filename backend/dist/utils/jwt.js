"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid = __importStar(require("uuid"));
const uuidv4 = uuid.v4;
const dotenv_1 = __importDefault(require("dotenv"));
// Import ms.StringValue type (or ensure its availability through jsonwebtoken's types)
// Note: jwt relies on the 'ms' library for expiry strings. Casting to string is often sufficient, 
// but for absolute compliance, we'll cast the options object itself.
dotenv_1.default.config();
// Define JWT_SECRET and ensure a fallback string for the Secret type.
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// Define JWT_EXPIRY and ensure a fallback string.
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";
function signToken(payload) {
    const jti = uuidv4();
    // FIX: Cast the options object to SignOptions. This forces the compiler 
    // to accept the string for 'expiresIn', resolving the TS2322 error.
    const options = { expiresIn: JWT_EXPIRY };
    return jsonwebtoken_1.default.sign({ ...payload, jti }, JWT_SECRET, options);
}
function verifyToken(token) {
    try {
        // Casting JWT_SECRET to Secret ensures the correct synchronous overload for verify is used.
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return null;
    }
}
