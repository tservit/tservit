"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var bp = tslib_1.__importStar(require("body-parser"));
var PathReporter_1 = require("io-ts/lib/PathReporter");
var Either_1 = require("fp-ts/lib/Either");
exports.body = function (shape, options) { return function (_a) {
    var request = _a.request;
    return function () {
        return TaskEither_1.chain(function (parsedBody) {
            return TaskEither_1.fromEither(Either_1.bimap(function (errors) { return ({
                code: 400,
                msg: "Invalid body: " + PathReporter_1.PathReporter.report(Either_1.left(errors)).join(", ")
            }); }, function (body) { return ({ body: body }); })(shape.decode(parsedBody)));
        })(TaskEither_1.bimap(function (err) { return ({ code: 500, msg: String(err) }); }, function () { return request.body; })(TaskEither_1.taskify(bp.json(options))(request, {})));
    };
}; };
//# sourceMappingURL=index.js.map