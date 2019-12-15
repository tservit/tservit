import { Middleware, HttpError } from "@tserver/core";
import {
    taskify,
    bimap,
    chain,
    fromEither
} from "fp-ts/lib/TaskEither";
import * as bp from "body-parser";
import { IncomingMessage, ServerResponse } from "http";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { bimap as bimapE, left } from "fp-ts/lib/Either";

export const body = <T extends any>(
    shape: t.Type<T>,
    options?: bp.OptionsJson | undefined
): Middleware<{}, { body: T }> => ({ request }) => () =>
    chain<HttpError, T, { body: T }>(parsedBody =>
        fromEither(
            bimapE<t.Errors, HttpError, T, { body: T }>(
                errors => ({
                    code: 400,
                    msg: `Invalid body: ${PathReporter.report(
                        left(errors)
                    ).join(", ")}`
                }),
                body => ({ body })
            )(shape.decode(parsedBody))
        )
    )(
        bimap(
            (err: string) => ({ code: 500, msg: String(err) }),
            () => request.body
        )(
            taskify<IncomingMessage, ServerResponse, string, T>(
                bp.json(options)
            )(request, {} as any)
        )
    );
