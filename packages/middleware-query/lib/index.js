"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var PathReporter_1 = require("io-ts/lib/PathReporter");
var Either_1 = require("fp-ts/lib/Either");
exports.query = function (shape) { return function (_a) {
    var request = _a.request;
    return function () {
        return TaskEither_1.fromEither(Either_1.bimap(function (errors) { return ({
            code: 400,
            msg: "Invalid query: " + PathReporter_1.PathReporter.report(Either_1.left(errors)).join(", ")
        }); }, function (query) { return ({ query: query }); })(shape.decode(request.query)));
    };
}; };
//# sourceMappingURL=index.js.map