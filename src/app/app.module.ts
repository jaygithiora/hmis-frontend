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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { UsersComponent } from './pages/dashboard/users/users.component';
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
        VisitIpListComponent
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
        WebcamModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi()),provideHttpClient(withInterceptors([tokenInterceptor])), {provide:API_BASE_URL, useValue: environment.apiBaseUrl}]
})
export class AppModule {}
