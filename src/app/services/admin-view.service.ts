import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {getMessagesFromResponse} from '@okta/okta-auth-js/lib/idx/util';
import {map} from 'rxjs/operators';
import {Purchase} from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class AdminViewService {

  private productUrl = 'http://localhost:8080/api/products';

  private productAdminUrl = 'http://localhost:8080/api/productAdmin/product';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  findProducts(): Observable<Product[]>  {
    return this.httpClient.get<GetResponseProducts>(this.productUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  createProduct(product: Product): Observable<any> {
    return this.httpClient.post<Product>(this.productAdminUrl, product);
  }

  updateProduct(product: Product, id: string): Observable<any> {
    return this.httpClient.put<Product>(`${this.productAdminUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.httpClient.delete<void>(`${this.productAdminUrl}/${id}`);
  }
/*
  createProducts(createDeniedReasons: DeniedReasons): Observable<DeniedReasons> {
    if (!createDeniedReasons || createDeniedReasons.activeFlag === false) {
      return throwError(new Error('Error: Illegal argument.'));
    }
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<DeniedReasons>(ServiceUrl.PartyAddressRegistration + `/denied-reasons`, JSON.stringify(createDeniedReasons), { headers: header });
  }

  updateProducts(updateDeniedReasons: DeniedReasons): Observable<DeniedReasons> {
    if (!updateDeniedReasons) {
      return throwError(new Error('Error: Illegal argument.'));
    }
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    // tslint:disable-next-line:max-line-length
    return this.httpClient.put<DeniedReasons>(ServiceUrl.PartyAddressRegistration + `/denied-reasons/${String(updateDeniedReasons.id)}`, JSON.stringify(updateDeniedReasons), { headers: header });
  }*/


}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
