import { Middleware } from "@tservit/core";
import * as bp from "body-parser";
import * as t from "io-ts";
export declare const body: <T extends any>(shape: t.Type<T, T, unknown>, options?: bp.OptionsJson | undefined) => Middleware<{}, {
    body: T;
}>;
