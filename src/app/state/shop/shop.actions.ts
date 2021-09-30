import { createAction, props } from '@ngrx/store';

export const shopActions = {
  
  getShopOfUser: createAction(
    '[Shop] Get shop of user',
    props<{ userid: string}>()
  ),

  getShopOfUserSuccess: createAction(
    '[Shop] Get shop of user success',
    props<{ id: string; name: string; description: string; location: string }>()
  ),

  createShop: createAction(
    '[Shop] Create shop',
    props<{ name: string; description: string, location: string}>()
  ),
  
  createShopSuccess: createAction(
    '[Shop] Create shop success',
    props<{ id:string; name: string; description: string, location: string }>()
  ),
  
  createShopFailed: createAction(
    '[Shop] Create shop failed',
    props<{err: any}>()
  ),
  
  loadShopState: createAction(
    '[Shop] Load shop state',
    props<{ id:string }>()
  ),
  
  loadShopStateSuccess: createAction(
    '[Shop] Load shop state success',
    props<{ id:string, name:string, description: string, location: string}>()
  ),
  
  loadShopStateFail: createAction(
    '[Shop] Load shop state fail',
    props<{ error: any}>()
  ),
  
}