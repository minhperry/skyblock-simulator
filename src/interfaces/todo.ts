export interface TodoNode {
    id: number,
    text: string,
    completed: boolean,
    children: TodoNode[]
}

export interface TodoCategory {
    id: number,
    name: string,
    todos: TodoNode[]
}

export type Nullable<T> = T | null
