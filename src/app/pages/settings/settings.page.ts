import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  navigateToShop(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('settings/shop', navigationExtras);
  }

  navigateToProfile(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('settings/profile', navigationExtras);
  }

  navigateToChangePassword(){
    const navigationExtras: NavigationExtras = { state: {  } };
    this.navController.navigateForward('settings/changepassword', navigationExtras);
  }

}
