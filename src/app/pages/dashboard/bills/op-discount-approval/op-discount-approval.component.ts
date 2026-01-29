import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { BillsService } from '@services/dashboard/bills/bills/bills.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-op-discount-approval',
  templateUrl: './op-discount-approval.component.html',
  styleUrl: './op-discount-approval.component.scss'
})
export class OpDiscountApprovalComponent implements OnInit {
  public isLoading: boolean = false;

  bill: any;
  billForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';
  discount_statuses = [{ id: "approved", name: "Approve" }, { id: "rejected", name: "Reject" }];
  discountTotals = 0;

  constructor(private billsService: BillsService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.billForm = this.fb.group({
      id: ['0', [Validators.required]],
      amount: ['', [Validators.required]],
      consultation_discount_id: [""],
      consultation_discount_units:[""],
      consultation_discount_status: [null],
      consultation_discount_amount: [""],
      consultation_discount: [""],
      consultation_discount_remarks: [""],
      consultation_discount_value: [""],
      consultation_items: this.fb.array([]),
      discount_totals: [0]
    });
  }

  get consultationItemsForm(): FormArray {
    return this.billForm.get('consultation_items') as FormArray;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.billsService.getDiscountBill(parseInt(id)).subscribe((result: any) => {
        console.log(result.bill);
        this.bill = result.bill;
        this.billForm.get("id").setValue(this.bill.id);
        if (this.bill.consultation_bill?.my_discount) {
          this.billForm.patchValue({
            consultation_discount_id: this.bill.consultation_bill?.my_discount?.id,
            consultation_amount: this.bill.consultation_bill.amount,
            consultation_discount_units: this.bill.consultation_bill?.my_discount?.discount_type == "amount" ? "KES" : "%",
            consultation_discount_status: this.bill.consultation_bill.my_discount?.status == 'pending' ? null : this.bill.consultation_bill?.my_discount?.status,
            consultation_discount_amount: this.bill.consultation_bill.discount,
            consultation_discount: this.bill.consultation_bill.discount,
            consultation_discount_value: this.bill.consultation_bill.my_discount?.amount,
            remarks: this.bill.consultation_bill?.my_discount?.comments
          });
        }

        this.bill.consultation_item_bills.forEach(cib => {
          const consultationItemsGroup = this.fb.group({
            id: [cib?.my_discount?.id || '', []],
            name: [cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.name || cib?.patient_radiology_test?.radiology_item_rate?.radiology_item?.name
              || cib?.patient_service?.service_rate?.service?.name || cib?.patient_prescription?.product_rate?.product?.name
            ],
            quantity: [cib?.patient_prescription?.quantity || 1],
            amount: [cib.amount, Validators.required],
            discount_units: [cib?.my_discount?.discount_type == "amount" ? "KES" : "%"],
            discount_status: [cib?.my_discount?.status == 'pending' ? null : cib?.my_discount?.status, [Validators.required]],
            discount_amount: [cib.discount],
            discount: [cib.discount],
            discount_value: [cib.my_discount?.amount],
            remarks: [cib?.my_discount?.comments]
          });
          if (cib.my_discount?.status != "pending") {
            consultationItemsGroup.get("discount_status").disable();
            consultationItemsGroup.get("remarks").disable();
          }

          consultationItemsGroup.get('discount_status')?.valueChanges.subscribe(() => {
            this.calculateDiscount(consultationItemsGroup);
          });
          this.consultationItemsForm.push(consultationItemsGroup);
        });
        if (this.bill.totals == this.bill.paid) {
          this.billForm.get("consultation_discount_type").disable();
          this.billForm.get("consultation_discount").disable();
        }
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
    this.consultationItemsForm.valueChanges.subscribe(values => {
      this.discountTotals = values.reduce(
        (sum: number, item: any) => sum + (Number(item.discount_amount) || 0),
        0
      );
      this.billForm.patchValue({ amount: this.bill.totals - this.discountTotals - this.bill.paid, discount_totals: this.discountTotals })
    });
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
      this.billsService.updateDiscountBill(this.billForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/bills/op-discount-approvals"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.id);
        }
        if (error?.error?.errors?.consultation_items) {
          this.toastr.error(error?.error?.consultation_items);
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
      this.billForm.markAllAsTouched();
    }
  }

  calculateDiscount(group: FormGroup) {
    const discountStatus = group.get("discount_status")?.value;
    let discountAmount = group.get("discount")?.value;
    if (discountStatus == "approved") {
      group.patchValue({ discount_amount: discountAmount });
      return;
    } else {
      group.patchValue({ discount_amount: 0 });
      return;
    }
  }
}