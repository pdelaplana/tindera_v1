import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';

import { CONSTANTS } from '@app/app.constants';
import { ControlValueAccessor, FormControl } from '@angular/forms';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [CurrencyPipe]
})
export class CurrencyInputComponent implements OnInit, ControlValueAccessor {

  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';

  @ViewChild('dummyFacade', {static: false}) private dummyFacade: IonInput;

  @Input() precision: number;

  @Input() amountIn: number;
  amount: string;

  @Output() amountEntered = new EventEmitter<number>();

  propagateChange = (_: any) => {};

  constructor(private currencyPipe: CurrencyPipe) { }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.amount = value;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.amount = (+this.amountIn * Math.pow(10, this.precision)).toString();
    // if (this.amount && this.amount !== '') {
    //   this.amountEntered.emit(+this.amount);
    // }
  }

  handleKeyUp(event: KeyboardEvent) {
    // this handles keyboard input for backspace
    if (event.key === CurrencyInputComponent.BACKSPACE_KEY) {
      this.delDigit();
    }
  }

  handleInput(event: CustomEvent) {
    this.clearInput();
    // check if digit
    if (event.detail.data  &&  !isNaN(event.detail.data)) {
      this.addDigit(event.detail.data);
    } else if (event.detail.inputType === CurrencyInputComponent.BACKSPACE_INPUT_TYPE) {
      // this handles numpad input for delete/backspace
      this.delDigit();
    }
  }

  private reformat(amount: number) {
    return amount / Math.pow(10, this.precision);
  }
  private addDigit(key: string) {
    this.amount = this.amount + key;
    // this.amountEntered.emit(+this.amount);
    this.amountEntered.emit(this.reformat(+this.amount));
  }

  private delDigit() {
    this.amount = this.amount.substring(0, this.amount.length - 1);
    this.amountEntered.emit(this.reformat(+this.amount));
  }

  private clearInput() {
    this.dummyFacade.value = CONSTANTS.EMPTY; // ensures work for mobile devices
    // ensures work for browser
    /*
    this.dummyFacade.getInputElement().then((native: HTMLInputElement) => {
      native.value = CONSTANTS.EMPTY;
    });
    */
  }

  transformAmount(event: CustomEvent){
    this.amount = this.currencyPipe.transform(this.amountIn, 'USD');
    // Remove or comment this line if you dont want to show the formatted amount in the textbox.
    this.dummyFacade.value = this.formattedAmount;
  }

  get formattedAmount(): string {
    return this.currencyPipe.transform( (+this.amount / Math.pow(10, this.precision)));
  }

  openInput() {
    //this.dummyFacade.setFocus();
  }


}
