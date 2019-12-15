import express, { Request } from "express";
import { chain, TaskEither, right, bimap, map } from "fp-ts/lib/TaskEither";

type HttpError = { _type: "err" };
type HttpResult = { _type: "res" };
type Handler<T extends {}> = (ctx: T) => TaskEither<HttpError, HttpResult>;
type Middleware<T extends {}, U extends {}> = (
  ctx: BaseCtx
) => (prev: T) => TaskEither<HttpError, U>;

type BaseCtx = {
  request: Request;
};

const combineTEither = <T extends object>(t1: TaskEither<HttpError, T>) => <
  U extends {}
>(
  t2: U
): TaskEither<HttpError, T & U> => {
  return map<T, T & U>(x => ({ ...x, ...t2 }))(t1) as any;
};

const handler = <T extends {}, U extends T>(
  ...middleware: Array<Middleware<T, U>>
) => (impl: Handler<U>) => (
  ctx: BaseCtx
): TaskEither<HttpError, HttpResult> => {
  const done = middleware.reduce((out, m) => {
    return chain(combineTEither(out))(chain(m(ctx))(out));
  }, right({}) as TaskEither<HttpError, U>);

  return chain(impl)(done);
};

function createHandler(
  router: ReturnType<typeof express>
): (
  path: string
) => <T extends {}, U extends {}, V extends {}>(
  middleware: [Middleware<T, U>, Middleware<U, V>]
) => (handle: Handler<U & V>) => void;
function createHandler(
  router: ReturnType<typeof express>
): (
  path: string
) => <T extends BaseCtx, U extends T>(
  middleware: [Middleware<T, U>]
) => (handle: Handler<U>) => void;
function createHandler(router: ReturnType<typeof express>) {
  return (path: string) => (middleware: any) => {
    return (handle: Handler<any>) => {
      router.get(path, (request, res) => {
        bimap<HttpError, void, HttpResult, void>(
          err => res.status(500).send(err),
          r => res.status(200).send(r)
        )(handler<any, any>(...middleware)(handle)({ request }))();
      });
    };
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

const m2: Middleware<{}, { goodbye: string }> = () => () => {
  return right({ goodbye: "alex" });
};

app.get("/")([m1, m2])(({ hello, goodbye }) => {
  return right({ _type: "res", hello, goodbye });
});

app.listen(3500, console.log);
