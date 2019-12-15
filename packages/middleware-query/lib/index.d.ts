import { Middleware } from "@tservit/core";
import * as t from "io-ts";
export declare const query: <T extends any>(shape: t.Type<T, T, unknown>) => Middleware<{}, {
    query: T;
}>;
