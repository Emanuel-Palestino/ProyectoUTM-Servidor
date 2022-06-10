import { Router } from 'express'
import { profesorYTesisController } from '../controllers/ProfesorYTesisController';

class TesistasRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/',profesorYTesisController.list );
		this.router.get('/:id',profesorYTesisController.listOne);
		this.router.post('/create', profesorYTesisController.create);
		this.router.delete('/delete/:id', profesorYTesisController.delete);
		this.router.put('/update/:id',profesorYTesisController.update);
    }

}

const tesistasRoutes = new TesistasRoutes()
export default tesistasRoutes.router