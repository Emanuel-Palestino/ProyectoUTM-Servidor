import { Router } from 'express';
import { planesController } from '../controllers/PlanesController';

class PlanRoutes {
	public router: Router = Router();

	constructor() {
		this.config();
	}

	config(): void {
		this.router.post('/create', planesController.create);
		this.router.get('/', planesController.list);
		this.router.get('/:id', planesController.listOne);
		this.router.delete('/delete/:id', planesController.delete);
		this.router.put('/actualizar/:id',planesController.actualizar);
		this.router.get('/listPlanesByCarrera/:idCarrera',planesController.listPlanesByCarrera);
		this.router.put('/actualizar/:id', planesController.actualizar);
		this.router.get('/planesByCarrera/:idCarrera', planesController.getPlanesByCarrera)
	}

}

const planesRoutes = new PlanRoutes();
export default planesRoutes.router;