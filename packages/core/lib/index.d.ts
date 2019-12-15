/// <reference types="node" />
import { Request } from "express";
import { TaskEither } from "fp-ts/lib/TaskEither";
export declare type HttpError = {
    code: number;
    msg: string;
};
export declare type HttpResult = {
    code: number;
    body: object;
};
export declare type Handler<T extends {}, P extends string> = (ctx: T & {
    params: Record<P, string>;
}) => TaskEither<HttpError, HttpResult>;
export declare type Middleware<T extends {}, U extends {}> = (ctx: BaseCtx) => (prev: T) => TaskEither<HttpError, U>;
export declare type BaseCtx = {
    request: Request;
};
export declare const createServer: (ex?: import("express-serve-static-core").Express) => {
    listen: {
        (port: number, hostname: string, backlog: number, callback?: ((...args: any[]) => void) | undefined): import("http").Server;
        (port: number, hostname: string, callback?: ((...args: any[]) => void) | undefined): import("http").Server;
        (port: number, callback?: ((...args: any[]) => void) | undefined): import("http").Server;
        (callback?: ((...args: any[]) => void) | undefined): import("http").Server;
        (path: string, callback?: ((...args: any[]) => void) | undefined): import("http").Server;
        (handle: any, listeningListener?: (() => void) | undefined): import("http").Server;
    };
    use: import("express-serve-static-core").ApplicationRequestHandler<import("express-serve-static-core").Express>;
    delete: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    get: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    options: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    patch: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    post: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    put: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => <T extends {}, U extends T>(middleware_0: Middleware<T, U>) => (handle: Handler<U, P>) => void;
    attach: ({ _router }: {
        _router: import("express-serve-static-core").Express;
    }) => import("express-serve-static-core").Express;
    _router: import("express-serve-static-core").Express;
};
