import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonUIService } from '@app/services/common-ui.service';
import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { MenuController, NavController } from '@ionic/angular';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  
  changePasswordForm : FormGroup;
  
  constructor(
    private store: Store<AppState>,
    private actions: ActionsSubject, 
    private formBuilder: FormBuilder,
    private commonUIService: CommonUIService,
    private navController: NavController,
  ) { 
    this.changePasswordForm = this.formBuilder.group({
       currentPassword: ['', Validators.required],
       newPassword: ['',Validators.required],
       confirmPassword: ['',Validators.required],
    },
    {
      validators: this.checkIfPasswordsMatch
    });

    this.subscription
      .add(
        this.actions.pipe(
          ofType(AuthActions.changePasswordFail),
        ).subscribe(action =>{
          this.commonUIService.notifyError(action.error);
        })
      )
      .add(
        this.actions.pipe(
          ofType(AuthActions.changePasswordSuccess),
        ).subscribe(action =>{
          this.commonUIService.notify('Your password has been changed.  Please log in with a new password');
          this.store.dispatch(AuthActions.logout());
          this.navController.navigateRoot('login');
        })
      )
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

  private checkIfPasswordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');

    /*
    if (confirmPassword.errors && !confirmPassword.errors.notSame) {
      return { 'passwords_match': false };
    }
    */
   
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ notSame: true });
      return {'passwords_match': true};
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }


  get currentPassword() { return this.changePasswordForm.get('currentPassword'); }
  set currentPassword(value: any) { this.changePasswordForm.get('currentPassword').setValue(value); }
  
  get newPassword() { return this.changePasswordForm.get('newPassword'); }
  set newPassword(value: any) { this.changePasswordForm.get('newPassword').setValue(value); }
  
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword'); }
  set confirmPassword(value: any) { this.changePasswordForm.get('confirmPassword').setValue(value); }
  

  change(){
    if (this.changePasswordForm.valid){
      this.store.dispatch(AuthActions.changePassword({
        newPassword: this.newPassword.value,
        oldPassword: this.currentPassword.value
      }))
    }
    
  }
}
