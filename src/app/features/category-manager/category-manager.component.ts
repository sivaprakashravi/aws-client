import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  displayedColumns: string[] = ['asin', 'productName', 'category', 'actualPrice', 'sellingPrice', 'offerPercentage'];
  products: Product[] = [
    {
      asin: 'B07K8W7Q7W',
      uuid: '76bfdde5-de82-4736-95fa-06a83b963930',
      primaryImage: 'https://m.media-amazon.com/images/I/51lPB6P4BwL._AC_UL320_.jpg',
      altImages: ['https://m.media-amazon.com/images/I/51lPB6P4BwL._AC_UL320_.jpg'],
      isSponsored: true,
      productName: 'prod name as displayed',
      rating: '5.0',
      noOfRating: 7,
      actualPrice: 600,
      sellingPrice: 299,
      offerPercentage: 50,
      bankOffers: ['1500 off on Kotak Bank Credit & Debit Card'],
      shippingCharges: 55,
      deliveryDueBy: 'Saturday, February 6 - Sunday, February 7',
      category: 'catName',
      subCategory: 'subCatName'
    }
  ];
  position = new FormControl('');
  positionOptions = ['Mobile'];
  constructor() { }

  ngOnInit(): void {
  }

}
