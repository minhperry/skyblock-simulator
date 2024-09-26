import {Component, OnInit} from '@angular/core';
import {Nullable, TodoCategory, TodoNode} from "../../interfaces/todo";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit{
    categories: TodoCategory[] = []
    selectedCategory: Nullable<TodoCategory> = null

    nextTodoId = 1
    nextCategoryId = 1

    isPressing = false;
    longPressIndex!: Nullable<number>
    private pressTimeOut: any;

    ngOnInit(): void {

        const savedCategories = localStorage.getItem('categories');
        const selected = localStorage.getItem('selected');

        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
            this.nextTodoId = this.calculateNextId(this.categories.flatMap(cat => cat.todos));
            this.nextCategoryId = this.calculateNextCategoryId(this.categories);
        }

        if (selected) {
            const selectedId = parseInt(selected, 10);
            this.selectedCategory = this.categories.find(cat => cat.id === selectedId) || null;
        }
    }

    addCategory() {
        const newCategory: TodoCategory = {
            id: this.nextCategoryId++,
            name: 'New Category',
            todos: []
        };
        this.categories.push(newCategory);
        this.saveCategories();
    }

    doPressing(idx: number) {
        this.isPressing = true;
        this.longPressIndex = idx;
        this.pressTimeOut = setTimeout(() => {
            this.deleteCategory(idx);
        }, 800);
    }

    stopPressing() {
        this.isPressing = false;
        this.longPressIndex = null;
        if (this.pressTimeOut) {
            clearTimeout(this.pressTimeOut);
        }
    }

    selectCategory(category: TodoCategory) {
        this.selectedCategory = category;
        localStorage.setItem('selected', this.selectedCategory ? this.selectedCategory.id.toString() : '');
    }

    renameCategory(category: TodoCategory, newName: string) {
        category.name = newName;
        this.saveCategories();
    }

    addTodo(parent: Nullable<TodoNode> = null) {
        if (!this.selectedCategory) return;

        const newTodo: TodoNode = {
            id: this.nextTodoId++,
            text: '',
            completed: false,
            children: []
        };

        if (parent) {
            parent.children.push(newTodo);
        } else {
            this.selectedCategory.todos.push(newTodo);
        }

        this.saveCategories();
    }

    deleteTodo(node: Nullable<TodoNode[]>, index: number) {
        if (node) {
            node.splice(index, 1);
        }
        this.saveCategories();
    }

    toggleCheck(todo: TodoNode, parent?: Nullable<TodoNode>) {
        const ogState = todo.completed
        todo.completed = !todo.completed;

        if (todo.completed) {
            this.checkChildren(todo, todo.completed)
        }
        if (parent && ogState !== todo.completed) {
            this.checkParents(parent);
        }
        this.saveCategories();
    }

    saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    private deleteCategory(index: number) {
        if (this.selectedCategory!.id === this.categories[index].id) {
            this.selectedCategory = null
            localStorage.removeItem('selected')
        }
        this.categories.splice(index, 1);
        this.saveCategories();
    }

    private checkChildren(node: TodoNode, check: boolean) {
        node.completed = check
        node.children.forEach((ch) => this.checkChildren(ch, check))
    }

    private checkParents(node: Nullable<TodoNode>) {
        if (!node) return;
        if (node.children.length === 1) {
            node.completed = node.children[0].completed
        } else {
            node.completed = node.children.every(child => child.completed)
        }
    }

    private calculateNextId(nodes: TodoNode[]): number {
        let maxId = this.nextTodoId;
        for (let node of nodes) {
            maxId = Math.max(maxId, node.id);
            maxId = Math.max(maxId, this.calculateNextId(node.children));
        }
        return maxId + 1;
    }

    private calculateNextCategoryId(categories: TodoCategory[]): number {
        return categories.reduce((maxId, category) => Math.max(maxId, category.id), 0) + 1;
    }
}
