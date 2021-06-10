import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { MenuController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ErrorMessages } from 'src/app/services/error-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;

  subscription: Subscription = new Subscription();

  errorMessages = ErrorMessages.login;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private actions: ActionsSubject,
    private menuController: MenuController,
    private navController: NavController,
    private commonUIService: CommonUIService
  ) { 
    this.menuController.enable(false);
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // clear any loading overlays
    this.commonUIService.dismissLoadingPage();
    // disable side menu
    this.menuController.enable(false);
    // subscribe to actions
    this.subscription
      .add(
        this.actions.pipe(ofType(AuthActions.loginSuccess)).subscribe(data => {
          console.log('login Success');
          // check if store has been setup
          if (data.shopIds.length > 0) {
            this.menuController.enable(true);
            this.navController.navigateRoot('order');
          } else {
            this.navController.navigateRoot('setup/store');
          }
          
        })
      )
     .add(
       this.actions.pipe(ofType(AuthActions.loginFailed)).subscribe(data => {
         console.log('login fail');
         this.username.setErrors({ loginFailed: true });
         this.password.setErrors({ loginFailed: true });
         this.loginForm.reset(this.loginForm.value);
         this.commonUIService.notifyError('Login failed.  Please try again.');
       })
     );
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login(){

    this.store.dispatch(AuthActions.login({
      email: this.username.value,
      password: this.password.value
    }));
  }

}
