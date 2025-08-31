/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
import 'reflect-metadata';

export function Log() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('log', true, descriptor.value);
    };
}
