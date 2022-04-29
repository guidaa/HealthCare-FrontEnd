import {ProductCategory} from './product-category';

export class Product {
  id?: string;
  sku?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  category? = 'Medicine';
  imageUrl?: string;
  active?: boolean;
  unitsInStock?: number;
  dateCreated?: Date;
  lastUpdated?: Date;
}

