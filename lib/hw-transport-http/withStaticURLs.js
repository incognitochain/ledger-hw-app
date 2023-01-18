"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var HttpTransport_1 = __importDefault(require("./HttpTransport"));
var WebSocketTransport_1 = __importDefault(require("./WebSocketTransport"));
var hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
var getTransport = function (url) {
    return !url.startsWith("ws") ? HttpTransport_1["default"] : WebSocketTransport_1["default"];
};
var inferURLs = function (urls) { return __awaiter(void 0, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (typeof urls === "function" ? urls() : urls)];
            case 1:
                r = _a.sent();
                return [2 /*return*/, typeof r === "string" ? [r] : r];
        }
    });
}); };
exports["default"] = (function (urls) {
    var StaticTransport = /** @class */ (function (_super) {
        __extends(StaticTransport, _super);
        function StaticTransport() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StaticTransport.isSupported = HttpTransport_1["default"].isSupported;
        StaticTransport.list = function () {
            return inferURLs(urls)
                .then(function (urls) {
                return Promise.all(urls.map(function (url) {
                    return getTransport(url)
                        .check(url)
                        .then(function () { return [url]; })["catch"](function () { return []; });
                }));
            })
                .then(function (arrs) { return arrs.reduce(function (acc, a) { return acc.concat(a); }, []); });
        };
        StaticTransport.listen = function (observer) {
            var unsubscribed = false;
            var seen = {};
            function checkLoop() {
                var _this = this;
                if (unsubscribed)
                    return;
                inferURLs(urls)
                    .then(function (urls) {
                    return Promise.all(urls.map(function (url) { return __awaiter(_this, void 0, void 0, function () {
                        var e_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (unsubscribed)
                                        return [2 /*return*/];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, getTransport(url).check(url)];
                                case 2:
                                    _a.sent();
                                    if (unsubscribed)
                                        return [2 /*return*/];
                                    if (!seen[url]) {
                                        seen[url] = 1;
                                        observer.next({
                                            type: "add",
                                            descriptor: url
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _a.sent();
                                    // nothing
                                    if (seen[url]) {
                                        delete seen[url];
                                        observer.next({
                                            type: "remove",
                                            descriptor: url
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }));
                })
                    .then(function () { return new Promise(function (success) { return setTimeout(success, 5000); }); })
                    .then(checkLoop);
            }
            checkLoop();
            return {
                unsubscribe: function () {
                    unsubscribed = true;
                }
            };
        };
        StaticTransport.open = function (url) { return getTransport(url).open(url); };
        return StaticTransport;
    }(hw_transport_1["default"]));
    return StaticTransport;
});
