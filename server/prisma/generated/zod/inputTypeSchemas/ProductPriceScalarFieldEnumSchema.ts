import { z } from 'zod';

export const ProductPriceScalarFieldEnumSchema = z.enum(['id','leafletId','productName','searchName','price','originalPrice','storeName','isAction','cardRequired','discountPercentage','category','validFrom','validUntil','page','unit','amount','unitPrice','box_2d','linkToPhoto','linkToAction','moreInfo','createdAt']);

export default ProductPriceScalarFieldEnumSchema;
