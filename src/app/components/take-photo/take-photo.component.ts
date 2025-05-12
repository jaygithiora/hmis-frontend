import { Component, EventEmitter, Input, input, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-take-photo',
  templateUrl: './take-photo.component.html',
  styleUrl: './take-photo.component.scss'
})
export class TakePhotoComponent {
  modalRef: NgbModalRef;
  width = 500;

  trigger: Subject<void> = new Subject<void>();
  triggerObservable = this.trigger.asObservable();

  webcamImage!: WebcamImage;
  @Output() imageCaptured = new EventEmitter<WebcamImage>();

  constructor(private modalService: NgbModal) {
  }

  openModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { centered: true }); setTimeout(() => {
    const modalElement = document.querySelector('.modal-dialog') as HTMLElement;
    if (modalElement) {
      this.width = modalElement.offsetWidth;
      //alert('Modal width:'+width + 'px');
    }
  }, 0);
  }


  //web cam functions
  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.imageCaptured.emit(webcamImage);
    this.modalRef?.close();
    //this.uploadImage(webcamImage.imageAsDataUrl);
  }
/*
  uploadImage(dataUrl: string): void {
    const blob = this.dataURLtoBlob(dataUrl);
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');

    fetch('http://localhost:8000/api/upload-photo', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => console.log('Upload success:', data))
      .catch(err => console.error('Upload error:', err));
  }

  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }*/
}
