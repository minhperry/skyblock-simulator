import {Component, Input} from '@angular/core';
import {TodoNode} from "../../../interfaces/todo";
import {TodoComponent} from "../todo.component";
import {FormsModule} from "@angular/forms";
import {Nullable} from "../../../interfaces/types";

@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
    imports: [
        FormsModule
    ],
    styleUrl: 'todo-item.component.scss'
})
export class TodoItemComponent {
    @Input() todo!: TodoNode
    @Input() siblingsRef!: TodoNode[]
    @Input() parents!: Nullable<TodoNode>
    @Input() index!: number

    private pressTimeOut!: any
    isPressing = false;

    constructor(private todoComp: TodoComponent) {}

    addChild() {
        this.todoComp.addTodo(this.todo)
    }

    private delete() {
        this.todoComp.deleteTodo(this.siblingsRef, this.index)
    }

    toggle() {
        this.todoComp.toggleCheck(this.todo, this.parents)
    }

    save() {
        this.todoComp.saveCategories()
    }

    doPressing() {
        this.isPressing = true;
        this.pressTimeOut = global.setTimeout(() => {
            this.delete();
        }, 800);
    }

    stopPressing() {
        this.isPressing = false;
        if (this.pressTimeOut) {
            clearTimeout(this.pressTimeOut);
        }
    }
}
