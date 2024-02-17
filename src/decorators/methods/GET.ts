/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

export function GET(path: string = '/') {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('path', path, descriptor.value);
        Reflect.defineMetadata('method', 'get', descriptor.value);
    };
}
