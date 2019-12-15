import { createServer, HttpError } from "@tservit/core";
import { body } from "@tservit/middleware-body";
import { query } from "@tservit/middleware-query";
import { tryCatch, mapLeft, TaskEither } from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { toError } from "fp-ts/lib/Either";

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

const getItem = async (id: string) => {
    if (id === "1") {
        return { item: "spoon" };
    }

    throw new Error("Item not found");
};

const runTC = <T, U>(f: (a: T) => Promise<U>) => (
    a: T
): TaskEither<Error, U> => {
    return tryCatch(() => f(a), toError);
};

const service = {
    getItem: runTC(getItem)
};

app.post`/${"id"}`([helloBody, sortQuery])(({ params: { id } }) => {
    return mapLeft<Error, HttpError>(err => ({
        code: 404,
        body: err.message
    }))(service.getItem(id));
});

app.listen(3500, () => console.log("Listening"));
