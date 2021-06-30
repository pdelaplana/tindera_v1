import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-payment-type-badge',
  templateUrl: './payment-type-badge.component.html',
  styleUrls: ['./payment-type-badge.component.scss'],
})
export class PaymentTypeBadgeComponent implements OnInit, OnChanges {

  @Input() text: string;
  @Input() color: string;

  public styles = {
    backgroundColor: '#fff',
    color: '#000'
  };
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.text = changes.text ? changes.text.currentValue : null;
    this.color = changes.color ? changes.color.currentValue : null;
  }

  ngOnInit() {}

}
