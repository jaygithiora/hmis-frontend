import { Component, OnInit} from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { PackagesService } from '@services/dashboard/subscriptions/packages/packages.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {
  public isLoading: boolean = true;

  subscription_packages: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private packageService: PackagesService, private toastr: ToastrService,
    private service: AuthService) {
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.packageService.getSubscriptionPackages(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.subscription_packages = result.subscription_packages.data;// Set the items
      this.totalItems = result.subscription_packages.total; // Total number of items
      this.perPage = result.subscription_packages.per_page; // Items per page
      this.currentPage = result.subscription_packages.current_page; // Set the current page
      this.toItems = result.subscription_packages.to; // Set to Items
      this.fromItems = result.subscription_packages.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



