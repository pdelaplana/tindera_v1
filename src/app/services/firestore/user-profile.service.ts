import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from '@app/models/user-profile';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  async get(userId:string): Promise<UserProfile>{
    return (await this.firestore.collection('userProfiles').doc(userId).get().toPromise()).data() as UserProfile;
  }

  add(userId:string, userProfile: UserProfile){
    return this.firestore.collection('userProfiles').doc(userId).set(userProfile);
  }

  update(userId: string, userProfile: UserProfile){
    return this.firestore.collection('userProfiles').doc(userId).set(userProfile)
  }

}
