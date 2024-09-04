import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,RouterModule,NavbarComponent,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formdata = {
    name:"",
    email:"",
    password:"",
    c_password:""
  };

  submit=false;

  errorMessage ="";

  loading = false;

  constructor(private auth:AuthService){

  }

  ngOnInit(): void {
    this.auth.canAuthenticate();
  }

  onSubmit(){
    this.loading=true;

    // call register service
    this.auth.register(
      this.formdata.name,
      this.formdata.email,
      this.formdata.password,
      this.formdata.c_password
    ).subscribe(
      {
        next:data=>{
          // store token from response data
          this.auth.storeToken(data.token);
          console.log("Register token is " + data.token);
          this.auth.canAuthenticate();
        },
        error:data=>{
          if (data.error.error.message=="INVALID_EMAIL") {
            this.errorMessage = "Invalid Email !";
          } else if (data.error.error.message=="EMAIL_EXISTS") {
            this.errorMessage = "Already Email Exists !";
          } else{
            this.errorMessage = "Unknown error occured when creating this account !";
          }
        }
      }
    ).add(()=>{
      this.loading = false;
      console.log("Register Completed");
    });

  }

}
