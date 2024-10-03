import {Component, OnInit} from '@angular/core';
import {Bomb, Fruit, FruitCell, Rum, ShovelMode, State} from "../../interfaces/fruit-game";
import {Nullable} from "../../interfaces/todo";
import {Queue} from "../../interfaces/collections";

// https://wiki.hypixel.net/Carnival#Fruit_Digging
@Component({
    selector: 'app-fruit-digging',
    templateUrl: './fruit-digging.component.html',
    styleUrl: './fruit-digging.component.scss'
})
export class FruitDiggingComponent implements OnInit {
    Q = new Queue<FruitCell>()
    debug = false

    points: number = 0; turn: number = 0;
    content = new Array(49).fill(State.HIDDEN)

    private apples: number = 0
    protected lastFruit: Nullable<FruitCell> = null
    public reason: string = '~'

    protected shovelMode: ShovelMode = ShovelMode.MINES
    protected shovelModeDesc = 'How many mines are around.'
    protected shovelMessage: string = ''

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

    generateGrid() {
        let available = Object.entries(this.freq).flatMap(
            ([item, fr]) => Array(fr).fill(item)
        )

        for (let _ = 0; _ <= 100; _++) {
            this.shuffle(available)
        }

        for (let i = 0; i < this.fruitContent.length; i++) {
            if (available.length > 0) {
                this.fruitContent[i] = available.pop();
            }
        }

        this.replaceSomeWithRum()
    }

    restart() {
        this.generateGrid()
        this.Q.clear()
        this.content.fill(State.HIDDEN)
        this.points = 0
        this.apples = 0
        this.turn = 0
        this.lastFruit = null
        this.reason = '~'
        console.clear()
    }

    show() {
        this.content = [...this.fruitContent]
    }

    getFruitContents() {
        return this.fruitContent
    }

    handleClick(index: number) {
        if (this.content[index] !== State.HIDDEN) return
        if (this.turn >= 15) return;

        const cell = this.fruitContent[index];
        this.content[index] = cell;
        this.processFruit(cell, index)
        this.triggerDowsing(index)
        this.lastFruit = cell
        this.Q.enqueue(cell)
        this.turn++
    }

    changeMode() {
        switch (this.shovelMode) {
            case ShovelMode.MINES:
                this.shovelMode = ShovelMode.ANCHOR;
                this.shovelModeDesc = "Relative location of the lowest scoring fruit."
                break
            case ShovelMode.ANCHOR:
                this.shovelMode = ShovelMode.TREASURE;
                this.shovelModeDesc = "Highest scoring fruit."
                break
            case ShovelMode.TREASURE:
                this.shovelMode = ShovelMode.MINES;
                this.shovelModeDesc = "How many mines are around."
                break
        }
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
                if (this.Q.queue.includes(Fruit.CHERRY)) {
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
                toAdd = 2
                this.reason = '+2 ❌⛏❌' // 1 "encouraging point"
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
            case Fruit.DURIAN:
                toAdd *= 0.5
                this.reason += ` x0.5 🌵`
                break
        }

        this.points += toAdd
    }

    private blowUpAdjacent(index: number): void {
        const adjIdx = this.getAdjacentIndices(index)
            .filter((idx) => this.content[idx] === State.HIDDEN) // only get adjacent index that is hidden.
        let validAdjFruits = adjIdx
            .filter(adjIndex => this.content[adjIndex] === State.HIDDEN) // only take ones that are hidden
            .map(adjIndex => this.fruitContent[adjIndex]) // then map to fruitContent
            .filter(fruit => fruit !== Bomb.BOMB && fruit !== Rum.RUM) // and filtering out bombs and rums
        console.log("adjacentIndex", adjIdx, "\nvalidAdj", validAdjFruits)

        if (validAdjFruits.length > 0) {
            const randomFruit = validAdjFruits[Math.floor(Math.random() * validAdjFruits.length)];
            let toAdd = 0;

            const blownUpIndex = adjIdx.find(adjIndex => this.fruitContent[adjIndex] === randomFruit);
            console.log("blowing up", blownUpIndex, "with fruit", this.fruitContent[blownUpIndex!])
            if (blownUpIndex !== undefined) {
                setTimeout(() => {
                    this.content[blownUpIndex] = randomFruit;
                    if (randomFruit === Fruit.WATERMELON)
                        this.blowUpAdjacent(blownUpIndex)
                }, 300)
            }

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
            this.reason += ` +${toAdd} 🍉`;
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

    private triggerDowsing(index: number) {
        if (this.lastFruit === Rum.RUM) return
        switch (this.shovelMode) {
            case ShovelMode.MINES:
                this.countAdjacentMines(index)
                break;
            case ShovelMode.ANCHOR:
                this.getAdjHighestFruit(index)
                break
            case ShovelMode.TREASURE:
                this.getNearestLowestPoint(index)
                break
        }
    }

    private countAdjacentMines(index: number) {
        const count = this.getAdjacentIndices(index)
            .filter((i) => this.fruitContent[i] === Bomb.BOMB)
            .length
        this.shovelMessage =
            `<b class="mc red">BOMB!</b> There are <span class="mc red">${count}</span> nearby bombs!`
    }

    private getAdjHighestFruit(index: number) {
        const adjacentFruitIndices = this.getAdjacentIndices(index);
        let highestFruitIdx = adjacentFruitIndices[0]
        for (let idx of adjacentFruitIndices) {
            if (this.getBasePoints(this.fruitContent[highestFruitIdx]) < this.getBasePoints(this.fruitContent[idx])) {
                highestFruitIdx = idx
            }
        }
        this.shovelMessage =
            `<b class="mc aqua">ANCHOR!</b> The highest scoring fruit adjacent is: ${this.fruitContent[highestFruitIdx]}}`
    }

    private getNearestLowestPoint(index: number) {
        const adjacentFruitIndices = this.getAdjacentIndices(index);
        let lowestFruitIdx = adjacentFruitIndices[0]
        for (let idx of adjacentFruitIndices) {
            if (this.getBasePoints(this.fruitContent[lowestFruitIdx]) > this.getBasePoints(this.fruitContent[idx])) {
                lowestFruitIdx = idx
            }
        }
        console.log(`The lowest scoring fruit adjacent is: ${lowestFruitIdx}`);
    }

    private getRelativeIndex(_this: number, _of: number) {
        let [thisRow, thisCol] = [Math.floor(_this / 7), _this % 7]
        let [ofRow, ofCol] = [Math.floor(_of / 7), _of % 7]
        let [dRow, dCol] = [thisRow - ofRow, thisCol - ofCol]

        let retStr = ''
        if (dCol === -1) retStr += '1 left'; else if (dCol === 1) retStr += '1 right'
        if (dRow === -1) retStr += '1 up'; else if (dRow === 1) retStr += '1 down'
        return retStr
    }

    private getBasePoints(fruit: FruitCell) {
        switch (fruit) {
            case Fruit.MANGO:
                return 300;
            case Fruit.APPLE:
            case Fruit.WATERMELON:
                return 100;
            case Fruit.POMEGRANATE:
            case Fruit.CHERRY:
            case Fruit.COCONUT:
                return 200;
            case Fruit.DURIAN:
                return 800;
            case Fruit.DRAGONFRUIT:
                return 1200;
            default:
                return 0
        }
    }

    private getFruitColor(fruit: Fruit) {
        switch (fruit) {
            case Fruit.MANGO:
            case Fruit.APPLE:
                return "green";
            case Fruit.WATERMELON:
            case Fruit.POMEGRANATE:
                return "blue";
            case Fruit.COCONUT:
            case Fruit.CHERRY:
            case Fruit.DURIAN:
                return "purple";
            case Fruit.DRAGONFRUIT:
                return "pink";
        }
    }

    private randomInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
