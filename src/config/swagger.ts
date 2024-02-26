import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Penduraí API',
            description: 'Endpoints do projeto Penduraí.',
            version: '1.5.0'
        },
        host: 'localhost:8080',
        tags: [],
        externalDocs: {
            description: 'View swagger.json',
            url: '../swagger.json'
        },
        components: {
            responses: {
                Success200: {
                    code: 200,
                    description: 'Sucess',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description: 'Sucess message'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Returned data from request'
                                    }
                                }
                            }
                        }
                    }
                },
                SuccessEmpty204: {
                    description: 'Sucess Empty'
                }
            },
            securitySchemes: {
                BearerAuth: {
                    in: 'header',
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
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
