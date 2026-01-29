import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryEquipmentService } from '@services/dashboard/laboratory/laboratory-equipment/laboratory-equipment.service';
import { LaboratoryWorkListService } from '@services/dashboard/laboratory/laboratory-work-list/laboratory-work-list.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-laboratory-result-entry',
  templateUrl: './laboratory-result-entry.component.html',
  styleUrl: './laboratory-result-entry.component.scss'
})
export class LaboratoryResultEntryComponent implements OnInit {
  public isLoading: boolean = false;
  loading:boolean = false;

  bill: any;
  billForm!: FormGroup;


  equipment: any[] = [];
    search$ = new Subject<string>();

  imageUrl = 'assets/img/default-profile.png';
  statuses = [{ id: "accepted", name: "Accept" }, { id: "rejected", name: "Reject" },];

  constructor(private laboratoryWorkListService: LaboratoryWorkListService, private laboratoryEquipmentService:LaboratoryEquipmentService,
    private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.billForm = this.fb.group({
      id: ['0', [Validators.required]],
      consultation_items: this.fb.array([]),
    });
    this.setupSearch();
  }


    setupSearch() {
      this.search$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loading = true),  // Show the loading spinner
          switchMap(term => this.laboratoryEquipmentService.getLaboratoryEquipment(1, term))  // Switch to a new observable for each search term
        )
        .subscribe(results => {
          this.equipment = results.equipment.data;
          this.loading = false;  // Hide the loading spinner when the API call finishes
        });
    }

  get consultationItemsForm(): FormArray {
    return this.billForm.get('consultation_items') as FormArray;
  }

  labReferences(index: number): FormArray {
    return this.consultationItemsForm
      .at(index)
      .get('lab_references') as FormArray;
  }

  private createLabReference(lr: any, results:any): FormGroup {
    console.log("Results: ", results);
    return this.fb.group({
      id: [lr?.id || ''],
      name: [lr?.name || '', Validators.required],
      ref_unit: [lr?.ref_unit || ''],
      ref_range_label: [lr?.ref_range_label || ''],
      critical_high: [lr?.critical_high || ''],
      critical_low: [lr?.critical_low || ''],
      my_value: [results?.result_value, Validators.required]
    });
  }


  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.laboratoryWorkListService.getLaboratoryWorkListItem(parseInt(id)).subscribe((result: any) => {
        this.bill = result.work_list_item;
        this.billForm.get("id").setValue(this.bill.id);

        this.bill.consultation_item_bills.forEach(cib => {
          if(cib?.sample_collection?.laboratory_equipment){
            this.equipment.push(cib?.sample_collection?.laboratory_equipment);
          }
          const consultationItemsGroup = this.fb.group({
            id: [cib.id || '', [Validators.required]],
            name: [cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.name],
            remarks: [cib?.sample_collection?.remarks],
            status: [cib?.sample_collection?.result_status, Validators.required],
            sample_type: [cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.sample_type],
            code: [cib?.sample_collection?.code],
            equipment:[cib?.sample_collection?.laboratory_equipment_id],
            // ✅ ADD THIS
            lab_references: this.fb.array([])
          });
          if (cib?.sample_collection) {
            //consultationItemsGroup.get("remarks").disable();
            //consultationItemsGroup.get("status").disable();
          }
          // ✅ Populate lab_references if present
          if (cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.laboratory_item_references?.length) {
            const labRefsArray = consultationItemsGroup.get('lab_references') as FormArray;

            cib?.patient_laboratory_test?.laboratory_test_rate?.laboratory_test?.laboratory_item_references?.forEach(lr => {
              console.log(lr);
              labRefsArray.push(this.createLabReference(lr, cib?.laboratory_test_results.find(item=>item?.laboratory_test_reference_id==lr?.id)));
            });
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

  updateResults() {
    if (this.billForm.valid) {
      this.isLoading = true;
      this.laboratoryWorkListService.updateLaboratoryResults(this.billForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/laboratory/lab-work-list"]);
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