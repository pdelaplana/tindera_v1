import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [CurrencyPipe]
})
export class CurrencyInputComponent implements OnInit, AfterViewInit {

  private static BACKSPACE_KEY = 'Backspace';
  private static BACKSPACE_INPUT_TYPE = 'deleteContentBackward';
  private static TAB_KEY = 'Tab';

  @ViewChild('currencyInput') 
  private currencyInput: IonInput;

  @Input()
  currencyCode: string;

  @Input() 
  precision: number;

  @Input() 
  amount: number;
  
  @Output() 
  amountChange = new EventEmitter<number>();

  amountf: string;

  constructor(private currencyPipe: CurrencyPipe) { }
  
  ngAfterViewInit(): void {
    this.amountf = this.currencyPipe.transform(this.amount, this.currencyCode); 
    this.currencyInput.value = this.amountf;
  }

  ngOnInit() {
    
  }

  handleKeyDown (event: KeyboardEvent){
    //const pattern = /[0-9,.]/;
    const pattern = /^[0-9]*\.?[0-9]*$/;
    
    if ((event.key != CurrencyInputComponent.TAB_KEY) 
        && (event.key != CurrencyInputComponent.BACKSPACE_KEY) 
        && !pattern.test(event.key)) {
      // invalid character, prevent input
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  handleBlur(){
    this.amount = Number(this.currencyInput.value);
    this.amountf = this.currencyPipe.transform(this.amount, this.currencyCode);    
    this.currencyInput.value = this.amountf;
    this.amountChange.emit(this.amount);
  }

  handleFocus(){
    this.amountf = this.amount.toString();
    this.currencyInput.value = this.amountf;
    
    /*
    this.currencyInput.getInputElement().then((native: HTMLInputElement) => {
      native.select();
    });
    */
  }



}
