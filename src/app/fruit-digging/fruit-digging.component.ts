import {Component, OnInit} from '@angular/core';
import {Bomb, Fruit, FruitCell, isFruit, Rum, State} from "../../interfaces/fruit-game";
import {Queue} from "../../interfaces/collections";
import {Nullable} from "../../interfaces/todo";

// https://wiki.hypixel.net/Carnival#Fruit_Digging
@Component({
    selector: 'app-fruit-digging',
    templateUrl: './fruit-digging.component.html',
    styleUrl: './fruit-digging.component.scss'
})
export class FruitDiggingComponent implements OnInit {
    Q = new Queue<FruitCell>()
    Qstr = new Queue<string>()

    points: number = 0; turn: number = 0;
    content = new Array(49).fill(State.HIDDEN)

    private prevent = false;
    private clickedCoconut = false
    private half = false;
    private onehalf = false;

    private apples: number = 0
    private lastFruit: Nullable<FruitCell> = null

    private fruitContent: FruitCell[] = new Array(49).fill(null)
    private freq: { [key in Fruit | Bomb]: number } = {
        [Fruit.MANGO]: 10,
        [Fruit.APPLE]: 8,
        [Fruit.WATERMELON]: 4,
        [Fruit.POMEGRANATE]: 4,
        [Fruit.COCONUT]: 3,
        [Fruit.CHERRY]: 2,
        [Fruit.DRAGONFRUIT]: 1,
        [Fruit.DURIAN]: 2,
        [Bomb.BOMB]: 15
    };

    ngOnInit() {
        this.generateGrid()
    }

    get states(): string {
        return `prevent=${this.emoji(this.prevent)}, onehalf=${this.emoji(this.onehalf)}, ` +
            `half=${this.emoji(this.half)}, clickCoconut=${this.emoji(this.clickedCoconut)}`;
    }

    handleClick(index: number) {
        if (this.content[index] !== State.HIDDEN) return
        if (this.turn > 15) return;

        let prev = this.prevent
        const cell = this.fruitContent[index];
        this.Q.enqueue(cell)
        this.content[index] = cell;
        if (isFruit(cell))
            this.processFruit(cell, index)
        else if (cell === Bomb.BOMB) {
            this.clickedCoconut = false
            if (!prev) {
                this.destroyAdjacentFruits(index)
            }
        }
        if (prev) {
            if (!this.clickedCoconut)
                this.prevent = false
        }
        this.turn++
    }

    generateGrid() {
        for (let i = 0; i <= 49; i++) {
            const available = Object.entries(this.freq).flatMap(
                ([item, fr]) => Array(fr).fill(item)
            )

            for (let _ = 0; _ < 5; _++) {
                this.shuffle(available)
            }

            for (let i = 0; i < this.fruitContent.length; i++) {
                if (available.length > 0) {
                    const randomItem = available.pop();
                    this.fruitContent[i] = randomItem || null;
                }
            }
        }
        this.replaceSomeWithRum()
    }

    private emoji(val: boolean) {
        if (val) return "✅"; else return "❌";
    }

    restart() {
        this.generateGrid()
        this.Q.clear()
        this.Qstr.clear()
        this.content.fill(State.HIDDEN)
        this.points = 0
        this.apples = 0
        this.turn = 0
        this.resetAbilities()
        this.lastFruit = null
    }

    show() {
        this.content = [...this.fruitContent]
    }

    getFruitContents() {
        return this.fruitContent
    }

    private resetAbilities(): void {
        this.half = false
        this.onehalf = false
        this.prevent = false
        this.clickedCoconut = false
    }

    private processFruit(content: FruitCell, index: number) {
        let toAdd = 0
        let [halfLast, ohalfLast] = [this.half, this.onehalf]

        switch (content) {
            case Fruit.MANGO:
                toAdd = 300;
                this.resetAbilities()
                break;
            case Fruit.APPLE:
                toAdd = (this.apples++) * 100;
                this.resetAbilities()
                break;
            case Fruit.WATERMELON:
                toAdd = 100;
                this.blowUpAdjacent(index)
                this.resetAbilities()
                break;
            case Fruit.POMEGRANATE:
                toAdd = 200;
                this.onehalf = true
                break;
            case Fruit.COCONUT:
                toAdd = 100;
                this.prevent = true
                this.clickedCoconut = true
                this.onehalf = false
                this.half = false
                break;
            case Fruit.CHERRY:
                toAdd = 200;
                if (this.lastFruit === Fruit.CHERRY) {
                    toAdd = 500;
                }
                this.resetAbilities()
                break;
            case Fruit.DURIAN:
                toAdd = 800;
                this.half = true
                break;
            case Fruit.DRAGONFRUIT:
                toAdd = 1200;
                this.half = true
                break
        }
        console.log("after swich: prevent=", this.prevent)

        if (ohalfLast) { toAdd *= 1.5 }
        if (halfLast) { toAdd *= 0.5 }

        this.points += toAdd
        this.Qstr.enqueue("+" + toAdd)
        this.lastFruit = content
    }

    private blowUpAdjacent(index: number): void {
        const adjIdx = this.getAdjacentIndices(index);
        const validAdj = adjIdx
            .filter(adjIndex => this.content[adjIndex] === State.HIDDEN) // only take ones that are hidden
            .map(adjIndex => this.fruitContent[adjIndex]) // then map to fruitContent
            .filter(fruit => fruit !== Bomb.BOMB) // and filtering out bombs
            .filter(fruit => fruit != Rum.RUM)

        if (validAdj.length > 0) {
            const randomFruit = validAdj[Math.floor(Math.random() * validAdj.length)];
            let toAdd = 0;

            switch (randomFruit) {
                case Fruit.MANGO:
                    toAdd = 300 / 2;
                    break;
                case Fruit.APPLE:
                    toAdd = this.apples * 50;
                    break;
                case Fruit.WATERMELON:
                    toAdd = 100 / 2;
                    break;
                case Fruit.POMEGRANATE:
                    toAdd = 200 / 2;
                    break;
                case Fruit.COCONUT:
                    toAdd = 200 / 2;
                    break;
                case Fruit.CHERRY:
                    toAdd = 200 / 2;
                    break;
                case Fruit.DURIAN:
                    toAdd = 800 / 2;
                    break;
                case Fruit.DRAGONFRUIT:
                    toAdd = 1200 / 2;
                    break;
            }

            this.points += toAdd;
            this.Qstr.enqueue("blow+" + toAdd)

            const blownUpIndex = adjIdx.find(adjIndex => this.fruitContent[adjIndex] === randomFruit);
            if (blownUpIndex !== undefined) {
                this.content[blownUpIndex] = randomFruit;
            }
        }
    }

    private destroyAdjacentFruits(index: number): void {
        const adjacentIndices = this.getAdjacentIndices(index);
        for (const adjIndex of adjacentIndices) {
            const fruit = this.fruitContent[adjIndex]
            if (this.content[adjIndex] === State.HIDDEN && fruit !== Bomb.BOMB) {
                this.content[adjIndex] = State.DESTROYED; // Set state to DESTROYED
            }
        }
    }

    private getAdjacentIndices(index: number): number[] {
        const adjacentIndices = [];
        const row = Math.floor(index / 7);
        const col = index % 7;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < 7 && c >= 0 && c < 7 && !(r === row && c === col)) {
                    adjacentIndices.push(r * 7 + c);
                }
            }
        }
        return adjacentIndices;
    }

    private shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Replace 5 slots with rum if it's mango or apple
    private replaceSomeWithRum() {
        let val = 5;
        while (val > 0) {
            let slot = this.randomInterval(0, 48)
            if (this.fruitContent[slot] === Fruit.MANGO || this.fruitContent[slot] === Fruit.APPLE) {
                this.fruitContent[slot] = Rum.RUM
                val--
            }
        }
    }

    private randomInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
