import { Router } from 'express';
import {tutoradoController} from '../controllers/TutoradosController'
class TutoradoRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.get('/',tutoradoController.list );
		this.router.get('/:id',tutoradoController.listOne);
		this.router.post('/create', tutoradoController.create);
		this.router.delete('/delete/:id', tutoradoController.delete);
		this.router.put('/actualizar/:idTutorado',tutoradoController.actualizar);
		this.router.get('/listTutoradosByPeriodo/:idProfesor/:fechaIni/:fechaFin', tutoradoController.listTutoradosByPeriodo);
		this.router.get('/listTutoradosByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin', tutoradoController.listTutoradosByCareraByPeriodo)
	}
}
const tutoradoRoutes= new TutoradoRoutes();
export default tutoradoRoutes.router;