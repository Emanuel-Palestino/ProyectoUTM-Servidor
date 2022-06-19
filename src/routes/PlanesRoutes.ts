import { Router } from 'express';
import { planesController } from '../controllers/PlanesController';

class PlanRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.post('/create', planesController.create);
		this.router.get('/',planesController.list );
		this.router.get('/:id',planesController.listOne);
		this.router.delete('/delete/:id', planesController.delete);
		this.router.put('/actualizar/:id',planesController.actualizar);
	}
}
const planRoutes= new PlanRoutes();
export default planRoutes.router;