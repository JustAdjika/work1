import type { Response } from 'express';
import * as UtilitiesTypes from '../types/utilities.types.ts';
import { logger } from '../logger.ts';

export function sendResponse(
    res: Response,
    status: UtilitiesTypes.statusCode = 200,
    message?: string,
    container?: object
) {
    if(status === 500 && message) {
        logger.error(`Unexpected error: ${message}`);
        res.status(status).json({
            status,
            message
        });
    } else if(status !== 200 && message) {
        logger.warn(message);
        res.status(status).json({
            status,
            message
        });
    } else if(status === 200 && container && message) {
        logger.info(message);
        res.status(status).json({
            status,
            container
        });
    } else if(status === 200 && message) {
        logger.info(message);
        res.status(status).json({ status });
    } else {
        logger.error('The input data for the response is incorrect');
    };
};