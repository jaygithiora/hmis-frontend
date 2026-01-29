import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LaboratorySampleCollectionsService } from '@services/dashboard/laboratory/laboratory-sample-collections/laboratory-sample-collections.service';
import moment from 'moment';

@Component({
  selector: 'app-laboratory-sample-collections',
  templateUrl: './laboratory-sample-collections.component.html',
  styleUrl: './laboratory-sample-collections.component.scss'
})
export class LaboratorySampleCollectionsComponent implements OnInit {
  modalRef: NgbModalRef;
  public isLoading: boolean = true;

  sample_collections: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private laboratorySampleCollectionService: LaboratorySampleCollectionsService) {
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratorySampleCollectionService.getLaboratorySampleCollections(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.sample_collections = result.sample_collections.data;// Set the items
      this.totalItems = result.sample_collections.total; // Total number of items
      this.perPage = result.sample_collections.per_page; // Items per page
      this.currentPage = result.sample_collections.current_page; // Set the current page
      this.toItems = result.sample_collections.to; // Set to Items
      this.fromItems = result.sample_collections.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }
  getAgeDetails(dob: string) {
    const birthDate = moment(dob);
    const today = moment();

    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');

    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');

    const days = today.diff(birthDate, 'days');
    let age = "";
    if (years > 0) {
      age += `${years} year(s)`;
    }
    if (months > 0) {
      age += ` ${months} month(s)`;
    }
    if (days > 0) {
      age += ` ${days} days(s)`;
    }
    return age;
    //return { years, months, days };
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
