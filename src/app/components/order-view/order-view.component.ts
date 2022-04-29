import { Component, OnInit } from '@angular/core';
import {OrderHistoryService} from '../../services/order-history.service';
import {OrderHistory} from '../../common/order-history';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  columns: any[] = [];
  theTotalElements: number;
  thePageSize: number;
  orderHistoryList: OrderHistory[] = [];

//  selectedProducts: Product[];

  constructor(private orderService: OrderHistoryService) {
  }


  ngOnInit() {
    this.handleOrderHistory();

    this.columns = [];
    this.columns.push({field: 'id', header: 'Customer Id'});
    this.columns.push({field: 'totalPrice', header: 'Price'});
    this.columns.push({field: 'totalQuantity', header: 'Quantity'});
    this.columns.push({field: 'dateCreated', header: 'Date'});
  }

  handleOrderHistory() {

    // retrieve data from the service
    this.orderService.getOrders().subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
        this.theTotalElements = data.page.totalElements;
        this.thePageSize = data.page.size;
        console.log('AQUI VAI O ORDER --> ', this.orderHistoryList);
      }
    );
  }

}
