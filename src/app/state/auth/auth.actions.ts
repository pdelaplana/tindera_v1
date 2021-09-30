import { createAction, props } from '@ngrx/store';

export const AuthActions = {
  
  getAuthState: createAction(
    '[Auth] Get logged in user'
  ),

  registerUser: createAction(
    '[Auth] Register user',
    props<{
      displayName: string,
      email: string,
      password: string
     }>()
  ),

  registerUserSuccess: createAction(
    '[Auth] Register user succes',
    props<{
      uid: string,
      displayName: string,
      email: string,
     }>()
  ),

  registerUserFail: createAction(
    '[Auth] Register user fail',
    props<{
      error: any
     }>()
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
    props<{oldPassword: string, newPassword: string}>()
  ),
  
  changePasswordSuccess: createAction(
    '[Auth] Change password success'
  ),
  
  changePasswordFail: createAction(
    '[Auth] Change password failed',
    props<{ error: any }>()
  ),
  
  sendPasswordReset: createAction(
    '[Auth] Send password reset'
  ),

  updateProfile: createAction(
    '[Auth] Update profile',
    props<{ displayName: string, photoUrl: string}>()
  ),
  
  updateProfileSuccess: createAction(
    '[Auth] Update profile success',
    props<{ displayName: string, photoUrl: string}>()
  ),

  updateProfileFail: createAction(
    '[Auth] Update profile fail',
    props<{ error: any }>()
  ),

  clearAuthActions: createAction(
    '[Auth] Clear auth actions'
  )
  
  
  
}