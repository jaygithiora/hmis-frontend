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
    permission: 'View Masters Menu',
    children: [
      /*{
        name: 'Hospital Data',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/hospital-data'],
      },
      {
        name: 'Locations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/locations']
      },*/
      {
        name: 'Insurances',
        iconClasses: 'fas fa-circle icon-small',
        //path: ['/dashboard/masters/locations'],
        permission: 'View Insurances',
        children: [{
          name: 'Insurances',
          iconClasses: 'fas fa-minus icon-small',
          path: ['/dashboard/masters/insurances/list'],
          permission: 'View Insurances',
        }, {
          name: 'Schemes',
          iconClasses: 'fas fa-minus icon-small',
          path: ['/dashboard/masters/insurances/schemes'],
          permission: 'View Schemes',
        }]
      },
      {
        name: 'Payments',
        iconClasses: 'fas fa-circle icon-small',
        //path: ['/dashboard/masters/locations'],
        permission: 'View Payments Menu',
        children: [{
          name: 'Payment Types',
          iconClasses: 'fas fa-minus icon-small',
          path: ['/dashboard/masters/payments/payment-types'],
          permission: 'View Payment Types',
        }, {
          name: 'Payment Modes',
          iconClasses: 'fas fa-minus icon-small',
          path: ['/dashboard/masters/payments/payment-modes'],
          permission: 'View Payment Modes',
        },]
      },
      /*
      {
        name: 'Main Types',
        iconClasses: 'fas fa-circle icon-small',
        //path: ['/dashboard/masters/main-types'],
        permission: 'View Main Types',
        children: [{
          name: 'Main Types',
          iconClasses: 'fas fa-minus icon-small',
          path: ['/dashboard/masters/main-types'],
          permission: 'View Main Types',
        },]
      },
      {
        name: 'Sub Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/sub-types'],
        permission: 'View Sub Types'
      },*/
      {
        name: 'Salutations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/salutations'],
        permission: 'View Salutations'
      },
      {
        name: 'Departments',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/departments'],
        permission: 'View Departments'
      },
      {
        name: 'Doctors',
        iconClasses: 'fas fa-circle icon-small',
        //path: ['/dashboard/masters/doctors'],
        permission: 'View Doctors Menu',
        children: [
          {
            name: 'Doctors',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/list'],
            permission: 'View Doctors'
          },
          {
            name: 'Categories',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/categories'],
            permission: 'View Doctor Categories'
          },
          {
            name: 'Specializations',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/specializations'],
            permission: 'View Doctor Specializations'
          },
          {
            name: 'Departments',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/departments'],
            permission: 'View Doctor Departments'
          },
          {
            name: 'Fees',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/fees'],
            permission: 'View Doctor Fees'
          },
          {
            name: 'Share',
            iconClasses: 'fas fa-minus icon-small',
            path: ['/dashboard/masters/doctors/share'],
            permission: 'View Doctor Share'
          },
        ]
      },
      /*
      {
        name: 'Consultation Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/consultation-types'],
        permission: 'View Consultation Types'
      },*/
      {
        name: 'Consultation Rooms',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/consultation-rooms'],
        permission: 'View Consultation Rooms'
      },
      {
        name: 'Main Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/main-accounts'],
        permission: 'View Main Accounts'
      },
      {
        name: 'Sub Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/sub-accounts'],
        permission: 'View Sub Accounts'
      },
      {
        name: 'Accounts',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/accounts'],
        permission: 'View Accounts'
      },
      {
        name: 'Plans',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/plans'],
        permission: 'View Plans'
      },
      {
        name: 'Blood Groups',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/blood-groups'],
        permission: 'View Blood Groups'
      },
      {
        name: 'Generic Names',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/generic-names'],
        permission: 'View Generic Names'
      },
      {
        name: 'ICDs',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/icds'],
        permission: 'View ICDS'
      },
      {
        name: 'Stores',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/stores'],
        permission: 'View Stores'
      },
      {
        name: 'Lab Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/masters/lab-categories'],
        permission: 'View Laboratory Categories'
      }
    ]
  },
  {
    name: 'IP Masters',
    iconClasses: 'fas fa-bed',
    permission: 'View IP Masters Menu',
    children: [
      {
        name: 'Wards',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/wards'],
        permission: 'View Wards'
      },
      {
        name: 'Beds',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/beds'],
        permission: 'View Beds'
      },
      {
        name: 'Bed Charges',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/bed-charges'],
        permission: 'View Bed Charges'
      },
      {
        name: 'Bed Charge Settings',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/ip-masters/bed-charge-settings'],
        permission: 'View Bed Charges Settings'
      },
    ]
  },
  {
    name: 'Inventory',
    iconClasses: 'fas fa-truck-loading',
    permission: 'View Inventory Menu',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/categories'],
        permission: 'View Inventory Categories'
      },
      {
        name: 'Pack Sizes',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/pack-sizes'],
        permission: 'View Inventory Pack Sizes'
      },
      {
        name: 'Purchase Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/purchase-types'],
        permission: 'View Inventory Purchase Types'
      },
      {
        name: 'Product Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/product-types'],
        permission: 'View Inventory Product Types'
      },
      {
        name: 'Drug Instructions',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/drug-instructions'],
        permission: 'View Inventory Drug Instructions'
      },
      {
        name: 'Dose Measures',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/dose-measures'],
        permission: 'View Inventory Dose Measures'
      },
      {
        name: 'Strength Units',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/strength-units'],
        permission: 'View Inventory Strength Units'
      },
      {
        name: 'Drug Frequencies',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/drug-frequencies'],
        permission: 'View Inventory Drug Frequencies'
      },
      {
        name: 'Products',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/products'],
        permission: 'View Inventory Products'
      },
      {
        name: 'Product Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/inventory/product-rates'],
        permission: 'View Inventory Product Rates',
      },
    ]
  },
  {
    name: 'Radiology',
    iconClasses: 'fas fa-x-ray',
    permission: 'View Radiology Menu',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/categories'],
        permission: 'View Radiology Categories'
      },
      {
        name: 'Radiology Items',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/items'],
        permission: 'View Radiology Items'
      },
      {
        name: 'Radiology Item Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/radiology/item-rates'],
        permission: 'View Radiology Item Rates'
      },
    ]
  },
  {
    name: 'Laboratory',
    iconClasses: 'fas fa-vials',
    permission: "View Laboratory Menu",
    children: [
      {
        name: 'Lab Tests',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/tests'],
        permission: "View Laboratory Tests"
      },
      {
        name: 'Lab Test Rates',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/test-rates'],
        permission: 'View Laboratory Test Rates'
      },
      {
        name: 'Lab Test References',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/test-references'],
        permission: 'View Laboratory Test References'
      },
      {
        name: 'Sample Collections',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/sample-collections'],
        permission: 'View Laboratory Sample Collections'
      },
      {
        name: 'Lab Work List',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/lab-work-list'],
        permission: 'View Laboratory Work List'
      },
      {
        name: 'Publish Lab Results',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/publish-results'],
        permission: 'View Laboratory Publish Results'
      },
      {
        name: 'Results Master Data',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/results-master-data'],
        permission: "View Laboratory Results Master Data"
      },
      {
        name: 'Lab Equipment',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/equipment'],
        permission: "View Laboratory Equipment"
      },
      {
        name: 'Sample Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/sample-types'],
        permission: 'View Laboratory Sample Types'
      },
      {
        name: 'Lab Interpretations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/interpretations'],
        permission: 'View Laboratory Interpretations'
      },
      {
        name: 'Lab Linking',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/laboratory/linking'],
        permissions: 'View Laboratory Linking'
      },
    ]
  },
  {
    name: 'Services',
    iconClasses: 'fas fa-concierge-bell',
    permission: 'View Services Menu',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/service-categories'],
        permission: 'View Service Categories'
      },
      {
        name: 'Services',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/services'],
        permission: 'View Services'
      },
      {
        name: 'Service Rate',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/services/service-rates'],
        permission: 'View Service Rates'
      },
    ]
  },
  {
    name: 'Patients',
    iconClasses: 'fas fa-user-injured',
    permission: 'View Patients Menu',
    children: [
      {
        name: 'Patient Registration',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/patients/registration'],
        permission: 'View Patient Registration'
      },
      {
        name: 'Patients',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/patients/list'],
        permission: 'View Patients'
      },
    ]
  },
  {
    name: 'Visit Management',
    iconClasses: 'fas fa-hospital-user',
    permission: 'Visit Management Menu',
    children: [
      {
        name: 'Create OP Visit',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/visits/op/create'],
        permission: 'Create OP Visit'
      },
      {
        name: 'Create IP Visit',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/visits/ip/create'],
        permission: 'Create IP Visit'
      },
      {
        name: 'OP Visit List',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/visits/op/list'],
        permission: 'View OP Visits'
      },
      {
        name: 'IP Visit List',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/visits/ip/list'],
        permission: 'View IP Visits'
      },
    ]
  },
  {
    name: 'Cashier',
    iconClasses: 'fas fa-cash-register',
    permission: 'View Cashier Menu',
    children: [
      {
        name: 'Bills',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/bills/list'],
        permission: 'View Bills'
      },
      {
        name: 'Op Discount Approvals',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/bills/op-discount-approvals'],
        permission: 'View Op Discount Approvals'
      },
      {
        name: 'Reprints',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/bills/reprints'],
        permission: 'View Reprints'
      },
    ]
  },
  {
    name: 'Triage',
    iconClasses: 'fas fa-thermometer',
    permission: 'View Triage Menu',
    children: [
      {
        name: 'Categories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/triage/categories'],
        permission: 'View Triage Categories'
      },
      {
        name: 'Triage Items',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/triage/items'],
        permission: 'View Triage Items',
      },
      {
        name: 'Triage List',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/triage/list'],
        permission: 'View Triage List'
      },
    ]
  },
  {
    name: 'Consultation',
    iconClasses: 'fas fa-notes-medical',
    permission: 'View Consultation Menu',
    children: [
      {
        name: 'Consultation List',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/consultation/list'],
        permission: 'View Consultations'
      },
    ]
  },
  {
    name: 'Self Request',
    iconClasses: 'fas fa-users',
    path: ['/dashboard/self-request'],
    permission: 'View Self Request Menu',
  },
  {
    name: 'Stock Management',
    iconClasses: 'fas fa-pallet',
    permission: 'View Stock Management Menu',
    children: [
      {
        name: 'Product Stock',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/stocks/products'],
        permission: 'View Product Stocks'
      },
    ]
  },
  {
    name: 'Settings',
    iconClasses: 'fas fa-cog',
    permission: "View Settings Menu",
    children: [
      {
        name: 'Next Of Kin',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/next-of-kin-relations'],
        permission: "View Next Of Kin Settings"
      },
      {
        name: 'Statuses',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/statuses'],
        permission: "View Status Settings"
      },
      {
        name: 'Systems',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/systems'],
        permission: 'View System Settings'
      },
      {
        name: 'Medical Histories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/medical-histories'],
        permission: 'View Medical History Settings'
      },
      {
        name: 'Surgeries',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/surgeries'],
        permission: 'View Surgery Settings'
      },
      {
        name: 'Social Histories',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/social-histories'],
        permission: 'View Social History Settings'
      },
      {
        name: 'Sick Leave Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/sick-leave-types'],
        permission: 'View Sick Leave Type Settings'
      },
      {
        name: 'Specializations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/specializations'],
        permission: 'View Specialization Settings'
      },
      {
        name: 'Fee Types',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/settings/fee-types'],
        permission: 'View Fee Type Settings'
      },
    ]
  },
  {
    name: 'Organizations',
    iconClasses: 'fas fa-building',
    permission: "View Organizations Menu",
    children: [
      {
        name: 'Organizations',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/organizations/list'],
        permission: "View Organizations"
      },
      {
        name: 'Branches',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/organizations/branches'],
        permission: "View Branches"
      },
    ]
  },
  {
    name: 'Users',
    iconClasses: 'fas fa-users',
    permission: 'View Users Menu',
    children: [
      {
        name: 'Users',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/users/list'],
        permission: 'View Users'
      },
      {
        name: 'Roles',
        iconClasses: 'fas fa-circle icon-small',
        path: ['/dashboard/users/roles'],
        permission: "View Roles"
      },
    ]
  },
  {
    name: 'Profile',
    iconClasses: 'fas fa-user',
    path: ['/dashboard/profile']
  },
];
