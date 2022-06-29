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
		this.router.post('/create/:idProfesor', patentesController.create);
		this.router.get('/',patentesController.list );
		this.router.get('/:id',patentesController.listOne);
		this.router.delete('/delete/:id', patentesController.delete);
		this.router.put('/actualizar/:id',patentesController.actualizar);
		this.router.get('/listPatentesByProfesorByPeriodo/:idProfesor/:fechaIni/:fechaFin',patentesController.listPatentesByProfesorByPeriodo );
		this.router.get('/listColaboradoresInternosPatentes/:idProfesor',patentesController.listColaboradoresInternosPatentes);
		this.router.get('/listSugerenciasColaboradoresExternosPatente/:idProfesor', patentesController.colaboradoresExternos);
		this.router.get('/listColaboradoresExternosExistentesSinColaboracionPatentes/:idProfesor',patentesController.listColaboradoresExternosExistentesSinColaboracionPatentes);
		this.router.put('/updatePrioridadesOfColaboradoresByPatente/:idPatente',patentesController.updatePrioridadesOfColaboradoresByPatente);
		this.router.get('/listPatentesByCarreraByPeriodo/:idCarrera/:fechaIni/:fechaFin',patentesController.listPatentesByCarreraByPeriodo);
		this.router.post('/addColaboradoresPatenteUTM/:idPatente', patentesController.addColaboradoresPatenteUTM);
		this.router.post('/createColaboradorExternoPatente/:idPatente',patentesController.createColaboradorExternoPatente);
		this.router.get('/listProfesoresByInstitutoSinColaboradoresInternosByPatente/:idInstituto/:idPatente', patentesController.listProfesoresByInstitutoSinColaboradoresInternosByPatente);
	}
}
const patentesRoutes= new PatentesRoutes();
export default patentesRoutes.router;