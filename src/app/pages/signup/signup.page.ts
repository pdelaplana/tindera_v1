import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/services/notification.service';
import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { MenuController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorMessages } from 'src/app/services/error-messages';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {

  signupForm: FormGroup;

  subscription: Subscription = new Subscription();

  errorMessages = ErrorMessages.signup;

  private checkIfPasswordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (confirmPassword.errors && !confirmPassword.errors.notSame) {
      return;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ notSame: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private formBuilder: FormBuilder,
    private menuController: MenuController,
    private navController: NavController,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) { 
    this.menuController.enable(false);
    this.signupForm = this.formBuilder.group({
      displayName: new FormControl('',Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(10),
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.minLength(6),
        // Validators.maxLength(10),
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]))
    },
    {
      validator: this.checkIfPasswordsMatch
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription
      .add(
        this.actions.pipe(
          ofType(AuthActions.registerUserSuccess)
        ).subscribe(action => {
          this.store.dispatch(AuthActions.login({email: action.email, password: this.password.value }));
        })
      )
      .add(
        this.actions.pipe(
          ofType(AuthActions.loginSuccess)
        ).subscribe(action =>{
          this.navController.navigateRoot('store/setup');
          this.store.dispatch(AuthActions.clearAuthActions());
        })
      )
  }

  get displayName() { return this.signupForm.get('displayName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  async signup(){

    this.store.dispatch(AuthActions.registerUser({
      email: this.email.value,
      password: this.password.value,
      displayName: this.displayName.value
    }));
     
  }
}
