import {IdentificationDocumentTypesService} from './../../../../services/dashboard/settings/indentification-document-types/identification-document-types.service';
import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '@services/auth/auth.service';
import {FeeTypesService} from '@services/dashboard/settings/fee-types/fee-types.service';
import moment from 'moment';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-identification-document-types',
    templateUrl: './identification-document-types.component.html',
    styleUrl: './identification-document-types.component.scss'
})
export class IdentificationDocumentTypesComponent implements OnInit {
    private modalRef: NgbModalRef;
    public isLoading: boolean = true;
    loading: boolean = false;

    identificationDocumentTypeForm!: FormGroup;

    identification_document_types: any[] = []; // Store fetched items
    totalItems = 0; // Total number of items
    currentPage = 1; // Current page number
    fromItems = 0; //from items
    toItems = 0; //to items
    perPage = 10; // Items per page

    constructor(
        private identificationDocumentTypeService: IdentificationDocumentTypesService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private service: AuthService,
        private router: Router
    ) {
        this.identificationDocumentTypeForm = this.fb.group({
            id: ['0', [Validators.required]],
            name: ['', [Validators.required]],
            description: ['']
        });
    }

    ngOnInit() {
        this.loadPage(1);
    }

    loadPage(page: number): void {
        this.isLoading = true;
        this.identificationDocumentTypeService
            .getIdentificationDocumentTypes(page)
            .subscribe(
                (result: any) => {
                    this.isLoading = false;
                    this.identification_document_types =
                        result.identification_document_types.data; // Set the items
                    this.totalItems =
                        result.identification_document_types.total; // Total number of items
                    this.perPage =
                        result.identification_document_types.per_page; // Items per page
                    this.currentPage =
                        result.identification_document_types.current_page; // Set the current page
                    this.toItems = result.identification_document_types.to; // Set to Items
                    this.fromItems = result.identification_document_types.from; // Set from Items
                },
                (error) => {
                    this.isLoading = false;
                    console.log(error);
                }
            );
    }

    openModal(content: TemplateRef<any>, identificationDocumentType: any) {
        this.modalRef = this.modalService.open(content, {centered: true});
        if (identificationDocumentType != null) {
            this.identificationDocumentTypeForm
                .get('id')
                .setValue(identificationDocumentType.id);
            this.identificationDocumentTypeForm
                .get('name')
                .setValue(identificationDocumentType.name);
            this.identificationDocumentTypeForm
                .get('description')
                .setValue(identificationDocumentType.description);
        } else {
            this.identificationDocumentTypeForm.get('id').setValue(0);
            this.identificationDocumentTypeForm.get('name').setValue('');
            this.identificationDocumentTypeForm.get('description').setValue('');
        }
    }

    addIdentificationDocumentType() {
        if (this.identificationDocumentTypeForm.valid) {
            this.isLoading = true;
            this.identificationDocumentTypeService
                .updateIdentificationDocumentType(
                    this.identificationDocumentTypeForm.getRawValue()
                )
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
            this.identificationDocumentTypeForm.markAllAsTouched();
            this.toastr.error(
                'Please fill in all the required fields before proceeding!'
            );
        }
    }
    formatDate(date: string) {
        return moment.utc(date).local().format('D MMMM, YYYY h:mma');
    }
}
