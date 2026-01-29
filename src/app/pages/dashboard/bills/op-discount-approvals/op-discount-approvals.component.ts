import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BillsService } from '@services/dashboard/bills/bills/bills.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-op-discount-approvals',
  templateUrl: './op-discount-approvals.component.html',
  styleUrl: './op-discount-approvals.component.scss'
})
export class OpDiscountApprovalsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;

  bills: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private billsService:BillsService, private toastr: ToastrService, private service: AuthService) {
   
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.billsService.getDiscountBills(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.bills = result.bills.data;// Set the items
      this.totalItems = result.bills.total; // Total number of items
      this.perPage = result.bills.per_page; // Items per page
      this.currentPage = result.bills.current_page; // Set the current page
      this.toItems = result.bills.to; // Set to Items
      this.fromItems = result.bills.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}




