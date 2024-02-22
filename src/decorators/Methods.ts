/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

function httpMethod(path: string, method: string, cache: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('path', path, descriptor.value);
        Reflect.defineMetadata('method', method, descriptor.value);
        Reflect.defineMetadata('cache', cache, descriptor.value);
    };
}

export function Get(path: string = '/', cache: boolean = false) {
    return httpMethod(path, 'get', cache);
}

export function Post(path: string = '/', cache: boolean = false) {
    return httpMethod(path, 'post', cache);
}

export function Put(path: string = '/', cache: boolean = false) {
    return httpMethod(path, 'put', cache);
}

export function Delete(path: string = '/', cache: boolean = false) {
    return httpMethod(path, 'delete', cache);
}
