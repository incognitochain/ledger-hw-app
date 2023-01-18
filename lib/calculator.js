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
exports.signSchnorr = exports.calculateCoinPrivKey = exports.calculateR = exports.calculateFirstC = exports.calculateKeyImage = exports.getAlpha = exports.setAlpha = exports.genAlpha = void 0;
var constants_1 = require("./constants");
var arrayConcat = function (arrays) {
    var flatNumberArray = arrays.reduce(function (acc, curr) {
        acc.push.apply(acc, curr);
        return acc;
    }, []);
    return new Uint8Array(flatNumberArray);
};
function genAlpha(transport, alphaLen, isToken) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, p2;
        return __generator(this, function (_a) {
            buf = Buffer.from([]);
            p2 = 0;
            if (isToken == true) {
                p2 = 1;
            }
            return [2 /*return*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GenAlpha, alphaLen, p2, buf)];
        });
    });
}
exports.genAlpha = genAlpha;
function setAlpha(transport, index, data) {
    return __awaiter(this, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from(data, "base64");
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.SetAlpha, index, 0x00, buf)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.setAlpha = setAlpha;
function getAlpha(transport, alphaLen, isToken) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, p2, i, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from([]);
                    p2 = isToken ? 1 : 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < alphaLen)) return [3 /*break*/, 4];
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GetAlpha, i, p2, buf)];
                case 2:
                    res = _a.sent();
                    console.log(res);
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAlpha = getAlpha;
function calculateKeyImage(transport, encryptKmB64, coinPubKeyB64) {
    return __awaiter(this, void 0, void 0, function () {
        var coinPubKey, coinEncryptKm, buffer, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coinPubKey = Buffer.from(coinPubKeyB64, "base64");
                    coinEncryptKm = Buffer.from(encryptKmB64, "base64");
                    if (coinPubKey.length != 32)
                        throw 'invalid coinPubKey';
                    if (coinEncryptKm.length != 32)
                        throw 'invalid coinEncryptKm';
                    buffer = Buffer.alloc(64);
                    coinEncryptKm.copy(buffer, 0);
                    coinPubKey.copy(buffer, 32);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.KeyImage, 0x00, 0x00, buffer)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.subarray(0, 32)];
            }
        });
    });
}
exports.calculateKeyImage = calculateKeyImage;
function _calculateFirstC(transport, params) {
    return __awaiter(this, void 0, void 0, function () {
        var pedComG, result, i, h, msg_1, msg, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pedComG = Buffer.from(params[params.length - 1], "base64");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    result = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < params.length - 1)) return [3 /*break*/, 5];
                    h = Buffer.from(params[i], "base64");
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateC, 0x00, i, h)];
                case 3:
                    msg_1 = _a.sent();
                    result.push(msg_1.subarray(0, 64));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateC, 0x01, params.length - 1, pedComG)];
                case 6:
                    msg = _a.sent();
                    result.push(msg.subarray(0, 32));
                    return [2 /*return*/, arrayConcat(result)];
                case 7:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function _calculateFirstC_CA(transport, params) {
    return __awaiter(this, void 0, void 0, function () {
        var pedComG, result, i, h, msg_2, msg, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pedComG = Buffer.from(params[params.length - 1], "base64");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    result = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < params.length - 2)) return [3 /*break*/, 5];
                    h = Buffer.from(params[i], "base64");
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateCCA, 0x00, i, h)];
                case 3:
                    msg_2 = _a.sent();
                    result.push(msg_2.subarray(0, 64));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateCCA, 0x01, params.length - 2, pedComG)];
                case 6:
                    msg = _a.sent();
                    result.push(msg.subarray(0, 32));
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateCCA, 0x01, params.length - 1, pedComG)];
                case 7:
                    msg = _a.sent();
                    result.push(msg.subarray(0, 32));
                    return [2 /*return*/, arrayConcat(result)];
                case 8:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
var calculateFirstC = function (transport, params, isToken) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, isToken ? _calculateFirstC_CA(transport, params) : _calculateFirstC(transport, params)];
}); }); };
exports.calculateFirstC = calculateFirstC;
function calculateR(transport, coinLen, cPi, isToken) {
    return __awaiter(this, void 0, void 0, function () {
        var buf, result, p1, i, msg, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buf = Buffer.from(cPi, "base64");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    result = [];
                    p1 = isToken ? 1 : 0;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < coinLen)) return [3 /*break*/, 5];
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.CalculateR, p1, i, buf)];
                case 3:
                    msg = _a.sent();
                    result.push(msg.subarray(0, 32));
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, result];
                case 6:
                    err_3 = _a.sent();
                    console.error(err_3);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.calculateR = calculateR;
function calculateCoinPrivKey(transport, coinsH, inputLen) {
    return __awaiter(this, void 0, void 0, function () {
        var i, buf, i, buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < inputLen)) return [3 /*break*/, 4];
                    buf = Buffer.from(coinsH[i], "base64");
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GenCoinPrivateKey, 0x00, i, buf)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    i = inputLen;
                    _a.label = 5;
                case 5:
                    if (!(i < coinsH.length)) return [3 /*break*/, 8];
                    buf = Buffer.from(coinsH[i], "base64");
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.GenCoinPrivateKey, 0x01, i, buf)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.calculateCoinPrivKey = calculateCoinPrivKey;
function signSchnorr(transport, pedRand, pedPriv, randomness, message) {
    return __awaiter(this, void 0, void 0, function () {
        var pRand, pPriv, rand, msg, buf, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pPriv = Buffer.from(pedPriv, "base64");
                    rand = Buffer.from(randomness, "base64");
                    msg = Buffer.from(message, "base64");
                    if (pedRand.length == 0) {
                        pRand = Buffer.alloc(32);
                        pRand = Buffer.from([]);
                    }
                    else {
                        pRand = Buffer.from(pedRand, "base64");
                    }
                    buf = Buffer.alloc(pRand.length + pPriv.length + rand.length + msg.length);
                    pRand.copy(buf, 0, pRand.length);
                    pPriv.copy(buf, pRand.length, pPriv.length);
                    rand.copy(buf, pRand.length + pPriv.length, rand.length);
                    msg.copy(buf, pRand.length + pPriv.length + rand.length, msg.length);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, transport.send(constants_1.cmd.cla, constants_1.cmd.SignSchnorr, 0x00, 0x00, buf)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_4 = _a.sent();
                    console.error(err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.signSchnorr = signSchnorr;
