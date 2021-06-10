import { createAction, props } from '@ngrx/store';

export const AuthActions = {
  
  getAuthState: createAction(
    '[Auth] Get logged in user'
  ),

  userIsLoggedIn: createAction(
    '[Auth] User is logged in',
    props<{
      uid: string, 
      displayName: string, 
      email: string,
      emailVerified: boolean, 
      shopIds: string[], 
      isAuthenticated: boolean
     }>()
  ),
  
  userIsLoggedOut: createAction(
    '[Auth] User is logged out'
  ),
  
  login: createAction(
    '[Auth] Login',
    props<{email: string; password: string}>()
  ),
  
  loginSuccess: createAction(
    '[Auth] Login success',
    props<{ 
      uid: string, 
      displayName: string,
      email: string, 
      emailVerified: boolean, 
      shopIds: string[], 
      isAuthenticated: boolean  }>()
  ),
  
  loginFailed: createAction(
    '[Auth] Login failed',
    props<{err: any}>()
  ),
  
  logout: createAction(
    '[Auth] Logout'
  ),
  
  logoutSuccess: createAction(
    '[Auth] Logout success'
  ),

  addShopId: createAction(
    '[Auth] Add a shop id to user profile',
    props<{ userId: string, shopId: string }>()
  ),

  addShopIdSuccess: createAction(
    '[Auth] Add shop id to user profile success',
    props<{ userId: string, shopId: string }>()
  ),

  addShopIdFail: createAction(
    '[Auth] Add shop id to user profile failed',
    props<{ error:any }>()
  ),
  
  changePassword: createAction(
    '[Auth] Change password',
    props<{email: string, oldPassword: string, newPassword: string}>()
  ),
  
  changePasswordSuccess: createAction(
    '[Auth] Change password success',
    props<{ expiresIn: string, expiresOn: Date }>()
  ),
  
  changePasswordFail: createAction(
    '[Auth] Change password failed',
    props<{ error: any }>()
  ),
  
  sendPasswordReset: createAction(
    '[Auth] Send password reset'
  ),

  
  
  
}