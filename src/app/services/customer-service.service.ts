import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer} from '../common/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private customerUrl = 'http://localhost:8080/api/customers';

  constructor( private httpClient: HttpClient) { }

  getCustomerHistory(): Observable<GetResponseCustomer> {
    // need to build URL based on the customer email
    const customerHistoryUrl = `${this.customerUrl}`;
    return this.httpClient.get<GetResponseCustomer>(customerHistoryUrl);
  }
}

interface GetResponseCustomer {
  page: {
    size: number;
    totalElements: number;
  }
  _embedded: {
    customers: Customer[];
  }
}
