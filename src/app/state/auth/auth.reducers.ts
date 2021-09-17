
import { Action, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.state';

export const initialState: AuthState = {
  uid: '',  
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: false,
  isAuthenticated: false,
  shopIds: []
};


const authReducer = createReducer(
  initialState,
  on(AuthActions.userIsLoggedIn, (state, {uid, email, displayName, emailVerified, shopIds}) => ({
    ...state,
    uid,
    email,
    displayName,
    emailVerified,
    shopIds,
    isAuthenticated: true
  })),
  on(AuthActions.loginSuccess, (state, {uid, email, displayName, emailVerified, shopIds}) => ({
    ...state,
    uid,
    email,
    displayName,
    emailVerified,
    shopIds,
    isAuthenticated: true
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    uid:'',
    email:'',
    displayName:'',
    emailVerified: false,
    shopIds:[],
    isAuthenticated: false
  })),
  on(AuthActions.addShopIdSuccess, (state, { userId, shopId }) => ({
    ...state,
    shopIds: [...state.shopIds.filter(s=>s != shopId), shopId],
  })),
  on(AuthActions.updateProfileSuccess, (state, { displayName, photoUrl }) => ({
    ...state,
    displayName,
    photoUrl
  }))


);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

