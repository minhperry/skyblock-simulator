import { BoolNumFunc, NumNumFunc, NumOrZero, NumStringFunc } from "./functions";

export interface CheckBoxItem {
    check: boolean,
    label: string,
    value: number,
    func: BoolNumFunc,
    text: string,
}

export interface SliderItem {
    min?: NumOrZero,
    max: number,
    step: number,
    label: string,
    preString: string,
    value: number,
    func: NumNumFunc,
    display?: NumStringFunc,
    extraStr?: string,
}

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