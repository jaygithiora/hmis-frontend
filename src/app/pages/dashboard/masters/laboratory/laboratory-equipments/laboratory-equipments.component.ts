import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryEquipmentService } from '@services/dashboard/laboratory/laboratory-equipment/laboratory-equipment.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-equipments',
  templateUrl: './laboratory-equipments.component.html',
  styleUrl: './laboratory-equipments.component.scss'
})
export class LaboratoryEquipmentsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  equipmentForm!: FormGroup;

  equipment: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private laboratoryEquipmentService: LaboratoryEquipmentService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.equipmentForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratoryEquipmentService.getLaboratoryEquipment(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.equipment = result.equipment.data;// Set the items
      this.totalItems = result.equipment.total; // Total number of items
      this.perPage = result.equipment.per_page; // Items per page
      this.currentPage = result.equipment.current_page; // Set the current page
      this.toItems = result.equipment.to; // Set to Items
      this.fromItems = result.equipment.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, equipment: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (equipment != null) {
      this.equipmentForm.get("id").setValue(equipment.id);
      this.equipmentForm.get("name").setValue(equipment.name);
    } else {
      this.equipmentForm.get("id").setValue(0);
      this.equipmentForm.get("name").setValue("");
    }
  }
  addEquipment() {
    if (this.equipmentForm.valid) {
      this.isLoading = true;
      this.laboratoryEquipmentService.updateLaboratoryEquipment(this.equipmentForm.getRawValue()).subscribe((result: any) => {
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