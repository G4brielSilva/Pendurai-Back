/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { TObject } from '../common/models/TObject';

// Define o caminho para o arquivo de log
const logFilePath = path.join(__dirname, 'app.log');

// Define a interface para garantir a estrutura do nosso log
interface LogEntry {
    timestamp: string;
    level: 'INFO' | 'ERROR' | 'WARN';
    message: string;
    method?: string;
    path?: string;
    userId?: string;
    body?: TObject; // Considerar a sanitização para não incluir dados sensíveis
    error?: string;
}

export class ActionLoger {
    /**
     * Adiciona um log estruturado ao arquivo no formato JSON.
     * @param logData O objeto com os dados do log.
     */
    private static async addLog(logData: Omit<LogEntry, 'timestamp'>): Promise<void> {
        // Cria a entrada de log completa com o timestamp
        const logEntry: LogEntry = {
            ...logData,
            timestamp: new Date().toISOString()
        };

        // Converte o objeto para uma string JSON
        const logLine = `${JSON.stringify(logEntry)}\n`;

        try {
            // Adiciona o log JSON ao final do arquivo
            await fs.promises.appendFile(logFilePath, logLine);
        } catch (err) {
            console.error('Falha ao escrever no arquivo de log:', err);
        }
    }

    /**
     * Registra uma ação específica no log.
     * @param { string } reqPath Caminho da requisição.
     * @param { string } userId ID do usuário que realizou a ação.
     * @param { string }action Ação realizada (update ou delete).
     * @param { TObject | undefined } data Dados adicionais relacionados à ação.
     */
    public static async log(reqPath: string, userId: string, action: string, data: TObject | undefined = undefined): Promise<void> {
        const message = `User ${userId} performed ${action} on ${reqPath}`;
        await ActionLoger.addLog({
            level: 'INFO',
            message,
            path: reqPath,
            userId,
            body: data
        });
    }

    /**
     * Middleware para registrar ações baseadas em requisições HTTP.
     */
    // eslint-disable-next-line consistent-return
    public static async logByRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (process.env.NODE_ENV === 'test') return next();
        try {
            const action = req.method;
            const userId = req.body?.authentication?.user?.id || 'unknown';

            await ActionLoger.log(req.path, userId, action, req.body);
        } catch (error) {
            console.error('Erro ao registrar log:', error);
        } finally {
            next();
        }
    }
}
