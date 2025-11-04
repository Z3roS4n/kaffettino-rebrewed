import type {
    FluentBundle,
    FluentVariable,
    Message as FluentMessage,
    // @ts-ignore
} from "@fluent/bundle"

export interface LocalesMap {
    "hello-user": {
        userName: FluentVariable
    }
}

export interface Message<Key extends keyof LocalesMap> extends FluentMessage {
    id: Key
}

export interface TypedFluentBundle extends FluentBundle {
    getMessage<Key extends keyof LocalesMap>(key: Key): Message<Key>
    formatPattern<Key extends keyof LocalesMap>(
        key: Key,
        ...args: LocalesMap[Key] extends never ? [] : [args: LocalesMap[Key]]
    ): string
    formatPattern<Key extends keyof LocalesMap>(
        key: Key,
        args: LocalesMap[Key] extends never ? null : LocalesMap[Key],
        errors?: Error[] | null,
    ): string
}
