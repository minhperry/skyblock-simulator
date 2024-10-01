import {Component, OnInit} from '@angular/core';
import {Bomb, Fruit, FruitCell, Rum, State} from "../../interfaces/fruit-game";
import {Queue} from "../../interfaces/queue";

// https://wiki.hypixel.net/Carnival#Fruit_Digging
@Component({
    selector: 'app-fruit-digging',
    templateUrl: './fruit-digging.component.html',
    styleUrl: './fruit-digging.component.scss'
})
export class FruitDiggingComponent implements OnInit {
    Q = new Queue<FruitCell>()

    content = new Array(49).fill(State.HIDDEN)
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

    handleClick(index: number) {
        if (this.content[index] === State.HIDDEN) {
            const cell = this.fruitContent[index];
            this.Q.enqueue(cell)
            this.content[index] = cell;
        }
    }

    printQueue() {
        return this.Q.getQueue()
    }

    restart() {
        this.generateGrid()
        this.Q.clear()
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
