import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonUIService {

  loading: any;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async notify(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async notifyError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: 'danger',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async notifyOnChanges(msg, saveHandler, cancelHandler){
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      buttons:[
        {
          icon: 'disk',
          text: 'Save',
          handler: saveHandler
        },
        {
          text: 'Cancel',
          handler: cancelHandler
        },

      ]
    });
    toast.present();
  }

  async presentLoadingPage(message: string = null, duration: number = null) {
    this.loading = await this.loadingController.create({ message, duration });
    return await this.loading.present();
  }

  async dismissLoadingPage() {
    setTimeout(() => {
      if (this.loading !== undefined) {
        return this.loading.dismiss();
      }
    }, 1000);
  }

  async confirmDelete():Promise<any>{
    return new Promise(async (resolve) =>{
      const alert = await this.alertController.create({
        header: 'Confirm Deletion',
        message: 'Do you want to delete this item?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              resolve('cancel');
            }
          }, {
            text: 'Continue',
            handler: (ok) => {
              resolve('continue');
            }
          }
        ]
      });
      alert.present();
    })
  }

  async confirmAction(header:string, message:string):Promise<any>{
    return new Promise(async (resolve) =>{
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (cancel) => {
              resolve('cancel');
            }
          }, {
            text: 'Continue',
            handler: (ok) => {
              resolve('continue');
            }
          }
        ]
      });
      alert.present();
    })
  }
  
}
