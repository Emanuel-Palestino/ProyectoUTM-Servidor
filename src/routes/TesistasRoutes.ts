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
		this.router.get('/listCodirectoresExternosSugerencias/:idProfesor',tesistasController.listCodirectoresExternosSugerencias)
		this.router.get('/listCodirectoresExternos/:idProfesor',tesistasController.listCodirectoresExternos);
		this.router.get('/listTesistasByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodo);
		this.router.get('/listTesistasByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin',tesistasController.listTesistasByCarreraByPeriodo);
		this.router.get('/listTesistasByProfesorByPeriodoByInicio/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodoByInicio);
		this.router.get('/listTesistasByProfesorByPeriodoByStatus/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodoByStatus);
		this.router.get('/listTesistasByProfesorByPeriodoByNombreTesis/:idProfesor/:fechaIni/:fechaFin',tesistasController.listTesistasByProfesorByPeriodoByNombreTesis);		
		this.router.put('/updatePrioridadesTestistas/:idTesis',tesistasController.updatePrioridadesTestistas);
		this.router.get('/listNoColaboradoresUTMByCarreraByTesis/:idCarrera/:idTesis',tesistasController.listNoColaboradoresUTMByCarreraByTesis);
		this.router.post('/addCodirectoresTesistaUTM/:idTesis', tesistasController.addCodirectoresTesistaUTM);
		this.router.get('/listProfesoresbyInstitutoNoCodirectores/:idInstituto/:idTesis',tesistasController.listProfesoresbyInstitutoNoCodirectores);
	}

}

const tesistasRoutes = new TesistasRoutes()
export default tesistasRoutes.router