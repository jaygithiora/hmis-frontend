import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';
import { FrontendComponent } from '@pages/frontend/frontend.component';
import { IndexComponent } from '@pages/frontend/index/index.component';
import { authGuard } from '@guards/auth.guard';
import { HospitalDataComponent } from '@pages/dashboard/masters/hospital-data/hospital-data.component';
import { LocationsComponent } from '@pages/dashboard/masters/locations/locations.component';
import { MainTypesComponent } from '@pages/dashboard/masters/main-types/main-types.component';
import { SalutationsComponent } from '@pages/dashboard/masters/salutations/salutations.component';
import { DepartmentsComponent } from '@pages/dashboard/masters/departments/departments.component';
import { BloodGroupsComponent } from '@pages/dashboard/masters/blood-groups/blood-groups.component';
import { GenericNamesComponent } from '@pages/dashboard/masters/generic-names/generic-names.component';
import { IcdsComponent } from '@pages/dashboard/masters/icds/icds.component';
import { SubTypesComponent } from '@pages/dashboard/masters/sub-types/sub-types.component';
import { DoctorsComponent } from '@pages/dashboard/settings/doctors/doctors.component';
import { UsersComponent } from '@pages/dashboard/users/users.component';
import { ConsultationTypesComponent } from '@pages/dashboard/masters/consultation-types/consultation-types.component';
import { MainAccountsComponent } from '@pages/dashboard/masters/main-accounts/main-accounts.component';

const routes: Routes = [
    {
        path: '',
        component: FrontendComponent,
        children: [
            {
                path:"",
                component:IndexComponent
            }
        ]
    },
    {
        path: 'dashboard',
        component: MainComponent,
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [
          //masters
            {
                path: 'masters/hospital-data',
                component: HospitalDataComponent
            },
            {
                path: 'masters/locations',
                component: LocationsComponent
            },
            {
                path: 'masters/main-types',
                component: MainTypesComponent
            },
            {
                path: 'masters/sub-types',
                component: SubTypesComponent
            },
            {
                path: 'masters/salutations',
                component: SalutationsComponent
            },
            {
                path: 'masters/departments',
                component: DepartmentsComponent
            },
            {
                path: 'masters/consultation-types',
                component: ConsultationTypesComponent
            },
            {
                path: 'masters/main-accounts',
                component: MainAccountsComponent
            },
            {
                path: 'masters/blood-groups',
                component: BloodGroupsComponent
            },
            {
                path: 'masters/generic-names',
                component: GenericNamesComponent
            },
            {
                path: 'masters/icds',
                component: IcdsComponent
            },
            //settings
            {
              path: 'settings/doctors',
              component: DoctorsComponent
            },
            //settings
            {
              path: 'users',
              component: UsersComponent
            },
            //profile
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'blank',
                component: BlankComponent
            },
            {
                path: 'sub-menu-1',
                component: SubMenuComponent
            },
            {
                path: 'sub-menu-2',
                component: BlankComponent
            },
            {
                path: '',
                component: DashboardComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        //canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        //canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
