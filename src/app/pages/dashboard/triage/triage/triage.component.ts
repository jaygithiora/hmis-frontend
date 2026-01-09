import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { TriageService } from '@services/dashboard/triage/triage/triage.service';
import { Parser } from 'expr-eval';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-triage',
  templateUrl: './triage.component.html',
  styleUrl: './triage.component.scss'
})
export class TriageComponent implements OnInit {
  disabled = false;
  public isLoading: boolean = true;
  loading: boolean = false;

  triage: any;
  triage_items: any[] = [];

  triageForm!: FormGroup;

  active = 1;
  activeIds: string = "custom-panel-triage,";
  age: any;

  constructor(private triageService: TriageService, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, private activatedRoute: ActivatedRoute, private cdr:ChangeDetectorRef) {
    this.triageForm = this.fb.group({
      id: ['0', [Validators.required]],
      triage_id: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.triageForm.get("triage_id").setValue(id);
      this.isLoading = true;
      this.triageService.getTriage(parseInt(id)).subscribe((result: any) => {
        this.triage = result.outpatient_visit_triage;
        this.age = this.getAgeDetails(this.triage?.outpatient_visit?.patient?.dob);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
      this.triageService.getAllTriageItems().subscribe((result: any) => {
        this.triage_items = result.triage_items;
        this.buildForm(this.triage_items);
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
      this.router.navigate(["dashboard/triage/list"]);
    }
  }

  buildForm(triage_categories: any[]) {
    const group: any = { "id": ["0", [Validators.required]], "triage_id": [this.triage?.id, [Validators.required]] };

    triage_categories.forEach(triage_category => {
      this.activeIds = this.activeIds + ",custom-panel-" + triage_category.id;
      triage_category.triage_items.forEach(triage_item => {
        const validators = triage_item.is_required ? [Validators.required] : [];

        if (triage_item.type === 'checkbox') {
          group[triage_item.name] = [false, validators];
        } else {
          group[triage_item.name] = [null, validators];
        }
      });
    });
    this.triageForm = this.fb.group(group);
    this.setupDynamicDependencies(triage_categories);
  }

  setupDynamicDependencies(triage_categories: any[]) {
    const parser = new Parser();
    triage_categories.forEach(triage_category => {
      triage_category.triage_items.forEach(triage_item => {
        const dependencies: string[] = [];
        let formula = '';

        // Build formula and track dependent fields
        triage_item.triage_item_operations?.forEach(op => {
        console.log("Triage Item Operation:",op);
          if(op.triage_item_formula){
          const fieldName = op.triage_item_formula.name;


          // Replace field name with variable in formula
          formula += fieldName;

          if (!dependencies.includes(fieldName)) {
            dependencies.push(fieldName);
          }
        }else{
          // Add operation
          if (op.operation) {
            formula += ` ${op.operation.name} `;
          }
        }
        });

        const updateFormula = () => {
          const values: Record<string, number> = {};

          dependencies.forEach(dep => {
            const val = parseFloat(this.triageForm.get(dep)?.value) || 0;
            values[dep] = val;
          });

          try {
            const expr = parser.parse(formula);
            const result = expr.evaluate(values);

            this.triageForm.get(triage_item.name)?.setValue(result.toFixed(2), { emitEvent: false });
          } catch (err) {
            //console.warn(`Failed to compute formula for ${triage_item.name}`, err);
          }
        };

        // Subscribe to changes in dependent fields
        dependencies.forEach(dep => {
          this.triageForm.get(dep)?.valueChanges.subscribe(updateFormula);
        });

        // Optionally evaluate once on load
        updateFormula();
      });
    });
    /*triage_categories.forEach(triage_category => {
      triage_category.triage_items.forEach(triage_item => {
        const fields: string[] = [];
        const updateFormula = () => {
          const context: any = {};
          let formula = "";
          triage_item.triage_item_operations?.forEach(triage_item_operation => {
            console.log(triage_item_operation);
            const item = triage_item_operation.triage_item_formula.name;
            if (triage_item_operation.triage_item_formula.triage_category != null) {
              context[item] = parseFloat(this.triageForm.get(item)?.value) || 1;
              formula += `${context[item]}`;
              if (!fields.includes(item)) {
                fields.push(item);
              }
            } else {
              context[item] = item;
              formula += `${context[item]}`;
            }
          });
          try {
            // WARNING: Using `eval()` safely only if trusted formula input
            const value = eval(formula);
            this.triageForm.get(triage_item.name)?.setValue(value?.toFixed(2), { emitEvent: false });
          } catch (err) {
            console.warn(`Formula evaluation failed for ${triage_item.name}`, err);
          }
          console.log(formula);
        };
        //subscribe to changes of dependencies
        fields.forEach(dep => {
          console.log("Kaende!!");
          this.triageForm.get(dep)?.valueChanges.subscribe(updateFormula);
        });
        updateFormula();
      });
    });*/
  }

  getAgeDetails(dob: string) {
    const birthDate = moment(dob);
    const today = moment();

    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');

    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');

    const days = today.diff(birthDate, 'days');

    return { years, months, days };
  }

  addTriage() {
    if (this.triageForm.valid) {
      this.isLoading = true;
      this.triageService.updateTriage(this.triageForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["dashboard/triage/list"])
        }
      }, error => {
        /*if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.triage_id) {
          this.toastr.error(error?.error?.errors?.triage_id);
        }*/
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        if (error.error.errors) {
          this.handleValidationErrors(error.error.errors);
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  handleValidationErrors(errors: { [key: string]: string[] }) {
    Object.keys(errors).forEach(field => {
      const control = this.triageForm.get(field);
      if (control) {
        control.setErrors({ serverError: errors[field][0] }); // Show only first error
      }
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}


