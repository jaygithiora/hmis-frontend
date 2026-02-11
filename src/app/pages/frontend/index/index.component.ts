import { Component, OnInit } from '@angular/core';
import { IndexService } from '@services/frontend/index/index.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit{
public isLoading = true;
  subscription_packages:any[] = [];

  constructor(private indexService:IndexService, private toastr:ToastrService){

  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.indexService.getSubscriptionPackages(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.subscription_packages = result.subscription_packages.data;// Set the items
      /*this.totalItems = result.subscription_packages.total; // Total number of items
      this.perPage = result.subscription_packages.per_page; // Items per page
      this.currentPage = result.subscription_packages.current_page; // Set the current page
      this.toItems = result.subscription_packages.to; // Set to Items
      this.fromItems = result.subscription_packages.from; // Set from Items*/
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }
}
