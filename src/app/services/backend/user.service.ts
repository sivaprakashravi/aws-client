import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = `${environment.URL}user`;
  constructor(private loadingService: LoadingService, private http: HttpClient) { }

  getUsers() {
    const url = `${this.url}/all`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }
  getUserById(id) {
    const url = `${this.url}/${id}`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }
  addUser(user: User) {
    const url = `${this.url}/register`;
    const request = this.http.post(url, user);
    const response = this.loadingService.get(request);
    return response;
  }

  addRole(role: any) {
    const url = `${this.url}/role/add`;
    const request = this.http.post(url, role);
    const response = this.loadingService.get(request);
    return response;
  }

  updateRole(role) {
    const url = `${this.url}/role/add`;
    const request = this.http.put(url, role);
    const response = this.loadingService.get(request);
    return response;
  }

  deleteRole(role) {
    const url = `${this.url}/role/delete/${role._id}`;
    const request = this.http.delete(url);
    const response = this.loadingService.get(request);
    return response;
  }

  getRoles() {
    const url = `${this.url}/role/all`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }

  editUser(user: User) {
    const url = `${this.url}?EMAIL_ID=${user.EMAIL_ID}`;
    const request = this.http.put(url, user);
    const response = this.loadingService.get(request);
    return response;
  }

  deleteUser(userId) {
    if (userId) {
      const url = `${this.url}?email=${userId}`;
      const request = this.http.delete(url);
      const response = this.loadingService.get(request);
      return response;
    }
  }

  async login(data) {
    const url = `${this.url}/login`;
    // const url = 'http://localhost:8083/login';
    const request = this.http.post(url, data);
    const response = await this.loadingService.get(request, true);
    return response;
  }

  async getUser(email) {
    if (email) {
      const url = `${this.url}/login/${email}`;
      // const url = 'http://localhost:8083/login';
      const request = this.http.get(url);
      const response = await this.loadingService.get(request, true);
      return response;
    }
  }

  async confirm(data) {
    const url = `${this.url}/confirm`;
    // const url = 'http://localhost:8083/login';
    const request = this.http.post(url, data);
    const response = await this.loadingService.get(request, true);
    return response;
  }

  async resendVerification(data) {
    const url = `${this.url}/newVerificationCode`;
    // const url = 'http://localhost:8083/login';
    const request = this.http.post(url, data);
    const response = await this.loadingService.get(request, true);
    return response;
  }

  extend(data) {
    const url = `${this.url}/session`;
    // const url = 'http://localhost:8083/login';
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request);
    return response;
  }

  // addToGroup(data) {
  //   const url = `${this.url}/login`;
  //   // const url = 'http://localhost:8083/login';
  //   const request = this.http.post(url, data);
  //   const response = this.loadingService.get(request);
  //   return response;

  // }

  register(data) {
    const url = `${this.url}/add`;
    // const url = 'http://localhost:8083/register';
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request, true);
    return response;
  }

  forgotPassword(data) {
    const url = `${this.url}/forgotPassword`;
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request, true);
    return response;
  }

  updatePassword(data) {
    const url = `${this.url}/updatePassword`;
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request, true);
    return response;
  }

  changePassword(data) {
    const url = `${this.url}/changePassword`;
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request, true);
    return response;
  }
}
