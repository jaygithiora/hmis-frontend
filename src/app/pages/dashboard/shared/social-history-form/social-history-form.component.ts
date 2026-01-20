import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialHistoriesService } from '@services/dashboard/settings/social-histories/social-histories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-social-history-form',
  templateUrl: './social-history-form.component.html',
  styleUrl: './social-history-form.component.scss'
})
export class SocialHistoryFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Input() patientSocialHistories: any[] = [];

  loadingSocialHistories: boolean = false;

  social_histories: any[] = [];

  searchSocialHistories$ = new Subject<string>();

  selectedSocialHistoryOption: any;

  socialHistoryGroup: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private socialHistorySettingsService: SocialHistoriesService) {
    this.setupSearch();
  }

  setupSearch() {
    this.searchSocialHistories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSocialHistories = true),  // Show the loading spinner
        switchMap(term => this.socialHistorySettingsService.getSocialHistories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.social_histories = results.social_histories.data;
        this.loadingSocialHistories = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newSocialHistory(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      social_history: [null, [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addSocialHistory() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all social history details before adding a new one.");
      return;
    }
    this.formArray.push(this.newSocialHistory());
  }

  removeSocialHistory(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  socialHistoryChange($event: any, i: number) {
    console.log("social history id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.social_history === $event.id
    );
    if (exists) {
      this.toastr.error("Social history already added!");
      this.formArray.at(i).reset();
      return;
    }
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }
      ngOnChanges(changes: SimpleChanges): void {
    
        if (
          changes['patientSocialHistories'] &&
          this.patientSocialHistories?.length &&
          this.formArray
        ) {
          this.patientSocialHistories.forEach(socialHistory => {
            this.social_histories.push(socialHistory.social_history); // Preload existing systems into options
            this.selectedSocialHistoryOption = socialHistory.social_history_id;
            const socialHistoryGroup = this.fb.group({
              id: [socialHistory.id || '', []],
              social_history: [socialHistory.social_history_id|| null, Validators.required],
            });
            this.formArray.push(socialHistoryGroup);
          });
        }
        //this.isLoading = false;
      }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}