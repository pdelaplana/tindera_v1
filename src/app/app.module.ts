import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './state';

import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthEffects } from './state/auth/auth.effects';
import { ShopEffects } from './state/shop/shop.effects';

import { NGXLogger } from 'ngx-logger';
import { loggerFactory } from './state';
import { CurrencyPipe } from '@angular/common';
import { InventoryEffects } from './state/inventory/inventory.effects';
import { CategoryLabelPipe } from './pipes/category-label.pipe';
import { UomLabelPipe } from './pipes/uom-label.pipe';
import { TransactionTypePipe } from './pipes/transaction-type.pipe';
import { ProductEffects } from './state/product/product.effects';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CategoryLabelPipe,
    UomLabelPipe,
    TransactionTypePipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      AuthEffects,
      ShopEffects,
      InventoryEffects,
      ProductEffects
    ]),
    TagInputModule
  ],
  providers: [
    CurrencyPipe,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    /*
    {
      provide: META_REDUCERS,
      deps: [NGXLogger],
      useFactory: loggerFactory,
      multi: true
    },
    */
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
