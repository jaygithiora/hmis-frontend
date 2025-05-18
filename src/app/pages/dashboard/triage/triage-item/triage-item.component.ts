import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { TriageItemsService } from '@services/dashboard/triage/triage-items/triage-items.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-triage-items',
  templateUrl: './triage-item.component.html',
  styleUrl: './triage-item.component.scss'
})
export class TriageItemComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  triage_item: any;

  triageItemsForm!: FormGroup;
  triageItemChoicesForm!: FormGroup;

  triage_item_interpretations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  triage_item_choices: any[] = [];// Store fetched items
  totalItems1 = 0;     // Total number of items
  currentPage1 = 1;    // Current page number
  fromItems1 = 0; //from items
  toItems1 = 0; //to items
  perPage1 = 10;       // Items per page

  color: string = '#000000';
  active = 1;

  constructor(private triageItemsService: TriageItemsService, private triageCategoriesService: TriageCategoriesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
  private router: Router, private activatedRoute:ActivatedRoute) {
    this.triageItemsForm = this.fb.group({
      id: ['0', [Validators.required]],
      interpretation: ['', [Validators.required]],
      triage_item: ['', [Validators.required]],
      color: [this.color, [Validators.required]],
      min_value: [''],
      max_value: [''],
      status: ['1', [Validators.required]]
    });
    this.triageItemChoicesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      triage_item: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if(id != null){
      this.triageItemsForm.get("triage_item").setValue(id);
      this.triageItemChoicesForm.get("triage_item").setValue(id);
      this.isLoading = true;
      this.triageItemsService.getTriageItem(parseInt(id)).subscribe((result: any) => {
        this.triage_item = result.triage_item;
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    this.loadPage(1, parseInt(id));
    this.loadChoicesPage(1, parseInt(id));
    }else{
      this.router.navigate(["dashboard/triage/items"]);
    }
  }

  loadPage(page: number, id:number):void {
    this.isLoading = true;
    this.triageItemsService.getTriageItemInterpretations(page, id).subscribe((result: any) => {
      this.isLoading = false;
      this.triage_item_interpretations = result.triage_item_interpretations.data;// Set the items
      this.totalItems = result.triage_item_interpretations.total; // Total number of items
      this.perPage = result.triage_item_interpretations.per_page; // Items per page
      this.currentPage = result.triage_item_interpretations.current_page; // Set the current page
      this.toItems = result.triage_item_interpretations.to; // Set to Items
      this.fromItems = result.triage_item_interpretations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  loadChoicesPage(page: number, id:number):void {
    this.isLoading = true;
    this.triageItemsService.getTriageItemChoices(page, id).subscribe((result: any) => {
      this.isLoading = false;
      this.triage_item_choices = result.triage_item_choices.data;// Set the items
      this.totalItems1 = result.triage_item_choices.total; // Total number of items
      this.perPage1 = result.triage_item_choices.per_page; // Items per page
      this.currentPage1 = result.triage_item_choices.current_page; // Set the current page
      this.toItems1 = result.triage_item_choices.to; // Set to Items
      this.fromItems1 = result.triage_item_choices.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, triage_item_interpretation: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (triage_item_interpretation != null) {
      this.triageItemsForm.get("id").setValue(triage_item_interpretation.id);
      this.triageItemsForm.get("interpretation").setValue(triage_item_interpretation.interpretation);
      this.color = triage_item_interpretation.color;
      //this.triageItemsForm.get("color").setValue(triage_item_interpretation.color);
      this.triageItemsForm.get("min_value").setValue(triage_item_interpretation.min_value);
      this.triageItemsForm.get("max_value").setValue(triage_item_interpretation.max_value);
      this.triageItemsForm.get("status").setValue(triage_item_interpretation.status);
    } else {
      this.triageItemsForm.get("id").setValue(0);
      this.triageItemsForm.get("interpretation").setValue("");
      this.triageItemsForm.get("color").setValue(this.color);
      this.triageItemsForm.get("min_value").setValue("");
      this.triageItemsForm.get("max_value").setValue("");
      this.triageItemsForm.get("status").setValue(1);
    }
  }
  openModal2(content: TemplateRef<any>, triage_item_choice: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (triage_item_choice != null) {
      this.triageItemChoicesForm.get("id").setValue(triage_item_choice.id);
      this.triageItemChoicesForm.get("name").setValue(triage_item_choice.name);
      this.triageItemChoicesForm.get("status").setValue(triage_item_choice.status);
    } else {
      this.triageItemChoicesForm.get("id").setValue(0);
      this.triageItemChoicesForm.get("name").setValue("");
      this.triageItemChoicesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    this.triageItemsForm.get("color").setValue(this.color);
    if (this.triageItemsForm.valid) {
      this.isLoading = true;
      this.triageItemsService.updateTriageItemInterpretation(this.triageItemsForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1, this.triage_item?.id);
          this.modalRef?.close();
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

  addTriageItemChoice() {
    if (this.triageItemChoicesForm.valid) {
      this.isLoading = true;
      this.triageItemsService.updateTriageItemChoice(this.triageItemChoicesForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadChoicesPage(1, this.triage_item?.id);
          this.modalRef?.close();
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
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


