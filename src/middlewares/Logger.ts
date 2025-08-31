/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { TObject } from '../common/models/TObject';

// Define o caminho para o arquivo de log
const logFilePath = path.join(process.env.LOG_FILE_PATH || __dirname, 'app.log');

interface LogEntry {
    timestamp: string;
    level: 'INFO' | 'ERROR' | 'WARN';
    message: string;
    method?: string;
    path?: string;
    userId?: string;
    body?: TObject;
    error?: string;
}

export class Logger {
    public static async log(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = Date.now();
        next();
        res.on('finish', () => {
            const { statusCode } = res;
            const elapsedTime = Date.now() - start;
            console.log(`${req.method} ${req.path} - ${statusCode} ${elapsedTime}ms`);
        });
    }

    /**
     * Registra uma ação específica no log.
     * @param { string } reqPath Caminho da requisição.
     * @param { string } userId ID do usuário que realizou a ação.
     * @param { string }action Ação realizada (update ou delete).
     * @param { TObject | undefined } data Dados adicionais relacionados à ação.
     */
    public static async logIntoFile(reqPath: string, userId: string, action: string, data: TObject | undefined = undefined): Promise<void> {
        const message = `User ${userId} performed ${action} on ${reqPath}`;

        // Cria a entrada de log completa
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message,
            path: reqPath,
            userId,
            body: data
        };
        const logLine = `${JSON.stringify(logEntry)}\n`;

        try {
            await fs.promises.appendFile(logFilePath, logLine);
        } catch (err) {
            console.error('Falha ao escrever no arquivo de log:', err);
        }
    }

    /**
     * Middleware para registrar ações baseadas em requisições HTTP.
     */
    // eslint-disable-next-line consistent-return
    public static async logByRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (process.env.IS_TEST === 'true') return next();
        try {
            const action = req.method;
            const userId = req.body?.authentication?.user?.id || 'unknown';

            await Logger.logIntoFile(req.path, userId, action, req.body);
        } catch (error) {
            console.error('Erro ao registrar log:', error);
        } finally {
            next();
        }
    }
}
