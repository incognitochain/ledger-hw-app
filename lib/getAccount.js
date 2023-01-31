"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getListAddresses = exports.switchKey = exports.getValidatorKey = exports.getViewKey = exports.getOTAKey = exports.getAddress = void 0;
var constants_1 = require("./constants");
function getAddress(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res, temp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetAddress, 0x00, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    temp = String.fromCharCode.apply(null, res.subarray(0, res.indexOf(0)));
                    return [2 /*return*/, temp.trimEnd().replace(/[^0-9a-z]/gi, '')];
            }
        });
    });
}
exports.getAddress = getAddress;
function getOTAKey(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetOTAKey, 0x00, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.subarray(0, 32)];
            }
        });
    });
}
exports.getOTAKey = getOTAKey;
function getViewKey(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetViewKey, 0x00, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.subarray(0, 32)];
            }
        });
    });
}
exports.getViewKey = getViewKey;
function getValidatorKey(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetValidatorKey, 0x00, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.subarray(0, 32)];
            }
        });
    });
}
exports.getValidatorKey = getValidatorKey;
function switchKey(transport, accountNum) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.alloc(4);
                    buf[0] = (accountNum >> 24) & 0xFF;
                    buf[1] = (accountNum >> 16) & 0xFF;
                    buf[2] = (accountNum >> 8) & 0xFF;
                    buf[3] = accountNum & 0xFF;
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.SwitchKey, 0x00, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.subarray(0, 100)];
            }
        });
    });
}
exports.switchKey = switchKey;
function getListAddresses(transport, startIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetListAddress, startIndex, 0x00, buf)];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [2 /*return*/, res.subarray(0, 300)];
            }
        });
    });
}
exports.getListAddresses = getListAddresses;