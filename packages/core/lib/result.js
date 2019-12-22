"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var errorFactory = function (code) { return function (body) {
    return TaskEither_1.left({
        code: code,
        body: body
    });
}; };
var successFactory = function (code) { return function (body) {
    return TaskEither_1.right({
        code: code,
        body: body
    });
}; };
exports.invalid = (_a = [
    400,
    401,
    403,
    404,
    500
].map(errorFactory), _a[0]), exports.unauthorized = _a[1], exports.forbidden = _a[2], exports.notFound = _a[3], exports.error = _a[4];
exports.ok = (_b = [
    200,
    201,
    202,
    204
].map(successFactory), _b[0]), exports.created = _b[1], exports.accepted = _b[2], exports.noContent = _b[3];
//# sourceMappingURL=result.js.map