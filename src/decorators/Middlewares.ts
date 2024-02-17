/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

export function Middlewares(...elements: any[]) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('middlewares', elements, descriptor.value);
    };
}
