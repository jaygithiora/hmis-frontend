import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LaboratorySampleCollectionsService } from '@services/dashboard/laboratory/laboratory-sample-collections/laboratory-sample-collections.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-sample-collection',
  templateUrl: './laboratory-sample-collection.component.html',
  styleUrl: './laboratory-sample-collection.component.scss'
})
export class LaboratorySampleCollectionComponent implements OnInit {
  public isLoading: boolean = false;

  bill: any;
  billForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';
  statuses = [{ id: "refund", name: "Refund" }, { id: "collected", name: "Collect" }];

  constructor(private laboratorySampleCollectionsService: LaboratorySampleCollectionsService, 
    private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.billForm = this.fb.group({
      id: ['0', [Validators.required]],
      consultation_items: this.fb.array([]),
    });
  }

  get consultationItemsForm(): FormArray {
    return this.billForm.get('consultation_items') as FormArray;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.laboratorySampleCollectionsService.getLaboratorySampleCollection(parseInt(id)).subscribe((result: any) => {
        console.log(result.sample_collection);
        this.bill = result.sample_collection;
        this.billForm.get("id").setValue(this.bill.id);

        this.bill.consultation_item_bills.forEach(cib => {
          const consultationItemsGroup = this.fb.group({
            id: [cib.id || '', [Validators.required]],
            name: [cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.name],
            remarks: [cib?.sample_collection?.remarks],
            status: [cib?.sample_collection?.status, Validators.required],
            sample_type:[cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.laboratory_sample_type?.name]
          });
          if(cib?.sample_collection){
            consultationItemsGroup.get("remarks").disable();
            consultationItemsGroup.get("status").disable();
          }
          this.consultationItemsForm.push(consultationItemsGroup);
        });
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Invalid Bill ID");
      this.router.navigate(["/dashboard"]);
    }
  }

  updateSampleCollection() {
    if (this.billForm.valid) {
      /*let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }*/
      this.isLoading = true;
      this.laboratorySampleCollectionsService.updateSampleCollection(this.billForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/laboratory/sample-collections"]);
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
      this.billForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
}