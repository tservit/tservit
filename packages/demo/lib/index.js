"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@tservit/core");
var middleware_body_1 = require("@tservit/middleware-body");
var TaskEither_1 = require("fp-ts/lib/TaskEither");
var t = tslib_1.__importStar(require("io-ts"));
var app = core_1.createServer();
app.post(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["/"], ["/"])))([
    middleware_body_1.body(t.interface({
        hello: t.string
    }))
])(function (_a) {
    var hello = _a.body.hello;
    return TaskEither_1.right({
        code: 200,
        body: { success: "yaya", hello: hello }
    });
});
app.listen(3500, function () { return console.log("Listening"); });
var templateObject_1;
//# sourceMappingURL=index.js.map