/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */
export function Controller(route: string): (constructor: Function) => void {
    // eslint-disable-next-line func-names
    return function (constructor: Function) {
        constructor.prototype.baseRoute = route;
    };
}
