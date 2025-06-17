import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from '@modules/recover-password/recover-password.component';
import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component';
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
import { SubAccountsComponent } from '@pages/dashboard/masters/sub-accounts/sub-accounts.component';
import { AccountsComponent } from '@pages/dashboard/masters/accounts/accounts.component';
import { PlansComponent } from '@pages/dashboard/masters/plans/plans.component';
import { InventoryCategoriesComponent } from '@pages/dashboard/inventory/inventory-categories/inventory-categories.component';
import { PackSizesComponent } from '@pages/dashboard/inventory/pack-sizes/pack-sizes.component';
import { PurchaseTypesComponent } from '@pages/dashboard/inventory/purchase-types/purchase-types.component';
import { ProductTypesComponent } from '@pages/dashboard/inventory/product-types/product-types.component';
import { DrugInstructionsComponent } from '@pages/dashboard/inventory/drug-instructions/drug-instructions.component';
import { DoseMeasuresComponent } from '@pages/dashboard/inventory/dose-measures/dose-measures.component';
import { ProductsComponent } from '@pages/dashboard/inventory/products/products.component';
import { ConsultationRoomsComponent } from '@pages/dashboard/masters/consultation-rooms/consultation-rooms.component';
import { ServiceCategoriesComponent } from '@pages/dashboard/services/service-categories/service-categories.component';
import { ServicesComponent } from '@pages/dashboard/services/services/services.component';
import { StoresComponent } from '@pages/dashboard/masters/stores/stores.component';
import { LaboratoryCategoriesComponent } from '@pages/dashboard/masters/laboratory-categories/laboratory-categories.component';
import { RadiologyCategoriesComponent } from '@pages/dashboard/radiology/radiology-categories/radiology-categories.component';
import { RadiologyItemsComponent } from '@pages/dashboard/radiology/radiology-items/radiology-items.component';
import { LaboratoryTestsComponent } from '@pages/dashboard/laboratory/laboratory-tests/laboratory-tests.component';
import { ProductRatesComponent } from '@pages/dashboard/inventory/product-rates/product-rates.component';
import { LaboratoryTestRatesComponent } from '@pages/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.component';
import { LaboratoryTestReferencesComponent } from '@pages/dashboard/laboratory/laboratory-test-references/laboratory-test-references.component';
import { RadiologyItemRatesComponent } from '@pages/dashboard/radiology/radiology-item-rates/radiology-item-rates.component';
import { ServiceRatesComponent } from '@pages/dashboard/services/service-rates/service-rates.component';
import { WardsComponent } from '@pages/dashboard/ip-masters/wards/wards.component';
import { BedsComponent } from '@pages/dashboard/ip-masters/beds/beds.component';
import { BedChargesComponent } from '@pages/dashboard/ip-masters/bed-charges/bed-charges.component';
import { BedChargeSettingsComponent } from '@pages/dashboard/ip-masters/bed-charge-settings/bed-charge-settings.component';
import { PatientRegistrationComponent } from '@pages/dashboard/patients/patient-registration/patient-registration.component';
import { NextOfKinRelationsComponent } from '@pages/dashboard/settings/next-of-kin-relations/next-of-kin-relations.component';
import { PatientsListComponent } from '@pages/dashboard/patients/patients-list/patients-list.component';
import { CreateOpVisitComponent } from '@pages/dashboard/visit-management/create-op-visit/create-op-visit.component';
import { CreateIpVisitComponent } from '@pages/dashboard/visit-management/create-ip-visit/create-ip-visit.component';
import { VisitOpListComponent } from '@pages/dashboard/visit-management/visit-op-list/visit-op-list.component';
import { VisitIpListComponent } from '@pages/dashboard/visit-management/visit-ip-list/visit-ip-list.component';
import { PaymentModesComponent } from '@pages/dashboard/settings/payment-modes/payment-modes.component';
import { TriageCategoriesComponent } from '@pages/dashboard/triage/triage-categories/triage-categories.component';
import { TriageItemsComponent } from '@pages/dashboard/triage/triage-items/triage-items.component';
import { BillsComponent } from '@pages/dashboard/bills/bills/bills.component';
import { BillViewComponent } from '@pages/dashboard/bills/bill-view/bill-view.component';
import { TriageItemComponent } from '@pages/dashboard/triage/triage-item/triage-item.component';
import { TriageListComponent } from '@pages/dashboard/triage/triage-list/triage-list.component';
import { TriageComponent } from '@pages/dashboard/triage/triage/triage.component';
import { ConsultationListComponent } from '@pages/dashboard/consultation/consultation-list/consultation-list.component';
import { StatusesComponent } from '@pages/dashboard/settings/statuses/statuses.component';
import { ConsultationFormComponent } from '@pages/dashboard/consultation/consultation-form/consultation-form.component';
import { SystemsComponent } from '@pages/dashboard/settings/systems/systems.component';

const routes: Routes = [
  {
    path: '',
    component: FrontendComponent,
    children: [
      {
        path: "",
        component: IndexComponent
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
        path: 'masters/consultation-rooms',
        component: ConsultationRoomsComponent
      },
      {
        path: 'masters/main-accounts',
        component: MainAccountsComponent
      },
      {
        path: 'masters/sub-accounts',
        component: SubAccountsComponent
      },
      {
        path: 'masters/accounts',
        component: AccountsComponent
      },
      {
        path: 'masters/plans',
        component: PlansComponent
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
      {
        path: 'masters/stores',
        component: StoresComponent
      },
      {
        path: 'masters/lab-categories',
        component: LaboratoryCategoriesComponent
      },
      //ip masters
      {
        path: 'ip-masters/wards',
        component: WardsComponent
      },
      {
        path: 'ip-masters/beds',
        component: BedsComponent
      },
      {
        path: 'ip-masters/bed-charges',
        component: BedChargesComponent
      },
      {
        path: 'ip-masters/bed-charge-settings',
        component: BedChargeSettingsComponent
      },
      //inventory
      {
        path: 'inventory/categories',
        component: InventoryCategoriesComponent
      },
      {
        path: 'inventory/pack-sizes',
        component: PackSizesComponent
      },
      {
        path: 'inventory/purchase-types',
        component: PurchaseTypesComponent
      },
      {
        path: 'inventory/product-types',
        component: ProductTypesComponent
      },
      {
        path: 'inventory/drug-instructions',
        component: DrugInstructionsComponent
      },
      {
        path: 'inventory/dose-measures',
        component: DoseMeasuresComponent
      },
      {
        path: 'inventory/products',
        component: ProductsComponent
      },
      {
        path: 'inventory/product-rates',
        component: ProductRatesComponent
      },
      //radiology
      {
        path: 'radiology/items',
        component: RadiologyItemsComponent
      },
      {
        path: 'radiology/categories',
        component: RadiologyCategoriesComponent
      },
      {
        path: 'radiology/item-rates',
        component: RadiologyItemRatesComponent
      },
      //laboratory
      {
        path: 'laboratory/tests',
        component: LaboratoryTestsComponent
      },
      {
        path: 'laboratory/test-rates',
        component: LaboratoryTestRatesComponent
      },
      {
        path: 'laboratory/test-references',
        component: LaboratoryTestReferencesComponent
      },
      //services

      {
        path: 'services/service-categories',
        component: ServiceCategoriesComponent
      },
      {
        path: 'services/services',
        component: ServicesComponent
      },
      {
        path:'services/service-rates',
        component: ServiceRatesComponent
      },
      //patients
      {
        path: 'patients/registration',
        component: PatientRegistrationComponent
      },
      {
        path: 'patients/registration/edit/:id',
        component: PatientRegistrationComponent
      },
      {
        path: 'patients/list',
        component: PatientsListComponent
      },
      //visits
      {
        path:'visits/op/create',
        component:CreateOpVisitComponent
      },
      {
        path:'visits/op/create/:patient_id',
        component:CreateOpVisitComponent
      },
      {
        path:'visits/op/edit/:id',
        component:CreateOpVisitComponent
      },
      {
        path:'visits/ip/create',
        component:CreateIpVisitComponent
      },
      {
        path:'visits/ip/create/:patient_id',
        component:CreateIpVisitComponent
      },
      {
        path:'visits/ip/create/edit/:id',
        component:CreateIpVisitComponent
      },
      {
        path:'visits/op/list',
        component:VisitOpListComponent
      },
      {
        path:'visits/ip/list',
        component:VisitIpListComponent
      },
      //bills
      {
        path: 'bills/list',
        component: BillsComponent
      },
      {
        path: 'bills/list/view/:id',
        component: BillViewComponent
      },
      //triage
      {
        path:'triage/categories',
        component: TriageCategoriesComponent
      },
      {
        path:'triage/items',
        component: TriageItemsComponent
      },
      {
        path:'triage/items/view/:id',
        component: TriageItemComponent
      },
      {
        path: 'triage/list',
        component: TriageListComponent
      },
      {
        path: 'triage/view/:id',
        component: TriageComponent
      },
      //consultation
      {
        path: 'consultation/list',
        component: ConsultationListComponent
      },
      {
        path: 'consultation/view/:id',
        component: ConsultationFormComponent
      },
      //settings
      {
        path: 'settings/doctors',
        component: DoctorsComponent
      },
      {
        path: 'settings/next-of-kin-relations',
        component: NextOfKinRelationsComponent
      },
      {
        path: 'settings/payment-modes',
        component: PaymentModesComponent
      },
      {
        path: 'settings/statuses',
        component: StatusesComponent
      },
      {
        path: 'settings/systems',
        component: SystemsComponent
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
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
