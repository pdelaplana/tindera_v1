import { Component, OnInit } from '@angular/core';
import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { MenuController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(
    private navController: NavController,
    private store: Store<AppState>,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.logout());
    this.menuController.enable(false);
  }

  goToLogin() {
    this.navController.navigateRoot('login');
  }

}
