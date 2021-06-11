import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Entity } from '@app/models/entity';
import { AppState } from '@app/state';
import { Store } from '@ngrx/store';
import { Refresh } from '@ngrx/store-devtools/src/actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryParameter } from './query-parameters';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService<T extends Entity> {

  private uid: string;
  //private collection: AngularFirestoreCollection<T>;

  collectionName: string

  constructor(
    public store: Store<AppState>,
    public firestore: AngularFirestore
  ) { 
    this.store.select(state => state.auth.uid).subscribe((uid) => this.uid = uid);
  }

  get collection() { return this.firestore.collection<T>(this.collectionName); }

  async get(id: string){
    const snapshot = this.firestore.collection(this.collectionName).doc(id);
    const data = await (await snapshot.get().toPromise()).data() as T
    return <T>{
      id: snapshot.ref.id,
      ...data
    }
  }

  
  query(queryParams: QueryParameter[]): Observable<T[]> {
    
    let query: AngularFirestoreCollection<T>;
    if (queryParams.length > 0) {
      query = this.firestore.collection<T>(this.collectionName, ref => {
        queryParams.forEach((param) => {
          ref.where(param.name, param.operator, param.value);
        })
        return ref;
      });
    } else {
      query = this.firestore.collection<T>(this.collectionName);
    }
    
    //const query =this.firestore.collection<T>(this.collectionName);
    const snapshotChanges = (query.snapshotChanges());
    return snapshotChanges.pipe(
      map(arr => {
        return arr.map( doc => {
          const data = doc.payload.doc.data();
          return { id: doc.payload.doc.id, ...data} as T
        })
      }
    ))
    
  } 


  async add(entity:T):Promise<T> {
    const audit =  {
      createdByUid : this.uid,
      createdDate : new Date(),
      lastUpdatedByUid : this.uid,
      lastUpdatedDate : new Date()
    } 
    const { id, ...rest } = entity;
    const data = { ...rest, audit }

    const reference = await this.firestore.collection(this.collectionName).add(data);
    
    return <T>{
      id : reference.id,
      ...(await reference.get()).data() as T
    }
  }

  async update(entity:T):Promise<T>{
    entity.lastUpdatedByUid = this.uid;
    entity.lastUpdatedDate = new Date();

    const { id, ...rest } = entity;

    await this.firestore.collection(this.collectionName).doc(id).set(rest);
    return this.get(id)

  }

}
