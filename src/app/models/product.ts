export interface Product {
    asin: string;
    uuid: string;
    primaryImage: string;
    altImages: string[];
    isSponsored: boolean;
    productName: string;
    rating: string;
    noOfRating: number;
    actualPrice: number;
    sellingPrice: number;
    offerPercentage: number;
    bankOffers: string[];
    shippingCharges: number;
    deliveryDueBy: string;
    category: string;
    subCategory: string;
}