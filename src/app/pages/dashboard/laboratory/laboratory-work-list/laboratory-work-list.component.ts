import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LaboratorySampleCollectionsService } from '@services/dashboard/laboratory/laboratory-sample-collections/laboratory-sample-collections.service';
import { LaboratoryWorkListService } from '@services/dashboard/laboratory/laboratory-work-list/laboratory-work-list.service';
import moment from 'moment';

@Component({
  selector: 'app-laboratory-work-list',
  templateUrl: './laboratory-work-list.component.html',
  styleUrl: './laboratory-work-list.component.scss'
})
export class LaboratoryWorkListComponent implements OnInit {
  modalRef: NgbModalRef;
  public isLoading: boolean = true;

  work_list: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private laboratoryWorkListService: LaboratoryWorkListService) {
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratoryWorkListService.getLaboratoryWorkList(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.work_list = result.work_list.data;// Set the items
      this.totalItems = result.work_list.total; // Total number of items
      this.perPage = result.work_list.per_page; // Items per page
      this.currentPage = result.work_list.current_page; // Set the current page
      this.toItems = result.work_list.to; // Set to Items
      this.fromItems = result.work_list.from; // Set from Items
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

