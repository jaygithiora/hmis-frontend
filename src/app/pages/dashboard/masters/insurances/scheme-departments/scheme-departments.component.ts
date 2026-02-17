import {HttpParams} from '@angular/common/http';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '@services/auth/auth.service';
import {DepartmentsService} from '@services/dashboard/masters/departments/departments.service';
import {SchemeDepartmentsService} from '@services/dashboard/masters/insurances/scheme-departments/scheme-departments.service';
import {SchemesService} from '@services/dashboard/masters/insurances/schemes/schemes.service';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {
    Subject,
    debounceTime,
    distinctUntilChanged,
    tap,
    switchMap
} from 'rxjs';

@Component({
    selector: 'app-scheme-departments',
    templateUrl: './scheme-departments.component.html',
    styleUrl: './scheme-departments.component.scss'
})
export class SchemeDepartmentsComponent implements OnInit {
    private modalRef: NgbModalRef;
    public isLoading: boolean = true;
    loading: boolean = false;
    loadingDepartments: boolean = false;

    schemeDepartmentForm!: FormGroup;

    schemes: any[] = []; // Store fetched items
    departments: any[] = []; // Store fetched items

    selectedOption: any;
    selectedDepartment: any;

    search$ = new Subject<string>();
    searchDepartment$ = new Subject<string>();

    scheme_departments: any[] = []; // Store fetched items
    totalItems = 0; // Total number of items
    currentPage = 1; // Current page number
    fromItems = 0; //from items
    toItems = 0; //to items
    perPage = 10; // Items per page

    constructor(
        private departmentsService: DepartmentsService,
        private schemesService: SchemesService,
        private schemeDepartmentsService: SchemeDepartmentsService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private service: AuthService
    ) {
        this.schemeDepartmentForm = this.fb.group({
            id: ['0', [Validators.required]],
            department: [null, [Validators.required]],
            scheme: [null, [Validators.required]]
        });
        this.setupSearch();
    }

    setupSearch() {
        this.search$
            .pipe(
                debounceTime(300), // Wait for the user to stop typing for 300ms
                distinctUntilChanged(), // Only search if the query has changed
                tap(() => (this.loading = true)), // Show the loading spinner
                switchMap((term) => this.schemesService.getSchemes(1, term)) // Switch to a new observable for each search term
            )
            .subscribe((results) => {
                this.schemes = results.schemes.data;
                this.loading = false; // Hide the loading spinner when the API call finishes
            });
        this.searchDepartment$
            .pipe(
                debounceTime(300), // Wait for the user to stop typing for 300ms
                distinctUntilChanged(), // Only search if the query has changed
                tap(() => (this.loadingDepartments = true)), // Show the loading spinner
                switchMap((term) => {
                    let params = new HttpParams(); /*.set('page', '1')*/

                    if (term) {
                        params = params.set('search', term);
                    }
                    return this.departmentsService.getDepartments(1, params);
                }) // Switch to a new observable for each search term
            )
            .subscribe((results) => {
                this.departments = results.departments.data;
                this.loadingDepartments = false; // Hide the loading spinner when the API call finishes
            });
    }
    // Handle item selection
    onItemSelect(event: any) {
        console.log('Selected item:', event);
    }
    ngOnInit() {
        this.loadPage(1);
    }

    loadPage(page: number) {
        this.isLoading = true;
        this.schemeDepartmentsService.getSchemeDepartments(page).subscribe(
            (result: any) => {
                this.isLoading = false;
                this.scheme_departments = result.scheme_departments.data; // Set the items
                this.totalItems = result.scheme_departments.total; // Total number of items
                this.perPage = result.scheme_departments.per_page; // Items per page
                this.currentPage = result.scheme_departments.current_page; // Set the current page
                this.toItems = result.scheme_departments.to; // Set to Items
                this.fromItems = result.scheme_departments.from; // Set from Items
            },
            (error) => {
                this.isLoading = false;
                console.log(error);
            }
        );
    }

    openModal(content: TemplateRef<any>, scheme_department: any) {
        this.modalRef = this.modalService.open(content, {centered: true});
        if (scheme_department != null) {
            this.schemes = [];
            this.departments = [];
            this.schemeDepartmentForm.get('id').setValue(scheme_department.id);
            if (scheme_department.scheme) {
                this.schemes.push(scheme_department.scheme);
            }
            this.selectedOption = scheme_department.scheme_id;
            if (scheme_department.department) {
                this.schemes.push(scheme_department.department);
            }
            this.selectedDepartment = scheme_department.department_id;
        } else {
            this.schemeDepartmentForm.get('id').setValue(0);
            this.selectedOption = null;
            this.selectedDepartment = null;
        }
    }

    addSchemeDepartment() {
        if (this.schemeDepartmentForm.valid) {
            this.isLoading = true;
            this.schemeDepartmentsService
                .updateSchemeDepartment(this.schemeDepartmentForm.getRawValue())
                .subscribe(
                    (result: any) => {
                        this.isLoading = false;
                        if (result.success) {
                            this.toastr.success(result.success);
                            this.loadPage(1);
                            this.modalRef?.close();
                        }
                    },
                    (error) => {
                        if (error?.error?.errors?.id) {
                            this.toastr.error(error?.error?.errors?.id);
                        }
                        if (error?.error?.errors?.department) {
                            this.toastr.error(error?.error?.errors?.department);
                        }
                        if (error?.error?.errors?.scheme) {
                            this.toastr.error(error?.error?.errors?.scheme);
                        }
                        if (error?.error?.error) {
                            this.toastr.error(error?.error?.error);
                        }
                        if (error?.error?.message) {
                            this.toastr.error(error?.error?.message);
                            this.service.logout();
                            this.modalRef?.close();
                        }
                        this.isLoading = false;
                        console.log(error);
                    }
                );
        } else {
            this.schemeDepartmentForm.markAllAsTouched();
            this.toastr.error(
                'Please fill in all the required fields before proceeding!'
            );
        }
    }

    formatDate(date: string) {
        return moment.utc(date).local().format('D MMMM, YYYY h:mma');
    }
}
