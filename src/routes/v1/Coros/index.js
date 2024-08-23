import { Router } from 'express';
import CorosController from '../../../controllers/v1/Coros/coros.controllers.js';

const router = Router();

router.get('/', (req, res) => {
    res.send('<h3>In this path, we have all the Coros requests</h3>');
});

router.get('/authorize/:db_id', CorosController.authorize);
router.get('/exchange_token', CorosController.manageUserCode);
router.get(
    '/user_data/:id',
    CorosController.refreshTokenMiddleWare,
    CorosController.getCompleteUser
);
router.get(
    '/data_by_date/:id/data',
    CorosController.refreshTokenMiddleWare,
    CorosController.getDataByDate
);
router.get(
    '/data_by_date/:id/data',
    CorosController.refreshTokenMiddleWare,
    CorosController.getRestDataByDate
);
router.post(
    '/setStats',
    CorosController.refreshTokenMiddleWare,
    CorosController.setStats
);
router.get('/webhook', CorosController.getWebhook)
router.post('/webhook', CorosController.webhook)

export default router;
