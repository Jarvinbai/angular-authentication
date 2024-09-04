import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient) { }

  isAuthenticated():boolean{
    if (sessionStorage.getItem('token')!==null) {
      return true;
    }
    return false;
  }

  canAccess(){
    if(!this.isAuthenticated()){
      // redirect to login
      this.router.navigate(['/login']);
    }
  }

  canAuthenticate(){
    if (this.isAuthenticated()) {
      //redirect to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  register(name:string,email:string,password:string,c_password:string){
    // send data to register api
    return this.http.post<{token:string}>('http://localhost:8000/api/register',
    {
      name:name,
      email:email,
      password:password,
      c_password:c_password
    }
    );
  }

  storeToken(token:string){
    sessionStorage.setItem('token',token);
  }

  login(email:string,password:string){
    //send data to login api
      return this.http
      .post<{token:string}>(
          'http://localhost:8000/api/login',
            {email:email,password:password}
      );
  }

  detail(){
    let token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<{ user: { email: string; name: string } }>(
        'http://localhost:8000/api/detail', { headers }
    );
  }

  // detail(){
  //   let token = sessionStorage.getItem('token');

  //   return this.http.post<{users:Array<{email:string,name:string}>}>(
  //       'http://localhost:8000/api/detail',
  //       {idToken:token}
  //   );
  // }

  removeToken(){
    sessionStorage.removeItem('token');
  }
}
