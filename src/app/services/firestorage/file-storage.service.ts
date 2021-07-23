import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, pipe, zip } from 'rxjs';
import { finalize, map, mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  uploadedFileURL: Observable<string>;
  url : string;

  //Uploaded Image List
  //images: Observable<MyData[]>;

  isUploading:boolean;
  isUploaded:boolean;

  fileName:string;
  fileSize:number;

  constructor(private storage: AngularFireStorage) { 
    this.isUploading = false;
    this.isUploaded = false;
  }

  uploadFile(file: File){
    //const file = files[0];
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    const path = `photos/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    return this.storage.upload(path, file, { customMetadata }).then(
      snapshot => snapshot.ref.getDownloadURL()
    );

  }

  deleteFile(url: string){
    return this.storage.refFromURL(url).delete();
  }
}

