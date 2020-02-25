export type THandlerOn<TArgs extends any[] = any[]> = (...args: TArgs) => void;

export interface IReturnOn {
    remove(): void;
}