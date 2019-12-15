import { createServer } from "@tservit/core";
import { body } from "@tservit/middleware-body";
import { right } from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

const app = createServer();

const helloBody = body(
    t.interface({
        hello: t.string
    })
);

app.post`/${"id"}`(helloBody)(
    ({ body: { hello }, params: { id } }) => {
        return right({
            code: 200,
            body: { success: "yaya", hello, id }
        });
    }
);

app.listen(3500, () => console.log("Listening"));
