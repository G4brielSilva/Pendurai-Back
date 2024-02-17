/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function POST(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('path', path, descriptor.value);
        Reflect.defineMetadata('method', 'post', descriptor.value);
    };
}
