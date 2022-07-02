import { Router } from 'express'
import { profesorYTesisController } from '../controllers/ProfesorYTesisController';

class TesistasRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/',profesorYTesisController.list );
		this.router.get('/:idTesis/:idProfesor',profesorYTesisController.listOne);
		this.router.post('/create', profesorYTesisController.create);
		this.router.post('/createCodirectorExternoTesista/:idTesis', profesorYTesisController.createCodirectorExternoTesista);
		this.router.delete('/delete/:idTesis/:idProfesor', profesorYTesisController.delete);
		this.router.put('/update/:idTesis/:idProfesor',profesorYTesisController.update);
    }

}

const tesistasRoutes = new TesistasRoutes()
export default tesistasRoutes.router