import { Router } from 'express';
import {periodoController} from '../controllers/PeriodoController';
class PeriodosRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.post('/create', periodoController.create);
		this.router.get('/',periodoController.list );
		this.router.get('/:id',periodoController.listOne);
		this.router.put('/update/:idPeriodo',periodoController.update);
		this.router.delete('/delete/:idPeriodo', periodoController.delete);
		
	}
}
const periodosRoutes= new PeriodosRoutes();
export default periodosRoutes.router;