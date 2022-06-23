import { Router } from 'express'
import { tesistasController } from '../controllers/TesistasController'

class TesistasRoutes {

	public router: Router = Router()

	constructor() {
		this.config()
	}

	config() : void {
		this.router.get('/',tesistasController.list );
		this.router.get('/:id',tesistasController.listOne);
		this.router.post('/create/:idProfesor', tesistasController.create);
		this.router.delete('/delete/:id', tesistasController.delete);
		this.router.put('/update/:id',tesistasController.update);
		this.router.get('/listTesistasByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodo);
		this.router.get('/listTesistasByProfesorByPeriodoByInicio/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodoByInicio);
	}

}

const tesistasRoutes = new TesistasRoutes()
export default tesistasRoutes.router