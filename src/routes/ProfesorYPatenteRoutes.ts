import { Router } from 'express';
import { profesorYPatenteController } from '../controllers/ProfesorYPatenteController';
class ProfesorYPatenteRoutes
{
	public router: Router=Router();
	constructor()
	{
		this.config();
	}
	config() : void
	{
		this.router.get('/',profesorYPatenteController.list );
		this.router.get('/listOne/:idProfesor/:idPatente/:esInterno',profesorYPatenteController.listOne);
		this.router.post('/create', profesorYPatenteController.create);
		this.router.delete('/delete/:idProfesor/:idPatente/:esInterno', profesorYPatenteController.delete);
		this.router.put('/actualizar/:idProfesor/:idPatente/:esInterno',profesorYPatenteController.actualizar);
	}
}
const profesorYPatentesRoutes= new ProfesorYPatenteRoutes();
export default profesorYPatentesRoutes.router;