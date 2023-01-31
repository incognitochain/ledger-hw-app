var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import Transport from "@ledgerhq/hw-transport";
import { TransportError } from "@ledgerhq/errors";
// import axios from "axios";
// import adapter from "@vespaiach/axios-fetch-adapter";
import { log } from "@ledgerhq/logs";
/**
 * HTTP transport implementation
 */
var HttpTransport = /** @class */ (function (_super) {
    __extends(HttpTransport, _super);
    function HttpTransport(url) {
        var _this = _super.call(this) || this;
        _this.url = url;
        return _this;
    }
    HttpTransport.open = function (url, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, HttpTransport.check(url, timeout)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, new HttpTransport(url)];
                }
            });
        });
    };
    HttpTransport.prototype.exchange = function (apdu) {
        return __awaiter(this, void 0, void 0, function () {
            var apduHex, response, body, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apduHex = apdu.toString("hex");
                        log("apdu", "=> " + apduHex);
                        return [4 /*yield*/, fetch(this.url, {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    apduHex: apduHex
                                })
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.status !== 200) {
                            throw new TransportError("failed to communicate to server. code=" + response.status, "HttpTransportStatus" + response.status);
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        body = _b.sent();
                        if (body.error)
                            throw body.error;
                        result = Buffer.from(body.data, "hex");
                        return [2 /*return*/, result];
                }
            });
        });
    };
    HttpTransport.prototype.setScrambleKey = function () { };
    HttpTransport.prototype.close = function () {
        return Promise.resolve();
    };
    var _a;
    _a = HttpTransport;
    HttpTransport.isSupported = function () {
        return Promise.resolve(typeof fetch === "function");
    };
    // this transport is not discoverable
    HttpTransport.list = function () { return Promise.resolve([]); };
    HttpTransport.listen = function (_observer) { return ({
        unsubscribe: function () { }
    }); };
    HttpTransport.check = function (url, timeout) {
        if (timeout === void 0) { timeout = 5000; }
        return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(_a, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _b.sent();
                        if (response.status !== 200) {
                            throw new TransportError("failed to access HttpTransport(" +
                                url +
                                "): status " +
                                response.status, "HttpTransportNotAccessible");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return HttpTransport;
}(Transport));
export default HttpTransport;