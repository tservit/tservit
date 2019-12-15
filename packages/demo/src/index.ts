import { createServer } from "@tservit/core";
import { body } from "@tservit/middleware-body";
import { query } from "@tservit/middleware-query";
import { right } from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

const app = createServer();

const helloBody = body(
    t.interface({
        hello: t.string
    })
);

const sortQuery = query(
    t.interface({
        sort: t.string
    })
);

app.post`/${"id"}`([helloBody, sortQuery])(
    ({ body: { hello }, query: { sort }, params: { id } }) => {
        return right({
            code: 200,
            body: { success: "yaya", hello, id, sort }
        });
    }
);

app.listen(3500, () => console.log("Listening"));
