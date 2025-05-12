import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-next-of-kin-relations',
  templateUrl: './next-of-kin-relations.component.html',
  styleUrl: './next-of-kin-relations.component.scss'
})
export class NextOfKinRelationsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  nextOfKinRelationsForm!: FormGroup;
  next_of_kin_relations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private nextOfKinRelationsService: NextOfKinRelationsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.nextOfKinRelationsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.nextOfKinRelationsService.getNextOfKinRelations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.next_of_kin_relations = result.next_of_kin_relations.data;// Set the items
      this.totalItems = result.next_of_kin_relations.total; // Total number of items
      this.perPage = result.next_of_kin_relations.per_page; // Items per page
      this.currentPage = result.next_of_kin_relations.current_page; // Set the current page
      this.toItems = result.next_of_kin_relations.to; // Set to Items
      this.fromItems = result.next_of_kin_relations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, next_of_kin_relation: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (next_of_kin_relation != null) {
      this.nextOfKinRelationsForm.get("id").setValue(next_of_kin_relation.id);
      this.nextOfKinRelationsForm.get("name").setValue(next_of_kin_relation.name);
      this.nextOfKinRelationsForm.get("status").setValue(next_of_kin_relation.status);
    } else {
      this.nextOfKinRelationsForm.get("id").setValue(0);
      this.nextOfKinRelationsForm.get("name").setValue("");
      this.nextOfKinRelationsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.nextOfKinRelationsForm.valid) {
      this.isLoading = true;
      this.nextOfKinRelationsService.updateNextOfKinRelations(this.nextOfKinRelationsForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
        }
        if (error?.error?.errors?.main_type) {
          this.toastr.error(error?.error?.errors?.main_type);
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

