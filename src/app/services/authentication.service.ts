import { Injectable, NgZone } from '@angular/core';
import { } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import * as firebase from 'firebase/app';
import { UserProfileService } from './firestore/user-profile.service';
import { UserProfile } from '@app/models/user-profile';
import { AuthState } from '@app/state/auth/auth.state';
import { ShopService } from './firestore/shop.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState: any;

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private userProfileService: UserProfileService,
    private shopService: ShopService,
    private router: Router,  
    private ngZone: NgZone 
  ) { 
    this.fireauth.authState.subscribe(async (user) => {
      if (user) {
        this.shopService.getShopsForUser(user.uid).subscribe(shops => {
          this.authState = <AuthState>{
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            shopIds: shops.map(shop => shop.id),
            isAuthenticated: true
          };
          localStorage.setItem('authState', JSON.stringify(this.authState));
          JSON.parse(localStorage.getItem('authState'));
        });
        
      } else {
        localStorage.setItem('authState', null);
        JSON.parse(localStorage.getItem('authState'));
      }
    })
  }

  signin(email: string, password: string){
    return this.fireauth.signInWithEmailAndPassword(email, password)
  }

  async registerUser(email: string, password: string, displayName: any) {
    const credential = await this.fireauth.createUserWithEmailAndPassword(email, password);
    credential.user.updateProfile({
      displayName: displayName
    });
    return credential;
  }

  sendVerificationMail() {
    return this.fireauth.currentUser.then(user => user.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      })
  }

  async updateProfile(displayName: string){
    return this.fireauth.currentUser.then(user => user.updateProfile({
      displayName: displayName
    }))
  }

  async changePassword(currentPassword: string, newPassword: string){
    const user = await this.fireauth.currentUser;
    const credentials = firebase.default.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(credentials).then(credential => {
      credential.user.updatePassword(newPassword);
    })
  }

  // Recover password
  async recoverPassword(passwordResetEmail: string) {
    try {
      await this.fireauth.sendPasswordResetEmail(passwordResetEmail);
      window.alert('Password reset email has been sent, please check your inbox.');
    } catch (error) {
      window.alert(error);
    }
  }

  // Returns true when user is authenticated
  get isAuthenticated(): boolean {
    const authState = JSON.parse(localStorage.getItem('authState'));
    return authState != null;
  }

  get localAuthState(): any{
    const authState = JSON.parse(localStorage.getItem('authState'));
    return authState;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('authState'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  signInWithGoogle() {
    return this.authLogin(new firebase.default.auth.GoogleAuthProvider());
  }

  // Auth providers
  authLogin(provider) {
    return this.fireauth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.setUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Store user in localStorage
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign-out 
  signOut() {
    return this.fireauth.signOut();
  }

}
