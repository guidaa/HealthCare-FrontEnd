import { Component, OnInit } from '@angular/core';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminViewService} from '../../services/admin-view.service';
import {finalize} from 'rxjs/operators';

@Component({
  templateUrl: 'admin-view.component.html',
  styleUrls: ['admin-view.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class AdminViewComponent implements OnInit {

  columns: any[] = [];
  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 500;
  theTotalElements: number = 0;

  currentCategoryId?: number = 1;

  productDialog: boolean = false;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  submitted: boolean;
  formProduct: FormGroup;

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private fb: FormBuilder,
              private adminViewService: AdminViewService
              ) { }

  ngOnInit() {
    this.columns = [];
    this.columns.push({field: 'name', header: 'Name'});
    this.columns.push({field: 'unitPrice', header: 'Price'});
    this.columns.push({field: 'category', header: 'Category'});
    this.columns.push({field: 'unitsInStock', header: 'Unit In Stock'});
    this.columns.push({field: 'action', header:''});

    this.productService.getProductListPaginate(this.thePageNumber - 1,
       this.thePageSize,
      this.currentCategoryId).subscribe(this.processResult());

    this.formProduct = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      unitPrice: [null, [Validators.required]],
      unitsInStock: [null, [Validators.required]],
    });
  }

  processResult (){
    return (data: any) => {
      this.products = data._embedded.products;
      console.log(this.products)
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
    this.formProduct.reset();
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.selectedProducts = null;
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      }
    });
  }

  editProduct(product: Product) {
    this.product = {...product};
    this.productDialog = true;
    this.formProduct.patchValue({
      name: this.product.name,
      description: this.product.description,
      unitPrice: this.product.unitPrice,
      unitsInStock: this.product.unitsInStock
    })
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminViewService.deleteProduct(product.id).subscribe(() => {
          this.products = this.products.filter(val => val.id !== product.id);
          this.product = {};
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
        }, error => {
          this.messageService.add({severity:'warn', summary: 'Error', detail: error.message, life: 3000});
          console.log(error);
        })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.product = {};
    this.formProduct.reset();
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  submitForm() {
    this.submitted = true;
    let product: Product = this.formProduct.getRawValue();
    if (this.product.id){
      this.adminViewService.updateProduct(product, this.product.id).pipe(finalize( ()=> {
        this.product = {};
        this.formProduct.reset();})
      ).subscribe(res => {
        this.products[this.products.findIndex(x => x.id === this.product.id)] = res;
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
      }, error => {
        this.messageService.add({severity: 'warn', summary: 'Error', detail: error.message, life: 3000});
        console.log(error);
      });
    } else {
      this.adminViewService.createProduct(product).subscribe(res => {
        this.products.push(res);
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
      }, error => {
        this.messageService.add({severity: 'warn', summary: 'Error', detail: error.message, life: 3000});
        console.log(error);
      });
    }
    this.submitted = false;
    this.productDialog = false;
  }


}
