import { createServer } from "@tserver/core";
import { body } from "@tserver/middleware-body";
import { right } from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

const app = createServer();

app.post`/`([
    body(
        t.interface({
            hello: t.string
        })
    )
])(({ body: { hello } }) => {
    return right({
        code: 200,
        body: { success: "yaya", hello }
    });
});

app.listen(3500, () => console.log("Listening"));
