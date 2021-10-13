import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '@app/models/cart-item';
import { Order } from '@app/models/order';
import { OrderItem } from '@app/models/order-item';
import { OrderItemAddon } from '@app/models/order-item-addon';
import { PaymentType } from '@app/models/payment-type';
import { User } from '@app/models/user';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { selectAuthUser } from '@app/state/auth/auth.selectors';
import { cartActions } from '@app/state/cart/cart.actions';
import { selectCartItems } from '@app/state/cart/cart.selectors';
import { orderActions } from '@app/state/orders/order.actions';
import { IonInput, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  private user: User;

  currencyCode: string;
  paymentTypes: PaymentType[];
  cartItems$: Observable<CartItem[]>;

  totalCartAmount: number;

  checkoutForm: FormGroup;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private commonUIService: CommonUIService,
    private navController: NavController
  ) { 
    this.store.select(selectAuthUser())
      .subscribe( user => this.user = user);
    this.store.select(state => state.shop)
      .subscribe((shop) => {
        this.currencyCode = shop.currencyCode;
        this.paymentTypes = shop.paymentTypes;
      });
    this.cartItems$ = this.store.select(selectCartItems());

    this.cartItems$
      .subscribe((items) => {
        this.totalCartAmount = items.map(item => item.amount).reduce((a,b)=> a + b, 0)
      });

    this.checkoutForm = this.formBuilder.group({
      totalAmount: [0.00, Validators.required],
      customerName: [''],
      customerEmail: [''],
      customerPhone: [''],
      customerReference: [''],
      paymentType: [this.paymentTypes[0]],
      payment: [0.00],
      paymentf: [this.currencyPipe.transform(0, this.currencyCode)],
      changeDue: [0.00]
    });

    this.subscription
    .add(
      this.actions.pipe(
        ofType(orderActions.createOrderSuccess),
      ).subscribe(action =>{
        this.store.dispatch(cartActions.clearCart());
        this.navController.navigateRoot('order');
      })
    )
  
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  get totalAmount() { return this.checkoutForm.get('totalAmount'); }
  set totalAmount(value: any) { this.checkoutForm.get('totalAmount').setValue(value); }

  get customerName() { return this.checkoutForm.get('customerName'); }
  set customerName(value: any) { this.checkoutForm.get('customerName').setValue(value); }

  get customerPhone() { return this.checkoutForm.get('customerPhone'); }
  set customerPhone(value: any) { this.checkoutForm.get('customerPhone').setValue(value); }

  get customerEmail() { return this.checkoutForm.get('customerEmail'); }
  set customerEmail(value: any) { this.checkoutForm.get('customerEmail').setValue(value); }

  get customerReference() { return this.checkoutForm.get('customerReference'); }
  set customerReference(value: any) { this.checkoutForm.get('customerReference').setValue(value); }

  get paymentType() { return this.checkoutForm.get('paymentType'); }
  set paymentType(value: any) { this.checkoutForm.get('paymentType').setValue(value); }

  get paymentf() { return this.checkoutForm.get('paymentf'); }
  set paymentf(value: any) { this.checkoutForm.get('paymentf').setValue(value); }

  get payment() { return this.checkoutForm.get('payment'); }
  set payment(value: any) { this.checkoutForm.get('payment').setValue(value); }

  get changeDue() { return this.checkoutForm.get('changeDue'); }
  set changeDue(value: any) { this.checkoutForm.get('changeDue').setValue(value); }

  
  amountChange(value: number) {
    this.payment = value;
    this.changeDue = this.payment.value - this.totalCartAmount;
    const formattedPayment = this.currencyPipe.transform(this.payment.value, this.currencyCode);    
    this.paymentf = formattedPayment;
  }

  complete(){
    this.commonUIService.confirmAction('Complete Checkout', 'This will complete this order.').then(result => {
      if (result == 'continue') {
        let orderItems = [];
        this.cartItems$.subscribe(items => {
          orderItems = items.map(item => <OrderItem>{
            productId: item.productId,
            productName: item.product.name,
            productDescription: item.product.description,
            productUnitPrice: item.product.price,
            productCategory: item.product.productCategory.description,
            quantity: item.quantity,
            addons: item.addons.map(addon => <OrderItemAddon>{
              itemId: addon.itemId,
              name: addon.name,
              price: addon.price,
              quantity: addon.quantity
            })
          })
        });
        this.store.dispatch(orderActions.createOrder({
          order: <Order>{
            id: '',
            orderDate: new Date(),
            customerName: this.customerName.value,
            customerEmail: this.customerEmail.value,
            customerPhone: this.customerPhone.value,
            customerReference: this.customerReference.value,
            paymentType: this.paymentType.value,
            paymentReceived: (this.paymentType.value == 'CASH'),
            totalSale: this.totalCartAmount,
            orderItems: orderItems,
            servedBy: this.user,
          }
        }))
      
      }
    });
  }
}
