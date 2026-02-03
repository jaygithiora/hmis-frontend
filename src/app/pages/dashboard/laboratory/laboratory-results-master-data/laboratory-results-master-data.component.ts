import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryPublishResultsService } from '@services/dashboard/laboratory/laboratory-publish-results/laboratory-publish-results.service';
import { LaboratoryResultsMasterDataService } from '@services/dashboard/laboratory/laboratory-results-master-data/laboratory-results-master-data.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-results-master-data',
  templateUrl: './laboratory-results-master-data.component.html',
  styleUrl: './laboratory-results-master-data.component.scss'
})
export class LaboratoryResultsMasterDataComponent implements OnInit {
  public isLoading: boolean = true;
  loading: boolean = false;

  laboratory_test_results: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor( private laboratoryResultsMasterDataService: LaboratoryResultsMasterDataService,private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratoryResultsMasterDataService.getLaboratoryResultsMasterData(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.laboratory_test_results = result.results.data;// Set the items
      this.totalItems = result.results.total; // Total number of items
      this.perPage = result.results.per_page; // Items per page
      this.currentPage = result.results.current_page; // Set the current page
      this.toItems = result.results.to; // Set to Items
      this.fromItems = result.results.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  addLocation() {
  }
  // Download PDF
  downloadPdf(result: any) {
    this.laboratoryResultsMasterDataService.downloadPdf(parseInt(result?.id)).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result?.bill?.outpatient_visit?.patient?.first_name}_${result?.bill?.outpatient_visit?.patient?.other_names}-${result?.sample_collection?.code}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.toastr.success('PDF downloaded successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to download PDF', 'Error');
        console.error('Error downloading PDF:', error);
      }
    });
  }

  // Download PDF
  downloadAllPdf(result: any) {
    this.laboratoryResultsMasterDataService.downloadAllPdf(result?.bill_id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bill-${result.bill_id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.toastr.success('PDF downloaded successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to download PDF', 'Error');
        console.error('Error downloading PDF:', error);
      }
    });
  }
// Open PDF in new tab
  openPdfInNewTab(result: any) {
    this.laboratoryResultsMasterDataService.streamPdf(result?.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // Clean up after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (error) => {
        this.toastr.error('Failed to open PDF', 'Error');
        console.error('Error opening PDF:', error);
      }
    });
  }
  
// Open PDF in new tab
  openAllPdfInNewTab(result: any) {
    this.laboratoryResultsMasterDataService.streamAllPdf(result?.bill_id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // Clean up after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      },
      error: (error) => {
        this.toastr.error('Failed to open PDF', 'Error');
        console.error('Error opening PDF:', error);
      }
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

