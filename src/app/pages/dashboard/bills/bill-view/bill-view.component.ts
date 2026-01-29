import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  discount_types = [{ id: "amount", name: "Amount" }, { id: "percentage", name: "Percentage" }];
  discountTotals = 0;

  constructor(private billsService: BillsService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.billForm = this.fb.group({
      id: ['0', [Validators.required]],
      amount: ['', [Validators.required]],
      consultation_discount_type: [null],
      consultation_discount: [""],
      consultation_items: this.fb.array([]),
      discount_totals:[0]
    });
  }

  get consultationItemsForm(): FormArray {
    return this.billForm.get('consultation_items') as FormArray;
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

        this.bill.consultation_item_bills.forEach(cib => {
          const consultationItemsGroup = this.fb.group({
            id: [cib.id || '', []],
            name: [cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.name || cib?.patient_radiology_test?.radiology_item_rate?.radiology_item?.name
              || cib?.patient_service?.service_rate?.service?.name || cib?.patient_prescription?.product_rate?.product?.name
            ],
            quantity: [cib?.patient_prescription?.quantity || 1],
            amount: [cib.amount, Validators.required],
            discount_type: [cib?.my_discount?.discount_type],
            discount: [cib.my_discount?.amount],
            discount_amount: [cib.discount],
            discount_status:[cib?.my_discount?.status||""]
          });

          consultationItemsGroup.get('discount_type')?.valueChanges.subscribe(() => {
            this.calculateDiscount(consultationItemsGroup);
          });
          consultationItemsGroup.get('discount')?.valueChanges.subscribe(() => {
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
    this.billForm.patchValue({amount:this.bill.totals-this.discountTotals - this.bill.paid, discount_totals:this.discountTotals})
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
      this.billsService.updateBill(this.billForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.openPdfInNewTab(this.bill.id);
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

  calculateDiscount(group: FormGroup) {
    const discountType = group.get("discount_type")?.value;
    let discount = group.get("discount")?.value;
    if (discount <= 0) {
      discount = 0;
    }
    if (discountType) {
      let discountAmount = 0;
      if (discountType == "amount") {
        if (discount <= group.get("amount").value) {
          discountAmount = discount;
        } else {
          this.toastr.error("Invalid Discount! Value should be between 0 and not greator than item amount");
          group.patchValue({ discount: 0 });
          return;
        }
      } else {
        const discountVal = group.get("discount").value;
        if (discountVal <= 100) {
          discountAmount = group.get("amount").value * discount / 100;
        } else {
          this.toastr.error("Invalid Discount! Value should be between 0 and 100 for percentages");
          group.patchValue({ discount: 0 });
          return;
        }
      }
      group.patchValue({ discount_amount: discountAmount });
      console.log("Amount:", discountAmount);
    }
  }

  // Download PDF
  downloadPdf(billId: number) {
    this.billsService.downloadPdf(billId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bill-${billId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.toastr.success('PDF downloaded successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to download PDF', 'Error');
        console.error('Error downloading PDF:', error);
      }
    });
  }


  // Print PDF
  printPdf(billId: number) {
    this.billsService.streamPdf(billId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
        
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
          window.URL.revokeObjectURL(url);
        }, 1000);
      },
      error: (error) => {
        this.toastr.error('Failed to print PDF', 'Error');
        console.error('Error printing PDF:', error);
      }
    });
  }

  // Open PDF in new tab
  openPdfInNewTab(billId: number) {
    this.billsService.streamPdf(billId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // Clean up after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (error) => {
        this.toastr.error('Failed to open PDF', 'Error');
        console.error('Error opening PDF:', error);
      }
    });
  }
}


