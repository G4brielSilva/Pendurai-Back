/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */
export function PublicRoute() {
    // eslint-disable-next-line func-names
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('roles', [], descriptor.value);
    };
}
