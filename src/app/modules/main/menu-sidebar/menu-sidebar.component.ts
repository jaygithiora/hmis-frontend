import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth/auth.service';
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
      }
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
