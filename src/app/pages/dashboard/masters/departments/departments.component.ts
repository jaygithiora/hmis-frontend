import {HttpParams} from '@angular/common/http';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '@services/auth/auth.service';
import {DepartmentsService} from '@services/dashboard/masters/departments/departments.service';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-departments',
    templateUrl: './departments.component.html',
    styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit {
    private modalRef: NgbModalRef;
    public isLoading: boolean = true;
    departmentForm!: FormGroup;

    selectedFile!: File;

    departments: any[] = []; // Store fetched items
    totalItems = 0; // Total number of items
    currentPage = 1; // Current page number
    fromItems = 0; //from items
    toItems = 0; //to items
    perPage = 10; // Items per page

    activeIds: string = 'custom-search';
    filters = {search: ''};
    params = new HttpParams();

    constructor(
        private departmentsService: DepartmentsService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private service: AuthService
    ) {
        this.departmentForm = this.fb.group({
            id: ['0', [Validators.required]],
            name: ['', [Validators.required]],
            description: [''],
            triage: [true],
            status: ['1', [Validators.required]]
        });
    }
    ngOnInit() {
        this.loadPage(1);
    }

    onSearch() {
        this.loadPage(1);
    }
    loadPage(page: number) {
        this.isLoading = true;
        let params = this.params.set('search', this.filters.search);
        this.departmentsService.getDepartments(page, params).subscribe(
            (result: any) => {
                this.isLoading = false;
                this.departments = result.departments.data; // Set the items
                this.totalItems = result.departments.total; // Total number of items
                this.perPage = result.departments.per_page; // Items per page
                this.currentPage = result.departments.current_page; // Set the current page
                this.toItems = result.departments.to; // Set to Items
                this.fromItems = result.departments.from; // Set from Items
            },
            (error) => {
                this.isLoading = false;
                console.log(error);
            }
        );
    }

    openModal(content: TemplateRef<any>, department: any) {
        this.modalRef = this.modalService.open(content, {centered: true});
        if (department != null) {
            this.departmentForm.get('id').setValue(department.id);
            this.departmentForm.get('name').setValue(department.name);
            this.departmentForm
                .get('description')
                .setValue(department.description);
            this.departmentForm.get('triage').setValue(department.triage);
            this.departmentForm.get('status').setValue(department.status);
        } else {
            this.departmentForm.get('id').setValue(0);
            this.departmentForm.get('name').setValue('');
            this.departmentForm.get('description').setValue('');
            this.departmentForm.get('triage').setValue(true);
            this.departmentForm.get('status').setValue(1);
        }
    }
    openModal2(content: TemplateRef<any>) {
        this.modalRef = this.modalService.open(content, {centered: true});
    }

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }
    addDepartment() {
        if (this.departmentForm.valid) {
            this.isLoading = true;
            this.departmentsService
                .updateDepartment(this.departmentForm.getRawValue())
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
                        if (error?.error?.errors?.name) {
                            this.toastr.error(error?.error?.errors?.name);
                        }
                        if (error?.error?.errors?.description) {
                            this.toastr.error(
                                error?.error?.errors?.description
                            );
                        }
                        if (error?.error?.errors?.triage) {
                            this.toastr.error(error?.error?.errors?.triage);
                        }
                        if (error?.error?.message) {
                            this.toastr.error(error?.error?.message);
                            this.service.logout();
                            this.modalRef?.close();
                        }
                        if (error?.error?.message) {
                            this.toastr.error(error?.error?.message);
                            this.service.logout();
                        }
                        this.isLoading = false;
                        console.log(error);
                    }
                );
        } else {
            this.toastr.error(
                'Please fill in all the required fields before proceeding!'
            );
        }
    }

    upload() {
        if (this.selectedFile != null) {
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            this.isLoading = true;
            this.departmentsService.uploadDepartments(formData).subscribe(
                (result: any) => {
                    this.isLoading = false;
                    if (result.success) {
                        this.toastr.success(result.success);
                        this.loadPage(1);
                        this.modalRef?.close();
                    }
                },
                (error) => {
                    if (error?.error?.errors?.file) {
                        this.toastr.error(error?.error?.errors?.file);
                    }
                    if (error?.error?.error) {
                        this.toastr.error(error?.error?.error);
                    }
                    if (error?.error?.message) {
                        this.toastr.error(error?.error?.message);
                        this.service.logout();
                        this.modalRef?.close();
                    }
                    if (error?.error?.message) {
                        this.toastr.error(error?.error?.message);
                        this.service.logout();
                    }
                    this.isLoading = false;
                    console.log(error);
                }
            );
        } else {
            this.toastr.error('Select a file before proceeding');
        }
    }
    formatDate(date: string) {
        return moment.utc(date).local().format('D MMMM, YYYY h:mma');
    }
}
