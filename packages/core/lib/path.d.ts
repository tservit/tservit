export interface ProcessedPath<K extends string> {
    path: string;
    _?: K;
}
export declare const path: <P extends string>(pathParts: TemplateStringsArray, ...params: P[]) => ProcessedPath<P>;
