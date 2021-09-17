import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from '@app/state';
import { AuthActions } from '@app/state/auth/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileForm : FormGroup;
  
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
  ) { 
    this.store.select(state => state.auth).subscribe(
      auth => {
        this.profileForm = this.formBuilder.group({
          name: [auth.displayName, Validators.required]
        });
      } 
    );
    
  }

  ngOnInit() {
  }

  get name() { return this.profileForm.get('name'); }
  set name(value: any) { this.profileForm.get('name').setValue(value); }
  

  save(){
    this.store.dispatch(AuthActions.updateProfile({
      displayName: this.name.value,
      photoUrl: ''
    }))
  }

}
