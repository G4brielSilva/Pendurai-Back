import { Schema } from 'express-validator';

/* eslint-disable no-plusplus */
export const Validations: Schema = {
    cnpj: {
        in: 'body',
        isString: true,
        isLength: {
            options: { min: 14, max: 14 },
            errorMessage: 'cnpj must be at least 14 characters long'
        },
        custom: {
            options: async (cnpj: string) => {
                const digits = new Set(cnpj);
                if (digits.size === 1) return Promise.reject();

                let size = cnpj.length - 2;
                let numbers = cnpj.substring(0, size);
                const verifiersDigits = cnpj.substring(size);

                let sum = 0;
                let pos = size - 7;

                for (let i = size; i >= 1; i--) {
                    sum += Number(numbers.charAt(size - i)) * pos--;
                    if (pos < 2) pos = 9;
                }
                let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                if (result !== Number(verifiersDigits.charAt(0))) return false;

                size += 1;
                numbers = cnpj.substring(0, size);
                sum = 0;
                pos = size - 7;

                for (let i = size; i >= 1; i--) {
                    sum += Number(numbers.charAt(size - i)) * pos--;
                    if (pos < 2) pos = 9;
                }
                result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                if (result !== Number(verifiersDigits.charAt(1))) return false;
                return true;
            },
            errorMessage: 'cnpj is invalid'
        },
        errorMessage: 'cnpj is invalid'
    }
};
