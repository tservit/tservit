"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.path = function (pathParts) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var path = lodash_1.zip(pathParts, params).reduce(function (path, _a) {
        var part = _a[0], param = _a[1];
        return path +
            (!!part ? part : "") +
            (!!param ? ":" + param : "");
    }, "");
    return {
        path: path,
    };
};
//# sourceMappingURL=path.js.map