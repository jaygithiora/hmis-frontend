import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';
import { TriageItemsService } from '@services/dashboard/triage/triage-items/triage-items.service';
import { TriageService } from '@services/dashboard/triage/triage/triage.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-triage-list',
  templateUrl: './triage-list.component.html',
  styleUrl: './triage-list.component.scss'
})
export class TriageListComponent  implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  outpatient_visit_triages: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private triageService: TriageService , private toastr: ToastrService, private service: AuthService) {
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.triageService.getTriageList(page).subscribe((result: any) => {
      this.isLoading = false;
      this.outpatient_visit_triages = result.outpatient_visit_triages.data;// Set the items
      this.totalItems = result.outpatient_visit_triages.total; // Total number of items
      this.perPage = result.outpatient_visit_triages.per_page; // Items per page
      this.currentPage = result.outpatient_visit_triages.current_page; // Set the current page
      this.toItems = result.outpatient_visit_triages.to; // Set to Items
      this.fromItems = result.outpatient_visit_triages.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



