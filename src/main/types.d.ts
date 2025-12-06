declare module 'electron-store' {
  interface StoreOptions<T> {
    defaults?: T;
    name?: string;
    cwd?: string;
    encryptionKey?: string;
    clearInvalidConfig?: boolean;
  }

  class Store<T = any> {
    constructor(options?: StoreOptions<T>);
    get<K extends keyof T>(key: K): T[K];
    get<K extends keyof T>(key: K, defaultValue: T[K]): T[K];
    set<K extends keyof T>(key: K, value: T[K]): void;
    set(object: Partial<T>): void;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    get store(): T;
    set store(value: T);
    get size(): number;
    get path(): string;
  }

  export = Store;
}
