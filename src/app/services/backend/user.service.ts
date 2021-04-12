import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  async getRoles() {
    const url = `${this.url}/role/all`;
    const request = this.http.get(url);
    const response = await this.loadingService.get(request);
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
    // tslint:disable-next-line:max-line-length
    // return { 'data': { 'profile': { 'sub': 'a443014c-fb1d-4d58-8ad1-fe11d53827ae', 'aud': '7lqbufvp1ls5dcuaohlv9gfonv', 'email_verified': true, 'event_id': '584f0791-b4fd-43be-83d0-32f73f16de83', 'token_use': 'id', 'auth_time': 1618207131, 'iss': 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_SAfTFB4Rd', 'cognito:username': 'a443014c-fb1d-4d58-8ad1-fe11d53827ae', 'exp': 1618210731, 'iat': 1618207131, 'email': 'SIVAPRAKASHRAVI@GMAIL.COM' }, 'accessToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhNDQzMDE0Yy1mYjFkLTRkNTgtOGFkMS1mZTExZDUzODI3YWUiLCJldmVudF9pZCI6IjU4NGYwNzkxLWI0ZmQtNDNiZS04M2QwLTMyZjczZjE2ZGU4MyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MTgyMDcxMzEsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tL2FwLXNvdXRoLTFfU0FmVEZCNFJkIiwiZXhwIjoxNjE4MjExMzM3LCJpYXQiOjE2MTgyMDcxMzEsImp0aSI6IjE3MDUyYzM1LTJiNDMtNDE4OC05NDAxLWYwMDMwZDdkYjViZSIsImNsaWVudF9pZCI6IjdscWJ1ZnZwMWxzNWRjdWFvaGx2OWdmb252IiwidXNlcm5hbWUiOiJhNDQzMDE0Yy1mYjFkLTRkNTgtOGFkMS1mZTExZDUzODI3YWUifQ.SrGLQpY9ffnONT5AfMi8XMjV6ieg54yauw4rhWomMGM', 'refreshToken': 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.JY3zn5YnB3gfCL-jlCLySfkPg8EY-MkXCCWL98FjYZ1CpOAkdkX_mC7Ak3BH-rpJVk-j84uWkelL9MomcXfMbcb8AES3WIfyPHh-No7VMjIkDDBQGR-ti1l8ZivRkHZowpb0RK4GcMThuh5wHBCQIwOp8MALvT81D-4A0-3ctcxUiEmBrmbV0-kijsWMdeE8QIesfbrEudjrqQDc_QhzoFdxXfSoH1zym4n2M6wXYQxz0CK4Pft7ayO5aOzduvLngZt1jf_jpGrVeCkUyc18lz9WVA3vEbz5viRfxGobPRapa-BuqcbunoCG3gVoXrvwTn-0-8B1K0kn1Peblchjiw.1Tf2nZ0pLhNXtrH1.MZMPD2Dv_wVxtUDOK6nbuL9Hz7JMkXsP1eJZkFN6wF5NJpBOq3QyUSM0GRncRZ-sIgB2IVHbH-uSDYCuAanF0UsrqrCyl27rJ4lXbiQr310YWljFzdYznObQJ5u6cHLe4Uit7UtwO0iRaOaBQqX_nZ4fmu1LD6F5hfVozYCsjZpVIT8OXvc49D6GL4HacR86klAeZ8NKnjOFRFN8s4h4hERWGO9D4rM-VwN69JpfU_3_Sr_9sruOyQLU6qzr469elFkzSABOeO0zBLe0eLVbXZjryPgyLTMdl9zBc9WcoM4rv4mkJWkRtztJyvW5ED8saAKqAAz8MN3e_W56e3b_v-yvPOrGq7Ir-c1RE4aKomLzqbSO-2H-S84yzTjB3kpBsR4_FKYwNaEbJNJKbxcwl9uxPMCNTsJWmrMR-sxq3B7rUW2nvaY2OzZ8VdgvIvE5zUV0WH1GlgrDMvmkKineKSOVTVtPRofMnxcWkWAPj_k6bfg3xuFYZFXPrKodZaq0O1Rr8xa7tw3lnB0PMNSJqUHQh1QaiVjIbtV-UufYEU0xrDD2Mr-ABN5eHNdOjO95_t_SrknwqD9Ao6y2fWPSAS0JTN0Ryy4pW3pErH8NAIPZoWnmTAvVyZe0114ihITDfjfeUZQ52kmqUdy73kz3TZ8z-_wB2k2YWHYneAFRb1SkabUPXVRKx0kSx_63cpggnw9WB3jNUQhkMHngIty2WpVExHJFfFSHCYQqCIPYnWGxIv0jI4t_x3MK6W3E6fguHT9t54_sctx0fVAE5YQQLPMEAbVqpJbL3s8JyRu98xLWojBOcYMu7_XON9YIDxQ-W8ZzVZ5s3l2D85Odn7mLRDnE3uYEEYtK2TYHBMxzqJ-DHuaLdDcgyeFASwET2qlEJpyjT9w5Ybf2P9p8AjVvYl90n3oQF9_x9o5fc8TnDd8aKEEIOtHSKnuVMl-FnJxl54ULCovPpq932uXv-3eL3Y4vvGBKgJeufPfBKa2a_jg8n-5w5Ft2CEECd5cdJdqSR-UfLwsW_xz3bQiI2GpybH6s0qsjjzoWog8frE3nNZpEGvczuRl5jFeGukPf7pUNPPI2FJl4yzdMEYxmd1_S8FymUlsh6zthlOIOEVOL0LcKVrxuqbIXHzGIRr6jf_26DVapvmN50wksi5BXTPTegy-hmeqCo7hoOd7SJiSGt-uEuOAakcTlC9mKHponDRrlnNUb6Vui9b6r0msbmUVHvf2VDGWgTrzAjGK5YWAsilJkJnH8brGe7IDPYfq1DPPFW9j_ywfe8ls3Sc45rkCohojaQh992Mi1ZMpFNxFDhK5XXRNvi_t2Dl7zE3c-2g.bJydo_mt76GUP6U1CUKX0w' }, 'code': 200, 'timestamp': '2021-04-12T05:58:51.149Z', 'status': 'success' };
    const url = `${this.url}/login`;
    const request = this.http.post(url, data);
    const response = await this.loadingService.get(request, true);
    return response;
  }

  async getUser(email) {
    if (email) {
      const url = `${this.url}/login/${email}`;
      // const url = 'http://localhost:8083/login';
      const request = this.http.get(url);
      const { data } = await this.loadingService.get(request, true);
      return data;
    }
  }

  async getRole(roleId) {
    const url = `${this.url}/role/all`;
    let params = new HttpParams();
    params = params.set('roleId', roleId);
    const request = this.http.get(url, { params });
    const { data } = await this.loadingService.get(request, true);
    return data;
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
