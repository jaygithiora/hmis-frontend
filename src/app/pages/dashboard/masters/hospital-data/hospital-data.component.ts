import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { HospitalDataService } from '@services/dashboard/masters/hospital-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hospital-data',
  templateUrl: './hospital-data.component.html',
  styleUrl: './hospital-data.component.scss'
})
export class HospitalDataComponent implements OnInit{
  public isLoading:boolean = false;
  hospital_data : any;
  hospitalDataForm!:FormGroup;
  constructor(private hospitalDataService: HospitalDataService, private toastr:ToastrService, private service:AuthService, private fb:FormBuilder){
    this.hospitalDataForm = this.fb.group({
      id:['0', [Validators.required]],
      hospital_name: ['', [Validators.required]],
      location:['', [Validators.required]],
      phone:['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email:['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });
  }
  ngOnInit(){
    this.isLoading = true;
    this.hospitalDataService.getHospitalData().subscribe((result:any)=>{
      this.hospital_data = result?.hospital_data;
      if(this.hospital_data != null){
        this.hospitalDataForm.get("id").setValue(this.hospital_data.id);
        this.hospitalDataForm.get("hospital_name").setValue(this.hospital_data.name);
        this.hospitalDataForm.get("location").setValue(this.hospital_data.location);
        this.hospitalDataForm.get("phone").setValue(this.hospital_data.phone);
        this.hospitalDataForm.get("email").setValue(this.hospital_data.email);
        this.hospitalDataForm.get("address").setValue(this.hospital_data.address);
      }
      this.isLoading = false;
    }, error=>{
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      this.isLoading = false;
      console.log(error);
    });
  }

  updateHospitalData(){
    if(this.hospitalDataForm.valid){
      this.isLoading = true;
    this.hospitalDataService.updateHospitalData(this.hospitalDataForm.getRawValue()).subscribe((result:any)=>{
      if(result.success){
        this.toastr.success(result.success);
      }
      this.isLoading = false;
    }, error=>{
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      this.isLoading = false;
      console.log(error);
    });
    }else{
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
}
