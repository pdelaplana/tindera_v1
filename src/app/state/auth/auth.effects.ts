import { Injectable, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, flatMap } from 'rxjs/operators';

import { AuthenticationService } from '@app/services/authentication.service';

import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { ThrowStmt } from '@angular/compiler';
import { UserProfileService } from '@app/services/firestore/user-profile.service';
import { UserProfile } from '@app/models/user-profile';
import { ShopActions } from '../shop/shop.actions';


@Injectable()
export class AuthEffects {
  constructor(
    private store: Store<AppState>,
    private actions: Actions,
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService 
  ) {}

  getAuthState = createEffect(() => this.actions.pipe(
    ofType(AuthActions.getAuthState),
    switchMap(async (action) => {
      if (this.authenticationService.localAuthState) {
        const localAuthState = this.authenticationService.localAuthState;
        this.store.dispatch(ShopActions.loadShopState({ id: localAuthState.shopIds[0] }));
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

  login = createEffect(() => this.actions.pipe(
    ofType(AuthActions.login),
    switchMap(async (action) => {
      const credential = await this.authenticationService.signin(action.email, action.password);
      const userProfile = await this.userProfileService.get(credential.user.uid);
      return AuthActions.loginSuccess({
        uid: credential.user.uid,
        displayName: credential.user.displayName,
        email: credential.user.email,
        emailVerified: credential.user.emailVerified,
        shopIds: userProfile.shopIds,
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
}
