import { BoolNumFunc, NumNumFunc, NumOrZero, NumStringFunc } from "./functions";
import {Signal, WritableSignal} from '@angular/core';


// Checkboxes
export interface CheckBoxItem {
    check: boolean,
    label: string,
    value: number,
    func: BoolNumFunc,
    text: string,
}

export interface CheckBoxItemSignal {
    check: WritableSignal<boolean>,
    label: string,
    value: number,
    result: Signal<number>
    text: string,
}

// Sliders
export interface SliderItem {
    min?: NumOrZero,
    max: number,
    step: number,
    label: string,
    preString: string,
    value: number,
    func: NumNumFunc,
    display?: NumStringFunc,
}


// Radio Buttons
export interface RadioItem {
    options: RadioMapItem[],
    label: string,
    title: string,
    choice: number
}

export interface RadioMapItem {
    value: number,
    text: string
}