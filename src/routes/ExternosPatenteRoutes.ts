import { Router } from 'express';
import {externosPatenteController} from '../controllers/ExternosPatenteController'
class ExternosPatenteRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.get('/',externosPatenteController.list );
		this.router.get('/:id',externosPatenteController.listOne);
		this.router.post('/create', externosPatenteController.create);
		this.router.delete('/delete/:id', externosPatenteController.delete);
		this.router.put('/actualizar/:idExternoPatente',externosPatenteController.actualizar);
	}
}
const externosPatenteRoutes= new ExternosPatenteRoutes();
export default externosPatenteRoutes.router;