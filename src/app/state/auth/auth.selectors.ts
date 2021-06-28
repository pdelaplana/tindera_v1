import { User } from '@app/models/user';
import { createSelector } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '..';
import { AuthState } from './auth.state';

//export const getEmail = (state: AuthState) => state.email;
//export const getDisplayName = (state: AuthState) => state.displayName;
//export const getEmailVerified = (state: AuthState) => state.emailVerified;

export const selectAuthState = (state: AppState) => state.auth;

export const selectAuthUser = () => 
  createSelector(
    selectAuthState, 
    (auth) => {
      return <User>{
        uid : auth.uid,
        email: auth.email,
        displayName: auth.displayName,
        photoURL: auth.photoURL,
        emailVerified: auth.emailVerified
      }
    }  
  );
