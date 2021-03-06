interface SanitizeOptions {
    allowNamespaces?: boolean;
}
declare type Mapper = (value: string, options?: SanitizeOptions) => string;
export declare function findClosing(value: string, start: number): number;
export declare function alias(src: string[], dest: string, withChecks?: boolean): Mapper;
export declare function cleanupCompact(): Mapper;
export declare function flattenSingleTuple(): Mapper;
export declare function removeColons(): Mapper;
export declare function removeGenerics(): Mapper;
export declare function removePairOf(): Mapper;
export declare function removeTraits(): Mapper;
export declare function removeWrap(_check: string): Mapper;
export default function sanitize(value: string, options?: SanitizeOptions): string;
export {};
