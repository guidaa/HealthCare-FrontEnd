import { Component, OnInit } from '@angular/core';
import {CustomerServiceService} from '../../services/customer-service.service';
import {Customer} from '../../common/customer';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})

export class ReportViewComponent implements OnInit {

  columns: any[] = [];
  theTotalElements: number;
  thePageSize: number;

  customerHistoryList: Customer[] = [];

//  selectedProducts: Product[];

  constructor(private customerService: CustomerServiceService) {
  }

  exportColumns: any[];

  ngOnInit() {
    this.handleCustomerHistory();



    this.columns = [];
    this.columns.push({field: 'firstName', header: 'First Name'});
    this.columns.push({field: 'lastName', header: 'Last Name'});
    this.columns.push({field: 'email', header: 'Email'});
  }

  handleCustomerHistory() {

    // retrieve data from the service
    this.customerService.getCustomerHistory().subscribe(
      data => {
        this.customerHistoryList = data._embedded.customers;
        this.theTotalElements = data.page.totalElements;
        this.thePageSize = data.page.size;
      }
    );
  }
}
