import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { BillsService } from '@services/dashboard/bills/bills/bills.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrl: './bill-view.component.scss'
})
export class BillViewComponent implements OnInit {
  public isLoading: boolean = false;

  bill: any;
  billForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';

  constructor(private billsService:BillsService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private router: Router, private activatedRoute:ActivatedRoute) {
    this.billForm = this.fb.group({
      id: ['0', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }
  

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.billsService.getBill(parseInt(id)).subscribe((result: any) => {
        console.log(result.bill);
        this.bill = result.bill;
        this.billForm.get("id").setValue(this.bill.id);
        this.billForm.get("amount").setValue(this.bill.totals - this.bill.paid);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    }else{
      this.toastr.error("Invalid Bill ID");
      this.router.navigate(["/dashboard"]);
    }
  }

  updateBill() {
    if (this.billForm.valid) {
      /*let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }*/
      this.isLoading = true;
      this.billsService.updateBill(this.billForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/bills/list"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.id);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.amount);
        }
        
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  // Convert the base64 image to Blob
  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  // Create FormData object to append form values and image
  createFormData(blob: Blob): FormData {
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');

    // Append other form data fields here
    Object.keys(this.billForm.value).forEach(key => {
      formData.append(key, this.billForm.get(key)?.value);
    });

    return formData;
  }
}


