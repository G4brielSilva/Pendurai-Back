/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

function httpMethod(path: string, method: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('path', path, descriptor.value);
        Reflect.defineMetadata('method', method, descriptor.value);
    };
}

export function Get(path: string = '/') {
    return httpMethod(path, 'get');
}

export function Post(path: string = '/') {
    return httpMethod(path, 'post');
}

export function Put(path: string = '/') {
    return httpMethod(path, 'put');
}

export function Delete(path: string = '/') {
    return httpMethod(path, 'delete');
}
