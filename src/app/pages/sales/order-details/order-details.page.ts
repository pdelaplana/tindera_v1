import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from '@app/models/order';
import { AppState } from '@app/state';
import { selectOrder } from '@app/state/orders/order.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  orderId:string;
  order: Order;
  orderDetailsForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    
  ) { 
    if (this.router.getCurrentNavigation().extras.state) {
      this.orderId = this.router.getCurrentNavigation().extras.state.orderId;
      
      this.store.select(selectOrder(this.orderId)).subscribe(order => {
        this.order = order;
      });
    }
  }

  ngOnInit() {
  }

}
