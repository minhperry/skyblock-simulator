import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Nullable, TodoCategory, TodoNode} from "../../interfaces/todo";
import {Utils} from "../../services/utils";
import {TodoItemComponent} from "./todo-item/todo-item.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    imports: [
        TodoItemComponent,
        FormsModule
    ],
    styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit{
    categories: TodoCategory[] = []
    selectedCategory: TodoCategory | undefined = undefined

    nextTodoId = 1
    nextCategoryId = 1

    isPressing = false;
    longPressIndex!: Nullable<number>
    private pressTimeOut: any;

    clipboardData: string = ''
    exportData: string = ''

    constructor(@Inject(PLATFORM_ID) private platform: Object) {
    }

    ngOnInit(): void {

        let savedCategories;
        let selected;

        Utils.doIfBrowser(this.platform, () => {
            savedCategories = localStorage.getItem('categories');
            selected = localStorage.getItem('selected');
        })

        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
            this.nextTodoId = this.calculateNextId(this.categories.flatMap(cat => cat.todos));
            this.nextCategoryId = this.calculateNextCategoryId(this.categories);
        }

        if (selected) {
            const selectedId = parseInt(selected, 10);
            this.selectedCategory = this.categories.find(cat => cat.id === selectedId);
        }

        this.readLocalStorage()
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

    pasteClipboard() {
        navigator.clipboard.readText().then((text) => {
            try {
                const jsonData = JSON.parse(text);
                for (const [key, value] of Object.entries(jsonData)) {
                    localStorage.setItem(key, String(value));
                }
                alert('Clipboard JSON content saved to LocalStorage!');
            } catch (error) {
                console.error('Failed to parse clipboard contents as JSON: ', error);
            }
        }).catch((err) => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }

    importFromTextArea() {
        try {
            const jsonData = JSON.parse(this.clipboardData);
            for (const [key, value] of Object.entries(jsonData)) {
                localStorage.setItem(key, String(value));
            }
            alert('JSON content imported to LocalStorage!');
        } catch (error) {
            console.error('Failed to parse input as JSON: ', error);
            alert('Invalid JSON data. Please check your input.');
        }
    }

    writeToClipboard() {
        navigator.clipboard.writeText(this.exportData).then(() => {
            alert('LocalStorage content copied to clipboard!');
        }).catch((err) => {
            console.error('Failed to copy to clipboard: ', err);
        });
    }

    private readLocalStorage() {
        Utils.doIfBrowser(this.platform, () => {
            const allData: Record<string, string> = {};
            for (const key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    allData[key] = localStorage.getItem(key) || '';
                }
            }
            this.exportData = JSON.stringify(allData, null, 2);
        })
    }

    private deleteCategory(index: number) {
        if (this.selectedCategory!.id === this.categories[index].id) {
            this.selectedCategory = undefined
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

    protected readonly JSON = JSON;
}
