import { AuthenticationController } from './authentication/AuthenticationController';
import { ProductController } from './product/ProductController';
import { StoreController } from './store/StoreController';

// prettier-ignore
export const v1 = [
    AuthenticationController,
    StoreController,
    ProductController
];

