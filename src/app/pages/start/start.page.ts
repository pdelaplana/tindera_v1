import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication.service';
import { AppState } from '@app/state';
import { MenuController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  constructor(
    private store: Store<AppState>,
    private navController: NavController,
    private menuController: MenuController,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  
    this.menuController.enable(false);

    
  }

  goToLogin(){
    this.navController.navigateForward('/login');
  }

  goToSignup(){
    this.navController.navigateForward('/signup');
  }

}
