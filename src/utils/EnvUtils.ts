import 'dotenv/config';

export class EnvUtils {
    public static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }
}
