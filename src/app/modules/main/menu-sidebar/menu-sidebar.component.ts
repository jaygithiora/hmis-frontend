import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth/auth.service';
import { title } from 'process';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public user?: any;
  public menu = MENU;

  constructor(
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
    });
    this.user = this.authService.getUser();
  }
}

export const MENU = [
  {
    name: 'Dashboard',
    iconClasses: 'fas fa-tachometer-alt',
    path: ['/dashboard']
  },
  {
    name: 'Masters',
    iconClasses: 'fas fa-folder',
    children: [
      {
        name: 'Hospital Data',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/hospital-data']
      },
      {
        name: 'Locations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/locations']
      },
      {
        name: 'Main Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/main-types']
      },
      {
        name: 'Sub Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/sub-types']
      },
      {
        name: 'Salutations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/salutations']
      },
      {
        name: 'Departments',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/departments']
      },
      {
        name: 'Consultation Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/consultation-types']
      },
      {
        name: 'Consultation Rooms',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/consultation-rooms']
      },
      {
        name: 'Main Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/main-accounts']
      },
      {
        name: 'Sub Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/sub-accounts']
      },
      {
        name: 'Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/accounts']
      },
      {
        name: 'Plans',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/plans']
      },
      {
        name: 'Blood Groups',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/blood-groups']
      },
      {
        name: 'Generic Names',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/generic-names']
      },
      {
        name: 'ICDs',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/icds']
      },
      {
        name: 'Stores',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/stores']
      },
      {
        name: 'Lab Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/lab-categories']
      }
    ]
  },
  {
    name: 'IP Masters',
    iconClasses: 'fas fa-bed',
    children: [
      {
        name: 'Wards',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/wards']
      },
      {
        name: 'Beds',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/beds']
      },
      {
        name: 'Bed Charges',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/bed-charges']
      },
      {
        name: 'Bed Charge Settings',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/bed-charge-settings']
      },
    ]
  },
  {
    name: 'Inventory',
    iconClasses: 'fas fa-truck-loading',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/categories']
      },
      {
        name: 'Pack Sizes',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/pack-sizes']
      },
      {
        name: 'Purchase Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/purchase-types']
      },
      {
        name: 'Product Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/product-types']
      },
      {
        name: 'Drug Instructions',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/drug-instructions']
      },
      {
        name: 'Dose Measures',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/dose-measures']
      },
      {
        name: 'Products',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/products']
      },
      {
        name: 'Product Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/product-rates']
      },
    ]
  },
  {
    name: 'Radiology',
    iconClasses: 'fas fa-x-ray',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/categories']
      },
      {
        name: 'Radiology Items',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/items']
      },
      {
        name: 'Radiology Item Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/item-rates']
      },
    ]
  },
  {
    name: 'Laboratory',
    iconClasses: 'fas fa-vials',
    children: [
      {
        name: 'Lab Tests',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/tests']
      },
      {
        name: 'Lab Test Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/test-rates']
      },
      {
        name: 'Lab Test References',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/test-references']
      },
    ]
  },
  {
    name: 'Services',
    iconClasses: 'fas fa-concierge-bell',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/service-categories']
      },
      {
        name: 'Services',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/services']
      },
      {
        name: 'Service Rate',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/service-rates']
      },
    ]
  },
  {
    name: 'Patients',
    iconClasses: 'fas fa-user-injured',
    children: [
      {
        name: 'Patient Registration',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/patient-registration']
      },
      {
        name: 'Patients',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/patients']
      },
    ]
  },
  {
    name: 'Settings',
    iconClasses: 'fas fa-cog',
    children: [
      {
        name: 'Doctors',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/doctors']
      },
      {
        name: 'Next Of Kin',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/next-of-kin-relations']
      },
    ]
  },
  {
    name: 'Users',
    iconClasses: 'fas fa-users',
    children: [
      {
        name: 'Users',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/users']
      },
      {
        name: 'Roles',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/users/roles']
      },
    ]
  },
  {
    name: 'Profile',
    iconClasses: 'fas fa-user',
    path: ['/profile']
  },
];
