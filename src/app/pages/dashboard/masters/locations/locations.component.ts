import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
})
export class LocationsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  locationForm!: FormGroup;

  locations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private locationService: LocationsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.locationForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['bbbb'],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.locationService.getLocations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.locations = result.locations.data;// Set the items
      this.totalItems = result.locations.total; // Total number of items
      this.perPage = result.locations.per_page; // Items per page
      this.currentPage = result.locations.current_page; // Set the current page
      this.toItems = result.locations.to; // Set to Items
      this.fromItems = result.locations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.locationForm.get("id").setValue(location.id);
      this.locationForm.get("name").setValue(location.name);
      this.locationForm.get("description").setValue(location.description);
      this.locationForm.get("status").setValue(location.status);
    } else {
      this.locationForm.get("id").setValue(0);
      this.locationForm.get("name").setValue("");
      this.locationForm.get("description").setValue("");
      this.locationForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.locationForm.valid) {
      this.isLoading = true;
      this.locationService.addLocation(this.locationForm.getRawValue()).subscribe((result: any) => {

        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
        }
        if(error?.error?.errors?.description){
          this.toastr.error(error?.error?.errors?.description);
        }
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
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
