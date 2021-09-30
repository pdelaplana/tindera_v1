import { Injectable, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, flatMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/services/authentication.service';

import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { UserProfileService } from '@app/services/firestore/user-profile.service';
import { UserProfile } from '@app/models/user-profile';
import { shopActions } from '../shop/shop.actions';
import { ShopService } from '@app/services/firestore/shop.service';
import { Shop } from '@app/models/shop';


@Injectable()
export class AuthEffects {
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService,
    private shopService: ShopService 
  ) {}

  getAuthState = createEffect(() => this.actions.pipe(
    ofType(AuthActions.getAuthState),
    switchMap(async (action) => {
      if (this.authenticationService.localAuthState) {
        const localAuthState = this.authenticationService.localAuthState;
        return AuthActions.userIsLoggedIn({
          displayName: localAuthState.displayName,
          email: localAuthState.email,
          emailVerified: localAuthState.emailVerified,
          uid: localAuthState.uid,
          shopIds: localAuthState.shopIds,
          isAuthenticated:true
        })
      } else {
        return AuthActions.userIsLoggedOut();
      }
    })
  ));

  registerUser = createEffect(() => this.actions.pipe(
    ofType(AuthActions.registerUser),
    switchMap(async (action) => {
      return await this.authenticationService.registerUser(action.email, action.password, action.displayName);
    }),
    map(result=>{
      return AuthActions.registerUserSuccess({
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(AuthActions.registerUserFail({error}));
      return caught;
    })
  ));

  login = createEffect(() => this.actions.pipe(
    ofType(AuthActions.login),
    switchMap(async (action) => {
      return await this.authenticationService.signin(action.email, action.password);
    }),
    switchMap(credential=>{
      return this.shopService.getShopsForUser(credential.user.uid).pipe( 
        map(shops => ({shops, credential}))
      ).pipe();
    }),
    map(result=>{
      const shopIds = result.shops.map(shop => shop.id);
      return AuthActions.loginSuccess({
        uid: result.credential.user.uid,
        displayName: result.credential.user.displayName,
        email: result.credential.user.email,
        emailVerified: result.credential.user.emailVerified,
        shopIds: shopIds,
        isAuthenticated: true,
      })
    }),
    catchError((error, caught) => {
      this.store.dispatch(AuthActions.loginFailed({err: error}));
      return caught;
    })
  ));

  
  logout = createEffect(() => this.actions.pipe(
    ofType(AuthActions.logout),
    map(() => {
      this.authenticationService.signOut();
      return AuthActions.logoutSuccess();
    })
  ));

  addShopId = createEffect(() => this.actions.pipe(
    ofType(AuthActions.addShopId),
    switchMap(async (action) =>{
      const userProfile = await this.userProfileService.get(action.userId);
      userProfile.shopIds.push(action.shopId);
      await this.userProfileService.update(action.userId, userProfile);
      return AuthActions.addShopIdSuccess({ userId: action.userId, shopId: action.shopId });
    }),
    catchError((error, caught) => {
      this.store.dispatch(AuthActions.addShopIdFail({error}));
      return caught;
    })
  ))

  updateProfile = createEffect(() => this.actions.pipe(
    ofType(AuthActions.updateProfile),
    switchMap(async (action) =>{
      await this.authenticationService.updateProfile(action.displayName)
      return AuthActions.updateProfileSuccess({ displayName: action.displayName, photoUrl: '' });
    }),
    catchError((error, caught) => {
      this.store.dispatch(AuthActions.updateProfileFail({error}));
      return caught;
    })
  ))

  changePassword = createEffect(() => this.actions.pipe(
    ofType(AuthActions.changePassword),
    switchMap(async (action) =>{
      await this.authenticationService.changePassword(action.oldPassword, action.newPassword)
      return AuthActions.changePasswordSuccess();
    }),
    catchError((error, caught) => {
      this.store.dispatch(AuthActions.changePasswordFail({error}));
      return caught;
    })
  ))
}
