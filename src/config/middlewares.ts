import express, { Express } from 'express';

export function setupMiddlewares(app: Express): void {
    app.use(express.json());
}
