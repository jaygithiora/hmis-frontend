import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { PackagesService } from '@services/dashboard/subscriptions/packages/packages.service';
import { SubscriptionsService } from '@services/dashboard/subscriptions/subscriptions/subscriptions.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent implements OnInit {
  public isLoading: boolean = true;

  subscriptions: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private subscriptionsSevice: SubscriptionsService, private toastr: ToastrService,
    private service: AuthService) {
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.subscriptionsSevice.getSubscriptions(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.subscriptions = result.subscriptions.data;// Set the items
      this.totalItems = result.subscriptions.total; // Total number of items
      this.perPage = result.subscriptions.per_page; // Items per page
      this.currentPage = result.subscriptions.current_page; // Set the current page
      this.toItems = result.subscriptions.to; // Set to Items
      this.fromItems = result.subscriptions.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}