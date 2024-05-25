import { Request } from 'express';
import fs from 'node:fs';
import path from 'node:path';
/**
 * Represents an error handler class for logging errors and debugging information.
 */
class ErrorHandler {
    /**
     * The directory path where log files are stored.
     * @private
     * @type {string}
     */
    private logsDirectory: string;

    /**
     * The absolute path to the error log file.
     * @private
     * @type {string}
     */
    private errorLogPath: string;

    /**
     * The absolute path to the debug log file.
     * @private
     * @type {string}
     */
    private debugLogPath: string;

    /**
     * Creates an instance of the ErrorHandler class.
     */
    constructor() {
        // const __dirname = path.dirname(fileURLToPath(__filename));
        this.logsDirectory = path.join(__dirname, '../logs');
        this.errorLogPath = path.join(this.logsDirectory, 'error.log');
        this.debugLogPath = path.join(this.logsDirectory, 'debug.log');

        // Determine log file paths and validate their existence
        this.validateExistence();
    }

    /**
     * Validates the existence of log files and creates them if they don't exist.
     * @private
     */
    private validateExistence(): void {
        try {
            if (!fs.existsSync(this.errorLogPath)) {
                fs.writeFileSync(this.errorLogPath, '', { flag: 'w' });
            }

            if (!fs.existsSync(this.debugLogPath)) {
                fs.writeFileSync(this.debugLogPath, '', { flag: 'w' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Logs an error along with optional request details to the error log file.
     * @param {Error} error - The error object to log.
     * @param {Request|null} [req=null] - The optional request object containing request details.
     */
    public logToError(error: Error, req: Request | null = null): void {
        try {
            const errorLogStream = fs.createWriteStream(this.errorLogPath, { flags: 'a' });

            if (errorLogStream.writable && req) {
                const { method, url, headers, params, query, body } = req;

                errorLogStream.write(`[${new Date().toISOString()}] ${error.stack}\n`);
                errorLogStream.write(`Request Method: ${method}\n`);
                errorLogStream.write(`Request URL: ${url}\n`);
                errorLogStream.write(`Request Headers: ${JSON.stringify(headers)}\n`);
                errorLogStream.write(`Request Params: ${JSON.stringify(params)}\n`);
                errorLogStream.write(`Request Query: ${JSON.stringify(query)}\n`);
                errorLogStream.write(`Request Body: ${JSON.stringify(body)}\n`);
                errorLogStream.write(`============================================\n`);
            } else if (errorLogStream.writable) {
                errorLogStream.write(`[${new Date().toISOString()}] ${error.stack}\n`);
            } else {
                throw new Error('This stream is not writable');
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Logs debug information to the debug log file.
     * @param {any} data - The debug information to log.
     */
    public logToDebug(data: any): void {
        try {
            const debugLogStream = fs.createWriteStream(this.debugLogPath, { flags: 'a' });
            if (debugLogStream.writable) {
                debugLogStream.write(`[${new Date().toISOString()}] ${data}\n`);
            } else {
                throw new Error('This stream is not writable');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default ErrorHandler;