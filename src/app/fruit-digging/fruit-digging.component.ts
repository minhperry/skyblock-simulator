import {Component, OnInit} from '@angular/core';
import {Bomb, Fruit, FruitCell, Rum, ShovelMode, State} from "../../interfaces/fruit-game";
import {Nullable} from "../../interfaces/todo";
import {Queue} from "../../interfaces/collections";
import {CommonModule} from "@angular/common";
import {RollingNumberComponent} from "../animation/rolling-number/rolling-number.component";

// https://wiki.hypixel.net/Carnival#Fruit_Digging
@Component({
  selector: 'app-fruit-digging',
  templateUrl: './fruit-digging.component.html',
  styleUrl: './fruit-digging.component.scss',
    imports: [CommonModule, RollingNumberComponent]
})
export class FruitDiggingComponent implements OnInit {
    Q = new Queue<FruitCell>()
    debug = false

    points: number = 0;
    turn: number = 0;
    lastClicked = 0
    content = new Array(49).fill(State.HIDDEN)

    private apples: number = 0
    protected lastFruit: Nullable<FruitCell> = null
    public reason: string = '~'

    protected shovelMode: ShovelMode = ShovelMode.MINES
    protected shovelModeDesc = this.getModeDesc(this.shovelMode)
    protected shovelMessage: string = '-'

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
        this.shovelMode = ShovelMode.MINES
        this.shovelModeDesc = this.getModeDesc(this.shovelMode)
        this.shovelMessage = '-'
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

        let now = Date.now();
        if (now - this.lastClicked < 750) {
            return;
        }
        this.lastClicked = Date.now()

        const cell = this.fruitContent[index];
        this.content[index] = cell;
        this.processFruit(cell, index)

        this.triggerDowsing(index)
        if (cell === Rum.RUM) {
            this.shovelMessage =
                `<b class="mc red">RUM!</b> Dowsing disabled for a turn!`
        }
        if (this.lastFruit == Rum.RUM) {
            this.shovelMessage =
                `<b class="mc darkred">DISABLED!</b> Nothing happens.`
        }

        this.lastFruit = cell
        this.Q.enqueue(cell)
        this.turn++
    }

    changeMode() {
        switch (this.shovelMode) {
            case ShovelMode.MINES:
                this.shovelMode = ShovelMode.ANCHOR;
                break
            case ShovelMode.ANCHOR:
                this.shovelMode = ShovelMode.TREASURE;
                break
            case ShovelMode.TREASURE:
                this.shovelMode = ShovelMode.MINES;
                break
        }
        this.shovelModeDesc = this.getModeDesc(this.shovelMode)
    }

    private getModeDesc(mode: ShovelMode) {
        switch (mode) {
            case ShovelMode.ANCHOR:
                return "Location of lowest scoring fruit."
            case ShovelMode.TREASURE:
                return "Highest scoring fruit."
            case ShovelMode.MINES:
                return "How many mines are around."
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
                toAdd = 8
                this.reason = '+8 ❌' // 8 "encouraging point"
                break;
            case Bomb.BOMB:
                // encouraging points, 2 when exploded, 4 when saved by coconut
                if (this.lastFruit !== Fruit.COCONUT) {
                    toAdd = 2
                    this.reason = '+2 💣'
                    this.destroySomeAdjacentFruits(index)
                } else {
                    toAdd = 4
                    this.reason = '+4 🥥🛟'
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

        if (validAdjFruits.length > 0) {
            const randomFruit = validAdjFruits[Math.floor(Math.random() * validAdjFruits.length)];
            let toAdd = 0;

            const blownUpIndex = adjIdx.find(adjIndex => this.fruitContent[adjIndex] === randomFruit);
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

    // TODO: (Bug) Bomb can explode 0 tiles
    private destroySomeAdjacentFruits(index: number): void {
        const adjacentIndices = this.getAdjacentIndices(index);

        // Filter only the hidden fruits (non-bomb) that can be destroyed
        const destroyableFruits = adjacentIndices.filter(adjIndex =>
            this.content[adjIndex] === State.HIDDEN && this.fruitContent[adjIndex] !== Bomb.BOMB
        );

        // Define how many to destroy - in this case, we destroy 50% of the adjacent fruits
        let numToDestroy = Math.floor(destroyableFruits.length / 2)
        numToDestroy = numToDestroy > 0 ? numToDestroy : 1

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

    private getAdjacentFruitIndicies(index: number): number[] {
        return this.getAdjacentIndices(index)
            .filter((i) => this.fruitContent[i] !== Bomb.BOMB && this.fruitContent[i] !== Rum.RUM)
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
                this.getAdjLowestFruit(index)
                break
            case ShovelMode.TREASURE:
                this.getAdjHighestPts(index)
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

    private getAdjLowestFruit(index: number) {
        const adjacentFruitIndices = this.getAdjacentFruitIndicies(index)
            .filter((i) => this.content[i] === State.HIDDEN)

        if (adjacentFruitIndices.length === 0) {
            this.shovelMessage =
                `<b class="mc aqua">ANCHOR!</b> There are no fruits nearby!`
            return
        }

        let lowestIdx = adjacentFruitIndices[0]
        for (let idx of adjacentFruitIndices) {
            if (this.getBasePointsAsFruitAtIndex(lowestIdx) >= this.getBasePointsAsFruitAtIndex(idx)) {
                lowestIdx = idx
            }
        }

        let fruit = this.fruitContent[lowestIdx]
        let fruitMsg = this.capitalize(fruit)
        let fruitColor = this.getFruitColor(fruit)
        let relativeIdx = this.getRelativeIndex(index, lowestIdx)
        this.shovelMessage =
            `<b class="mc aqua">ANCHOR!</b> There is one <span class="mc ${fruitColor}">${fruitMsg}</span> at ${relativeIdx}`
    }

    private getAdjHighestPts(index: number) {
        const adjacentFruitIndices = this.getAdjacentFruitIndicies(index)
            .filter((i) => this.content[i] === State.HIDDEN)

        if (adjacentFruitIndices.length === 0) {
            this.shovelMessage =
                `<b class="mc gold">TREASURE!</b> There are no fruits nearby!`
            return
        }

        let highestIdx = adjacentFruitIndices[0]
        for (let idx of adjacentFruitIndices) {
            if (this.getBasePointsAsFruitAtIndex(highestIdx) <= this.getBasePointsAsFruitAtIndex(idx)) {
                highestIdx = idx
            }
        }

        let fruit = this.fruitContent[highestIdx]
        let fruitMsg = this.capitalize(fruit)
        let fruitColor = this.getFruitColor(fruit)
        this.shovelMessage =
            `<b class="mc gold">TREASURE!</b> There is a(n) <span class="mc ${fruitColor}">${fruitMsg}</span> nearby!`
    }

    private getRelativeIndex(_this: number, _of: number) {
        let [thisRow, thisCol] = [Math.floor(_this / 7), _this % 7]
        let [ofRow, ofCol] = [Math.floor(_of / 7), _of % 7]
        let [dRow, dCol] = [thisRow - ofRow, thisCol - ofCol]

        let retStr = ''
        if (dCol === 1) retStr += '←'; else if (dCol === -1) retStr += '→'
        if (dRow === 1) retStr += '↑'; else if (dRow === -1) retStr += '↓'
        return retStr
    }

    private getBasePointsAsFruitAtIndex(index: number) {
        return this.getBasePoints(this.fruitContent[index] as Fruit)
    }

    private getBasePoints(fruit: Fruit) {
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
        }
    }

    private getFruitColor(fruit: FruitCell) {
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
            default:
                return ""
        }
    }

    private randomInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
