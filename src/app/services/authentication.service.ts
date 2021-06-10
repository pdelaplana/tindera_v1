import { Injectable, NgZone } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import * as firebase from 'firebase/app';
import { UserProfileService } from './firestore/user-profile.service';
import { UserProfile } from '@app/models/user-profile';
import { AuthState } from '@app/state/auth/auth.state';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authState: any;

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    private userProfileService: UserProfileService,
    private router: Router,  
    private ngZone: NgZone 
  ) { 
    this.fireauth.authState.subscribe(async (user) => {
      if (user) {
        const userProfile = await this.userProfileService.get(user.uid);
        this.authState = <AuthState>{
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          shopIds: userProfile.shopIds,
          isAuthenticated: true
        };
        localStorage.setItem('authState', JSON.stringify(this.authState));
        JSON.parse(localStorage.getItem('authState'));
      } else {
        localStorage.setItem('authState', null);
        JSON.parse(localStorage.getItem('authState'));
      }
    })
  }

  signin(email, password){
    return this.fireauth.signInWithEmailAndPassword(email, password)
  }

  registerUser(email, password, displayName) {
    return this.fireauth.createUserWithEmailAndPassword(email, password)
            .then(credential => {
              credential.user.updateProfile({
                displayName: displayName
              });
              return credential;
            })
            .then(credential =>{
              this.userProfileService.add(credential.user.uid, <UserProfile>{
                shopIds: []
              })
              return credential;
            })
  }

  sendVerificationMail() {
    return this.fireauth.currentUser.then(user => user.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      })
  }

  changePassword(){
    //return this.fireauth.sendPasswordResetEmail()
  }

  // Recover password
  recoverPassword(passwordResetEmail) {
    return this.fireauth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
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
