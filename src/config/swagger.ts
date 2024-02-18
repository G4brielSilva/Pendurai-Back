import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Penduraí API',
            description: 'Endpoints do projeto Penduraí.',
            version: '1.1.0'
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
                    description: 'Sucesso',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description: 'Mensagem de sucesso'
                                    },
                                    data: {
                                        type: 'object',
                                        description: 'Dados retornados pela requisição'
                                    }
                                }
                            }
                        }
                    }
                }
            },
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
