import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@app/services/notification.service';
import { MenuController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorMessages } from 'src/app/services/error-messages';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;

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

  ngOnInit() {

  }

  get displayName() { return this.signupForm.get('displayName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  async signup(){
    try {
      const result = await this.authenticationService.registerUser(this.email.value, this.password.value, this.displayName.value);
      console.log(result);
      this.navController.navigateRoot('store/setup');
    }
    catch (error){
      console.log('SignupPage.signup(...)', error);

      this.notificationService.notify(error);
      throw error;
    }     
  }

  /*
  _signup() {
    this.signupService.email = this.email.value;
    this.signupService.password = this.password.value;
    this.signupService.invoke().subscribe(result => {
      console.log(result);
      this.navController.navigateRoot('store/setup');
    
    });
    this.signupService.invoke().subscribe(result => {
      this.notificationService.notify('Sign up completed');
      this.navController.navigateRoot('settings');
    });
    */
  

}
