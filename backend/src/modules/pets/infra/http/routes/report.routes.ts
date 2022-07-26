import { Router } from 'express';
import SendReportController from '../controllers/SendReportController';

const reportRouter = Router();

const sendReportController = new SendReportController();

reportRouter.post('/send', sendReportController.create);

export default reportRouter;