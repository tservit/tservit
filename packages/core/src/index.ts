import express, { Request } from "express";
import {
    chain,
    TaskEither,
    right,
    bimap,
    map,
} from "fp-ts/lib/TaskEither";
import { path } from "./path";

type HttpError = { _type: "err" };
type HttpResult = { _type: "res" };
type Handler<T extends {}, P extends string> = (
    ctx: T & { params: Record<P, string> }
) => TaskEither<HttpError, HttpResult>;
type Middleware<T extends {}, U extends {}> = (
    ctx: BaseCtx
) => (prev: T) => TaskEither<HttpError, U>;

type BaseCtx = {
    request: Request;
};

const combineTEither = <T extends object>(
    t1: TaskEither<HttpError, T>
) => <U extends {}>(t2: U): TaskEither<HttpError, T & U> => {
    return map<T, T & U>(x => ({ ...x, ...t2 }))(t1) as any;
};

const runMiddleware = <T extends {}, U extends T>(
    middleware: Array<Middleware<T, U>>
) => (ctx: BaseCtx): TaskEither<HttpError, U> => {
    return chain(
        combineTEither(right({ ...ctx, params: ctx.request.params }))
    )(
        middleware.reduce(
            (out, m) =>
                chain(combineTEither(out))(chain(m(ctx))(out)),
            right({}) as TaskEither<HttpError, U>
        )
    );
};

function createHandler(
    router: ReturnType<typeof express>
): <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends {}, U extends {}, V extends {}>(
    middleware: [Middleware<T, U>, Middleware<U, V>]
) => (handle: Handler<U & V, P>) => void;
function createHandler(
    router: ReturnType<typeof express>
): <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends BaseCtx, U extends T>(
    middleware: [Middleware<T, U>]
) => (handle: Handler<U, P>) => void;
function createHandler(router: ReturnType<typeof express>) {
    return <P extends string>(
        pathParts: TemplateStringsArray,
        ...params: P[]
    ) => (middleware: any) => (handle: Handler<any, any>) => {
        router.get(
            path(pathParts, ...params).path,
            (request, res) => {
                bimap<HttpError, void, HttpResult, void>(
                    err => res.status(500).send(err),
                    r => res.status(200).send(r)
                )(
                    chain(handle)(
                        runMiddleware(middleware)({
                            request,
                        })
                    )
                )();
            }
        );
    };
}

const createRoute = (router: ReturnType<typeof express>) => {
    return {
        listen: router.listen.bind(router),
        get: createHandler(router),
    };
};

export const createServer = () => createRoute(express());

const app = createServer();

const m1: Middleware<{}, { hello: string }> = () => () => {
    return right({ hello: "alex" });
};

const m2: Middleware<
    { hello: string },
    { goodbye: string }
> = () => () => {
    return right({ goodbye: "alex" });
};

app.get`/${"name"}`([m1, m2])(
    ({ hello, goodbye, params: { name } }) => {
        return right({
            _type: "res",
            hello,
            goodbye,
            name,
        });
    }
);

app.listen(3500, console.log);
