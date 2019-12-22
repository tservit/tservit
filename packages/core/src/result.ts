import { left, right } from "fp-ts/lib/TaskEither";

const errorFactory = (code: number) => <T>(body: T) =>
    left({
        code,
        body
    });

const successFactory = (code: number) => <T>(body: T) =>
    right({
        code,
        body
    });

export const [invalid, unauthorized, forbidden, notFound, error] = [
    400,
    401,
    403,
    404,
    500
].map(errorFactory);

export const [ok, created, accepted, noContent] = [
    200,
    201,
    202,
    204
].map(successFactory);
