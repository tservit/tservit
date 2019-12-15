import express, { Request } from "express";
import {
    chain,
    TaskEither,
    right,
    bimap,
    map
} from "fp-ts/lib/TaskEither";
import { path } from "./path";

export type HttpError = { code: number; msg: string };
export type HttpResult = { code: number; body: object };
export type Handler<T extends {}, P extends string> = (
    ctx: T & { params: Record<P, string> }
) => TaskEither<HttpError, HttpResult>;
export type Middleware<T extends {}, U extends {}> = (
    ctx: BaseCtx
) => (prev: T) => TaskEither<HttpError, U>;

export type BaseCtx = {
    request: Request;
};

enum Verbs {
    get = "get",
    put = "put",
    post = "post",
    patch = "patch",
    delete = "delete",
    options = "options"
}

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
): (
    verb: Verbs
) => <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends {}, U extends T>(
    middleware: [Middleware<T, U>]
) => (handle: Handler<U, P>) => void;
function createHandler(
    router: ReturnType<typeof express>
): (
    verb: Verbs
) => <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends {}, U extends {}, V extends {}>(
    middleware: [Middleware<T, U>, Middleware<U, V>]
) => (handle: Handler<U & V, P>) => void;
function createHandler(router: ReturnType<typeof express>) {
    return (verb: Verbs) => <P extends string>(
        pathParts: TemplateStringsArray,
        ...params: P[]
    ) => (middleware: any) => (handle: Handler<any, any>) => {
        router[verb](
            path(pathParts, ...params).path,
            (request, res) => {
                bimap<HttpError, void, HttpResult, void>(
                    err => res.status(500).send(err),
                    ({ code, body }) => res.status(code).send(body)
                )(
                    chain(handle)(
                        runMiddleware(middleware)({
                            request
                        })
                    )
                )();
            }
        );
    };
}

const createRoute = (router: ReturnType<typeof express>) => {
    const handlerFactory = createHandler(router);
    return {
        listen: router.listen.bind(router),
        use: router.use.bind(router),
        delete: handlerFactory(Verbs.delete),
        get: handlerFactory(Verbs.get),
        options: handlerFactory(Verbs.options),
        patch: handlerFactory(Verbs.patch),
        post: handlerFactory(Verbs.post),
        put: handlerFactory(Verbs.put),
        attach: ({
            _router
        }: {
            _router: ReturnType<typeof express>;
        }) => router.use(_router),
        _router: router
    };
};

export const createServer = (ex = express()) => createRoute(ex);
