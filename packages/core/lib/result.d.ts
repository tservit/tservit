export declare const invalid: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<{
    code: number;
    body: T;
}, never>, unauthorized: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<{
    code: number;
    body: T;
}, never>, forbidden: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<{
    code: number;
    body: T;
}, never>, notFound: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<{
    code: number;
    body: T;
}, never>, error: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<{
    code: number;
    body: T;
}, never>;
export declare const ok: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<never, {
    code: number;
    body: T;
}>, created: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<never, {
    code: number;
    body: T;
}>, accepted: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<never, {
    code: number;
    body: T;
}>, noContent: <T>(body: T) => import("fp-ts/lib/TaskEither").TaskEither<never, {
    code: number;
    body: T;
}>;
