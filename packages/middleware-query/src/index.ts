import { Middleware, HttpError } from "@tservit/core";
import { fromEither } from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { bimap, left } from "fp-ts/lib/Either";

export const query = <T extends any>(
    shape: t.Type<T>
): Middleware<{}, { query: T }> => ({ request }) => () =>
    fromEither(
        bimap<t.Errors, HttpError, T, { query: T }>(
            errors => ({
                code: 400,
                body: `Invalid query: ${PathReporter.report(left(errors)).join(
                    ", "
                )}`
            }),
            query => ({ query })
        )(shape.decode(request.query))
    );
