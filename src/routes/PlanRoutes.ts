import { Router } from 'express';
import { planControllers } from '../controllers/PlanController';

class PlanRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.post('/create', planControllers.create);
		this.router.get('/',planControllers.list );
		this.router.get('/:id',planControllers.listOne);
		this.router.delete('/delete/:id', planControllers.delete);
		this.router.put('/actualizar/:id',planControllers.actualizar);
	}
}
const planRoutes= new PlanRoutes();
export default planRoutes.router;