"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var path_1 = require("./path");
var Verbs;
(function (Verbs) {
    Verbs["get"] = "get";
    Verbs["put"] = "put";
    Verbs["post"] = "post";
    Verbs["patch"] = "patch";
    Verbs["delete"] = "delete";
    Verbs["options"] = "options";
})(Verbs || (Verbs = {}));
var combineTEither = function (t1) { return function (t2) {
    return TaskEither_1.map(function (x) { return (tslib_1.__assign(tslib_1.__assign({}, x), t2)); })(t1);
}; };
var runMiddleware = function (middleware) { return function (ctx) {
    return TaskEither_1.chain(combineTEither(TaskEither_1.right(tslib_1.__assign(tslib_1.__assign({}, ctx), { params: ctx.request.params }))))(middleware.reduce(function (out, m) {
        return TaskEither_1.chain(combineTEither(out))(TaskEither_1.chain(m(ctx))(out));
    }, TaskEither_1.right({})));
}; };
function createHandler(router) {
    return function (verb) { return function (pathParts) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return function (middleware) { return function (handle) {
            router[verb](path_1.path.apply(void 0, tslib_1.__spreadArrays([pathParts], params)).path, function (request, res) {
                TaskEither_1.bimap(function (err) { return res.status(500).send(err); }, function (_a) {
                    var code = _a.code, body = _a.body;
                    return res.status(code).send(body);
                })(TaskEither_1.chain(handle)(runMiddleware(middleware)({
                    request: request
                })))();
            });
        }; };
    }; };
}
var createRoute = function (router) {
    var handlerFactory = createHandler(router);
    return {
        listen: router.listen.bind(router),
        use: router.use.bind(router),
        delete: handlerFactory(Verbs.delete),
        get: handlerFactory(Verbs.get),
        options: handlerFactory(Verbs.options),
        patch: handlerFactory(Verbs.patch),
        post: handlerFactory(Verbs.post),
        put: handlerFactory(Verbs.put),
        attach: function (_a) {
            var _router = _a._router;
            return router.use(_router);
        },
        _router: router
    };
};
exports.createServer = function (ex) {
    if (ex === void 0) { ex = express_1.default(); }
    return createRoute(ex);
};
//# sourceMappingURL=index.js.map