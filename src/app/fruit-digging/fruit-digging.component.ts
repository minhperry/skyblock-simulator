import {Component, OnInit} from '@angular/core';
import {Bomb, Fruit, FruitCell, Rum, ShovelMode, State} from "../../interfaces/fruit-game";
import {Nullable} from "../../interfaces/todo";

// https://wiki.hypixel.net/Carnival#Fruit_Digging
@Component({
    selector: 'app-fruit-digging',
    templateUrl: './fruit-digging.component.html',
    styleUrl: './fruit-digging.component.scss'
})
export class FruitDiggingComponent implements OnInit {
    // Q = new Queue<FruitCell>()
    debug = false

    points: number = 0; turn: number = 0;
    content = new Array(49).fill(State.HIDDEN)

    private apples: number = 0
    protected lastFruit: Nullable<FruitCell> = null
    public reason: string = '~'

    protected shovelMode: ShovelMode = ShovelMode.MINES
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
        this.points = 0
    }

    handleClick(index: number) {
        if (this.content[index] !== State.HIDDEN) return
        if (this.turn >= 15) return;

        const cell = this.fruitContent[index];
        // this.Q.enqueue(cell)
        this.content[index] = cell;
        this.processFruit(cell, index)
        this.lastFruit = cell
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

    restart() {
        this.generateGrid()
        // this.Q.clear()
        this.content.fill(State.HIDDEN)
        this.points = 0
        this.apples = 0
        this.turn = 0
        this.lastFruit = null
        this.reason = '~'
    }

    show() {
        this.content = [...this.fruitContent]
    }

    getFruitContents() {
        return this.fruitContent
    }

    private processFruit(content: FruitCell, index: number) {
        let toAdd = 0

        switch (content) {
            case Fruit.MANGO:
                toAdd = 300;
                this.reason = '+300'
                break;
            case Fruit.APPLE:
                toAdd = (this.apples) * 100;
                this.reason = `+${toAdd} ${this.apples}x 🍎`
                this.apples++
                break;
            case Fruit.WATERMELON:
                toAdd = 100;
                this.reason = '+100'
                this.blowUpAdjacent(index)
                break;
            case Fruit.POMEGRANATE:
                toAdd = 200;
                this.reason = '+200'
                break;
            case Fruit.COCONUT:
                toAdd = 200;
                this.reason = '+200'
                break;
            case Fruit.CHERRY:
                if (this.lastFruit === Fruit.CHERRY) {
                    toAdd = 500
                    this.reason = '+500 🍒🍒'
                } else {
                    toAdd = 200;
                    this.reason = '+200'
                }
                break;
            case Fruit.DURIAN:
                toAdd = 800;
                this.reason = '+800'
                break;
            case Fruit.DRAGONFRUIT:
                toAdd = 1200;
                this.reason = '+1200'
                break
            case Rum.RUM:
                toAdd = 1
                this.reason = '+1 ❌⛏❌' // 1 "encouraging point"
                break;
            case Bomb.BOMB:
                if (this.lastFruit !== Fruit.COCONUT) {
                    this.reason = '+0 💣'
                    this.destroySomeAdjacentFruits(index)
                } else {
                    this.reason = '+0 🥥🛟'
                }
        }

        switch (this.lastFruit) {
            case Fruit.POMEGRANATE:
                toAdd *= 1.5
                this.reason += ' x1.5 🎉'
                break
            case Fruit.DRAGONFRUIT: case Fruit.DURIAN:
                toAdd *= 0.5
                this.reason += ` x0.5 🌵`
                break
        }

        this.points += toAdd
        this.lastFruit = content
    }

    private blowUpAdjacent(index: number): void {
        const adjIdx = this.getAdjacentIndices(index);
        let validAdj = adjIdx
            .filter(adjIndex => this.content[adjIndex] === State.HIDDEN) // only take ones that are hidden
            .map(adjIndex => this.fruitContent[adjIndex]) // then map to fruitContent
            .filter(fruit => fruit !== Bomb.BOMB && fruit !== Rum.RUM) // and filtering out bombs and rums

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
                    this.blowUpAdjacent(index)
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
            this.reason += ` +${toAdd} 🍉`;

            const blownUpIndex = adjIdx.find(adjIndex => this.fruitContent[adjIndex] === randomFruit);
            if (blownUpIndex !== undefined) {
                this.content[blownUpIndex] = randomFruit;
            }
        }
    }

    private destroySomeAdjacentFruits(index: number): void {
        const adjacentIndices = this.getAdjacentIndices(index);

        // Filter only the hidden fruits (non-bomb) that can be destroyed
        const destroyableFruits = adjacentIndices.filter(adjIndex =>
            this.content[adjIndex] === State.HIDDEN && this.fruitContent[adjIndex] !== Bomb.BOMB
        );

        // Define how many to destroy - in this case, we destroy 50% of the adjacent fruits
        const numToDestroy = Math.floor(destroyableFruits.length / 2);

        // Shuffle the destroyableFruits to pick a random subset
        this.shuffle(destroyableFruits);

        // Destroy the selected number of fruits
        for (let i = 0; i < numToDestroy; i++) {
            this.content[destroyableFruits[i]] = State.DESTROYED;
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

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
