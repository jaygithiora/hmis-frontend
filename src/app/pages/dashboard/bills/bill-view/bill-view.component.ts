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
      patient: ['0'],
      patient_code: [],
      location: ['', [Validators.required]],
      main_type: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      account: ['', [Validators.required]],
      plan: ['', [Validators.required]],
      department: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      consultation_type:['', [Validators.required]],
      consultation_fees: ['0', [Validators.required]],
      //validity: [''],
      //bill_type: [''],
      //copay: [''],
      //limit: [''],
      dob: ['', [Validators.required]],
      salutation: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      other_names: ['', [Validators.required]],
      id_number: [''],
      member_number: [''],
      member_type: ['', [Validators.required]],
      status: ['active', Validators.required]
    });
  }
  

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.billsService.getBill(parseInt(id)).subscribe((result: any) => {
        this.bill = result.bill;
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

  updatePatient() {
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
          //this.router.navigate(["/dashboard/visits/op/list"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.id);
        }
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.location);
        }
        if (error?.error?.errors?.patient) {
          this.toastr.error(error?.error?.patient);
        }
        if (error?.error?.errors?.main_type) {
          this.toastr.error(error?.error?.main_type);
        }
        if (error?.error?.errors?.sub_type) {
          this.toastr.error(error?.error?.sub_type);
        }
        if (error?.error?.errors?.account) {
          this.toastr.error(error?.error?.account);
        }
        if (error?.error?.errors?.plan) {
          this.toastr.error(error?.error?.plan);
        }
        if (error?.error?.errors?.department) {
          this.toastr.error(error?.error?.department);
        }
        if (error?.error?.errors?.doctor) {
          this.toastr.error(error?.error?.doctor);
        }
        if (error?.error?.errors?.consultation_type) {
          this.toastr.error(error?.error?.consultation_type);
        }
        if (error?.error?.errors?.consultation_fees) {
          this.toastr.error(error?.error?.consultation_fees);
        }
        if (error?.error?.errors?.other_names) {
          this.toastr.error(error?.error?.other_names);
        }
        if (error?.error?.errors?.id_number) {
          this.toastr.error(error?.error?.id_number);
        }
        if (error?.error?.errors?.member_number) {
          this.toastr.error(error?.error?.member_number);
        }
        if (error?.error?.errors?.member_type) {
          this.toastr.error(error?.error?.member_type);
        }
        if (error?.error?.errors?.blood_group) {
          this.toastr.error(error?.error?.blood_group);
        }
        if (error?.error?.errors?.guardian_name) {
          this.toastr.error(error?.error?.guardian_name);
        }
        if (error?.error?.errors?.patient_location) {
          this.toastr.error(error?.error?.patient_location);
        }
        if (error?.error?.errors?.citizenship) {
          this.toastr.error(error?.error?.citizenship);
        }
        if (error?.error?.errors?.next_of_kin_name) {
          this.toastr.error(error?.error?.next_of_kin_name);
        }
        if (error?.error?.errors?.next_of_kin_phone) {
          this.toastr.error(error?.error?.next_of_kin_phone);
        }
        if (error?.error?.errors?.phone) {
          this.toastr.error(error?.error?.phone);
        }
        if (error?.error?.errors?.next_of_kin_relation) {
          this.toastr.error(error?.error?.next_of_kin_relation);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.status);
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


