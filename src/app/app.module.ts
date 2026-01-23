import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {CommonModule, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {authReducer} from './store/auth/reducer';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';
import {NgxGoogleAnalyticsModule} from 'ngx-google-analytics';
import {environment} from 'environments/environment';
import {ActivityTabComponent} from './pages/profile/activity-tab/activity-tab.component';
import {TimelineTabComponent} from './pages/profile/timeline-tab/timeline-tab.component';
import {SettingsTabComponent} from './pages/profile/settings-tab/settings-tab.component';
import {PostComponent} from './pages/profile/post/post.component';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {SmallBoxComponent} from './components/small-box/small-box.component';
import {ContentHeaderComponent} from './components/content-header/content-header.component';
import {LoadingComponent} from './components/loading/loading.component';
import {OverlayLoadingComponent} from './components/overlay-loading/overlay-loading.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { FrontendComponent } from './pages/frontend/frontend.component';
import { IndexComponent } from './pages/frontend/index/index.component';
import { API_BASE_URL } from './tokens/api-base-url.token';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { HospitalDataComponent } from './pages/dashboard/masters/hospital-data/hospital-data.component';
import { LocationsComponent } from './pages/dashboard/masters/locations/locations.component';
import { MainTypesComponent } from './pages/dashboard/masters/main-types/main-types.component';
import { SalutationsComponent } from './pages/dashboard/masters/salutations/salutations.component';
import { DepartmentsComponent } from './pages/dashboard/masters/departments/departments.component';
import { BloodGroupsComponent } from './pages/dashboard/masters/blood-groups/blood-groups.component';
import { GenericNamesComponent } from './pages/dashboard/masters/generic-names/generic-names.component';
import { IcdsComponent } from './pages/dashboard/masters/icds/icds.component';
import { SubTypesComponent } from './pages/dashboard/masters/sub-types/sub-types.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DoctorsComponent } from './pages/dashboard/settings/doctors/doctors.component';
import { UsersComponent } from './pages/dashboard/users/users/users.component';
import { ConsultationTypesComponent } from './pages/dashboard/masters/consultation-types/consultation-types.component';
import { MainAccountsComponent } from './pages/dashboard/masters/main-accounts/main-accounts.component';
import { SubAccountsComponent } from './pages/dashboard/masters/sub-accounts/sub-accounts.component';
import { AccountsComponent } from './pages/dashboard/masters/accounts/accounts.component';
import { PlansComponent } from './pages/dashboard/masters/plans/plans.component';
import { InventoryCategoriesComponent } from './pages/dashboard/inventory/inventory-categories/inventory-categories.component';
import { PackSizesComponent } from './pages/dashboard/inventory/pack-sizes/pack-sizes.component';
import { PurchaseTypesComponent } from './pages/dashboard/inventory/purchase-types/purchase-types.component';
import { ProductTypesComponent } from './pages/dashboard/inventory/product-types/product-types.component';
import { DrugInstructionsComponent } from './pages/dashboard/inventory/drug-instructions/drug-instructions.component';
import { DoseMeasuresComponent } from './pages/dashboard/inventory/dose-measures/dose-measures.component';
import { ProductsComponent } from './pages/dashboard/inventory/products/products.component';
import { ConsultationRoomsComponent } from './pages/dashboard/masters/consultation-rooms/consultation-rooms.component';
import { ServiceCategoriesComponent } from './pages/dashboard/services/service-categories/service-categories.component';
import { StoresComponent } from './pages/dashboard/masters/stores/stores.component';
import { LaboratoryCategoriesComponent } from './pages/dashboard/masters/laboratory-categories/laboratory-categories.component';
import { RadiologyCategoriesComponent } from './pages/dashboard/radiology/radiology-categories/radiology-categories.component';
import { RadiologyItemsComponent } from './pages/dashboard/radiology/radiology-items/radiology-items.component';
import { LaboratoryTestsComponent } from './pages/dashboard/laboratory/laboratory-tests/laboratory-tests.component';
import { ProductRatesComponent } from './pages/dashboard/inventory/product-rates/product-rates.component';
import { LaboratoryTestRatesComponent } from './pages/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.component';
import { LaboratoryTestReferencesComponent } from './pages/dashboard/laboratory/laboratory-test-references/laboratory-test-references.component';
import { RadiologyItemRatesComponent } from './pages/dashboard/radiology/radiology-item-rates/radiology-item-rates.component';
import { ServicesComponent } from './pages/dashboard/services/services/services.component';
import { ServiceRatesComponent } from '@pages/dashboard/services/service-rates/service-rates.component';
import { WardsComponent } from './pages/dashboard/ip-masters/wards/wards.component';
import { BedsComponent } from './pages/dashboard/ip-masters/beds/beds.component';
import { BedChargesComponent } from './pages/dashboard/ip-masters/bed-charges/bed-charges.component';
import { BedChargeSettingsComponent } from './pages/dashboard/ip-masters/bed-charge-settings/bed-charge-settings.component';
import { PatientRegistrationComponent } from './pages/dashboard/patients/patient-registration/patient-registration.component';
import { NextOfKinRelationsComponent } from './pages/dashboard/settings/next-of-kin-relations/next-of-kin-relations.component';
import { WebcamModule } from 'ngx-webcam';
import { TakePhotoComponent } from './components/take-photo/take-photo.component';
import { PatientsListComponent } from './pages/dashboard/patients/patients-list/patients-list.component';
import { CreateOpVisitComponent } from './pages/dashboard/visit-management/create-op-visit/create-op-visit.component';
import { CreateIpVisitComponent } from './pages/dashboard/visit-management/create-ip-visit/create-ip-visit.component';
import { VisitOpListComponent } from './pages/dashboard/visit-management/visit-op-list/visit-op-list.component';
import { VisitIpListComponent } from './pages/dashboard/visit-management/visit-ip-list/visit-ip-list.component';
import { PaymentModesComponent } from './pages/dashboard/settings/payment-modes/payment-modes.component';
import { TriageCategoriesComponent } from './pages/dashboard/triage/triage-categories/triage-categories.component';
import { TriageItemsComponent } from './pages/dashboard/triage/triage-items/triage-items.component';
import { BillsComponent } from './pages/dashboard/bills/bills/bills.component';
import { BillViewComponent } from './pages/dashboard/bills/bill-view/bill-view.component';
import { ColorPickerDirective } from 'ngx-color-picker';
import { TriageItemComponent } from './pages/dashboard/triage/triage-item/triage-item.component';
import { TriageListComponent } from './pages/dashboard/triage/triage-list/triage-list.component';
import { TriageComponent } from './pages/dashboard/triage/triage/triage.component';
import { ConsultationListComponent } from './pages/dashboard/consultation/consultation-list/consultation-list.component';
import { StatusesComponent } from './pages/dashboard/settings/statuses/statuses.component';
import { ConsultationFormComponent } from './pages/dashboard/consultation/consultation-form/consultation-form.component';
import { SystemsComponent } from './pages/dashboard/settings/systems/systems.component';
import { MedicalHistoriesComponent } from './pages/dashboard/settings/medical-histories/medical-histories.component';
import { SurgerySettingsComponent } from './pages/dashboard/settings/surgery-settings/surgery-settings.component';
import { SocialHistoriesComponent } from './pages/dashboard/settings/social-histories/social-histories.component';
import { SickLeaveTypesComponent } from './pages/dashboard/settings/sick-leave-types/sick-leave-types.component';
import { StrengthUnitsComponent } from './pages/dashboard/inventory/strength-units/strength-units.component';
import { ProductStocksComponent } from './pages/dashboard/stocks/product-stocks/product-stocks.component';
import { DrugFrequenciesComponent } from './pages/dashboard/inventory/drug-frequencies/drug-frequencies.component';
import { PrescriptionsFormComponent } from './pages/dashboard/shared/prescriptions-form/prescriptions-form.component';
import { AllergiesFormComponent } from './pages/dashboard/shared/allergies-form/allergies-form.component';
import { ConsultationNotesFormComponent } from './pages/dashboard/shared/consultation-notes-form/consultation-notes-form.component';
import { ReviewOfSystemsFormComponent } from './pages/dashboard/shared/review-of-systems-form/review-of-systems-form.component';
import { MedicalHistoryFormComponent } from './pages/dashboard/shared/medical-history-form/medical-history-form.component';
import { SurgeryHistoryFormComponent } from './pages/dashboard/shared/surgery-history-form/surgery-history-form.component';
import { SocialHistoryFormComponent } from './pages/dashboard/shared/social-history-form/social-history-form.component';
import { FamilyMedicalHistoryFormComponent } from './pages/dashboard/shared/family-medical-history-form/family-medical-history-form.component';
import { DiagnosisFormComponent } from './pages/dashboard/shared/diagnosis-form/diagnosis-form.component';
import { LaboratoryTestFormComponent } from './pages/dashboard/shared/laboratory-test-form/laboratory-test-form.component';
import { RadiologyTestFormComponent } from './pages/dashboard/shared/radiology-test-form/radiology-test-form.component';
import { ServicesFormComponent } from './pages/dashboard/shared/services-form/services-form.component';
import { SickLeaveFormComponent } from './pages/dashboard/shared/sick-leave-form/sick-leave-form.component';
import { SelfRequestComponent } from './pages/dashboard/self-requests/self-request/self-request.component';
import { RolesComponent } from './pages/dashboard/users/roles/roles.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxsmkTelInputComponent} from 'ngxsmk-tel-input';
import { RoleComponent } from './pages/dashboard/users/role/role.component';
import { OrganizationsComponent } from './pages/dashboard/organizations/organizations/organizations.component';
import { OrganizationComponent } from './pages/dashboard/organizations/organization/organization.component';
import { BranchesComponent } from './pages/dashboard/organizations/branches/branches.component';
import { BranchComponent } from './pages/dashboard/organizations/branch/branch.component';

registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,
        ActivityTabComponent,
        TimelineTabComponent,
        SettingsTabComponent,
        PostComponent,
        InfoBoxComponent,
        SmallBoxComponent,
        ContentHeaderComponent,
        LoadingComponent,
        OverlayLoadingComponent,
        FrontendComponent,
        IndexComponent,
        HospitalDataComponent,
        LocationsComponent,
        MainTypesComponent,
        SalutationsComponent,
        DepartmentsComponent,
        BloodGroupsComponent,
        GenericNamesComponent,
        IcdsComponent,
        SubTypesComponent,
        DoctorsComponent,
        UsersComponent,
        ConsultationTypesComponent,
        MainAccountsComponent,
        SubAccountsComponent,
        AccountsComponent,
        PlansComponent,
        InventoryCategoriesComponent,
        PackSizesComponent,
        PurchaseTypesComponent,
        ProductTypesComponent,
        DrugInstructionsComponent,
        DoseMeasuresComponent,
        ProductsComponent,
        ConsultationRoomsComponent,
        ServiceCategoriesComponent,
        ServicesComponent,
        StoresComponent,
        LaboratoryCategoriesComponent,
        RadiologyCategoriesComponent,
        RadiologyItemsComponent,
        LaboratoryTestsComponent,
        ProductRatesComponent,
        LaboratoryTestRatesComponent,
        LaboratoryTestReferencesComponent,
        RadiologyItemRatesComponent,
        ServiceRatesComponent,
        WardsComponent,
        BedsComponent,
        BedChargesComponent,
        BedChargeSettingsComponent,
        PatientRegistrationComponent,
        NextOfKinRelationsComponent,
        TakePhotoComponent,
        PatientsListComponent,
        CreateOpVisitComponent,
        CreateIpVisitComponent,
        VisitOpListComponent,
        VisitIpListComponent,
        PaymentModesComponent,
        TriageCategoriesComponent,
        TriageItemsComponent,
        BillsComponent,
        BillViewComponent,
        TriageItemComponent,
        TriageListComponent,
        TriageComponent,
        ConsultationListComponent,
        StatusesComponent,
        ConsultationFormComponent,
        SystemsComponent,
        MedicalHistoriesComponent,
        SurgerySettingsComponent,
        SocialHistoriesComponent,
        SickLeaveTypesComponent,
        StrengthUnitsComponent,
        ProductStocksComponent,
        DrugFrequenciesComponent,
        PrescriptionsFormComponent,
        AllergiesFormComponent,
        ConsultationNotesFormComponent,
        ReviewOfSystemsFormComponent,
        MedicalHistoryFormComponent,
        SurgeryHistoryFormComponent,
        SocialHistoryFormComponent,
        FamilyMedicalHistoryFormComponent,
        DiagnosisFormComponent,
        LaboratoryTestFormComponent,
        RadiologyTestFormComponent,
        ServicesFormComponent,
        SickLeaveFormComponent,
        SelfRequestComponent,
        RolesComponent,
        RoleComponent,
        OrganizationsComponent,
        OrganizationComponent,
        BranchesComponent,
        BranchComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        ProfabricComponentsModule,
        CommonModule,
        BrowserModule,
        StoreModule.forRoot({auth: authReducer, ui: uiReducer}),
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        NgxGoogleAnalyticsModule.forRoot(environment.GA_ID),
        FontAwesomeModule,
        NgbModule,
        NgSelectComponent,
        WebcamModule,
        ColorPickerDirective,
        NgbAccordionModule,
        NgxIntlTelInputModule,
        NgxsmkTelInputComponent,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi()),provideHttpClient(withInterceptors([tokenInterceptor])), {provide:API_BASE_URL, useValue: environment.apiBaseUrl}]
})
export class AppModule {}
