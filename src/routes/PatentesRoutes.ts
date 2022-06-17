import { Router } from 'express';
import {patentesController} from '../controllers/PatentesController';
class PatentesRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.post('/create', patentesController.create);
		this.router.get('/',patentesController.list );
		this.router.get('/:id',patentesController.listOne);
		this.router.delete('/delete/:id', patentesController.delete);
		this.router.put('/actualizar/:id',patentesController.actualizar);
		this.router.get('/listColaboradoresInternosPatentes/:idProfesor',patentesController.listColaboradoresInternosPatentes);
	}
}
const patentesRoutes= new PatentesRoutes();
export default patentesRoutes.router;