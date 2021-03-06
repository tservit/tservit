import express, { Request } from "express";
import {
    chain,
    TaskEither,
    right,
    left,
    bimap,
    map
} from "fp-ts/lib/TaskEither";
import { path } from "./path";

export type HttpError = { code: number; body: any };
export type HttpResult = object;
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
    options = "options",
    use = "use"
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

function createHandler(router: ReturnType<typeof express>) {
    return (verb: Verbs) => <P extends string>(
        pathParts: TemplateStringsArray,
        ...params: P[]
    ) => (middleware: Array<Middleware<any, any>>) => (
        handle: Handler<any, any>
    ) => {
        router[verb](
            path(pathParts, ...params).path,
            (request, res) => {
                bimap<HttpError, void, HttpResult, void>(
                    ({ code, body }) => res.status(code).send(body),
                    body => res.status(200).send(body)
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

export type CreateRoute1 = <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends {}, U extends {}, V extends {}>(
    middleware: [Middleware<T, U>, Middleware<U, V>]
) => (handle: Handler<U & V, P>) => void;

export type CreateRoute2 = <P extends string>(
    pathParts: TemplateStringsArray,
    ...params: P[]
) => <T extends {}, U extends {}, V extends {}>(
    middleware: [Middleware<T, U>, Middleware<U, V>]
) => (handle: Handler<U & V, P>) => void;

export type CreateRoute = CreateRoute1 & CreateRoute2;

const createRouter = (router: ReturnType<typeof express>) => {
    const handlerFactory = createHandler(router);
    return {
        listen: (...args: Parameters<typeof router.listen>) => {
            handlerFactory(Verbs.use)`*`([])(() =>
                left({
                    code: 404,
                    body: "Not Found"
                })
            );
            router.listen.apply(router, args);
        },
        use: router.use.bind(router),
        delete: handlerFactory(Verbs.delete) as CreateRoute,
        get: handlerFactory(Verbs.get) as CreateRoute,
        options: handlerFactory(Verbs.options) as CreateRoute,
        patch: handlerFactory(Verbs.patch) as CreateRoute,
        post: handlerFactory(Verbs.post) as CreateRoute,
        put: handlerFactory(Verbs.put) as CreateRoute,
        attach: ({
            _router
        }: {
            _router: ReturnType<typeof express>;
        }) => router.use(_router),
        _router: router
    };
};

export const createServer = (ex = express()) => createRouter(ex);
