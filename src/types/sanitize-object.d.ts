
declare module "sanitize-object" {
    export function only(...properties: string[]): <T>(obj: T) => T;
    export function exclude(...properties: string[]): <T>(obj: T) => T;
}