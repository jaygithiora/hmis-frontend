import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';
import { TriageItemsService } from '@services/dashboard/triage/triage-items/triage-items.service';
import { TriageService } from '@services/dashboard/triage/triage/triage.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-triage',
  templateUrl: './triage.component.html',
  styleUrl: './triage.component.scss'
})
export class TriageComponent implements OnInit {
  disabled = false;
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  triage: any;
  triage_items:any[] = [];

  triageForm!: FormGroup;

  triageItems: any[] = [];
  selectedItems: number[] = [];
  searchInput$ = new Subject<string>();

  color: string = '#000000';
  active = 1;
  activeIds:string = "custom-panel-triage,";
  age;

  constructor(private triageService: TriageService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    /*this.triageForm = this.fb.group({
      id: ['0', [Validators.required]],
      triage_id: ['', [Validators.required]],
      triage_item: ['', [Validators.required]],
      color: [this.color, [Validators.required]],
      min_value: [''],
      max_value: [''],
      status: ['1', [Validators.required]]
    });*/
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      //this.triageForm.get("triage_id").setValue(id);
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
  const group: any = {"id":["0", [Validators.required]], "triage_id":["", [Validators.required]]};

  triage_categories.forEach(triage_category => {
    this.activeIds = this.activeIds+",custom-panel-"+triage_category.id;
    triage_category.triage_items.forEach(triage_item =>{
    const validators = triage_item.is_required ? [Validators.required] : [];

    if (triage_item.type === 'checkbox') {
      group[triage_item.name] = [false, validators];
    } else {
      group[triage_item.name] = [null, validators];
    }});
  });
  this.triageForm = this.fb.group(group);
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

  openModal(content: TemplateRef<any>, triage_item_interpretation: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (triage_item_interpretation != null) {
      this.triageForm.get("id").setValue(triage_item_interpretation.id);
      this.triageForm.get("interpretation").setValue(triage_item_interpretation.interpretation);
      this.color = triage_item_interpretation.color;
      //this.triageForm.get("color").setValue(triage_item_interpretation.color);
      this.triageForm.get("min_value").setValue(triage_item_interpretation.min_value);
      this.triageForm.get("max_value").setValue(triage_item_interpretation.max_value);
      this.triageForm.get("status").setValue(triage_item_interpretation.status);
    } else {
      this.triageForm.get("id").setValue(0);
      this.triageForm.get("interpretation").setValue("");
      this.triageForm.get("color").setValue(this.color);
      this.triageForm.get("min_value").setValue("");
      this.triageForm.get("max_value").setValue("");
      this.triageForm.get("status").setValue(1);
    }
  }

  addTriage() {
    this.triageForm.get("color").setValue(this.color);
    if (this.triageForm.valid) {
      this.isLoading = true;
      this.triageService.updateTriage(this.triageForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.interpretation) {
          this.toastr.error(error?.error?.errors?.interpretation);
        }
        if (error?.error?.errors?.color) {
          this.toastr.error(error?.error?.errors?.color);
        }
        if (error?.error?.errors?.min_value) {
          this.toastr.error(error?.error?.errors?.min_value);
        }
        if (error?.error?.errors?.min_value) {
          this.toastr.error(error?.error?.errors?.min_value);
        }
        if (error?.error?.errors?.triage_item) {
          this.toastr.error(error?.error?.errors?.triage_item);
        }
        if (error?.error?.errors?.units) {
          this.toastr.error(error?.error?.errors?.units);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}


