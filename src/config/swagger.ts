import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Penduraí API',
            description: 'Endpoints do projeto Penduraí.',
            version: '1.0.0'
        },
        host: 'localhost:3000',
        tags: [],
        externalDocs: {
            description: 'View swagger.json',
            url: '../swagger.json'
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    in: 'header',
                    type: 'http',
                    scheme: 'bearer'
                }
            }
        }
    },
    apis: [
        '../../baseapi_express/src/third-party/swagger/**/*.ts',
        'src/endpoints/**/*.ts',
        '../node_modules/baseapi_express/src/third-party/swagger/**/*.js',
        'endpoints/**/*.js'
    ]
};
