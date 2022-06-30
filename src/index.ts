import morgan from 'morgan'
import cors from 'cors'
import express, {Application} from 'express'
import swagger_ui_express from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

import indexRoutes from './routes/IndexRoutes'
import carrerasRoutes from './routes/CarrerasRoutes'
import institutosRoutes from './routes/InstitutosRoutes'
import ProfesoresRoutes from './routes/ProfesoresRoutes'
import ProfesorYArticuloRoutes from './routes/ProfesorYArticuloRoutes'
import ArticulosRoutes from './routes/ArticulosRoutes'
import ArchivoYArticuloRoutes from './routes/ArchivoYArticuloRoutes'
import EventosRoutes from './routes/EventosRoutes'
import ActividadesRoutes from './routes/ActividadesRoutes'
import PatentesRoutes from './routes/PatentesRoutes'
import ProfesorYPatenteRoutes from './routes/ProfesorYPatenteRoutes'
import ExternosPatenteRoutes from './routes/ExternosPatenteRoutes'
import RevisorRoutes from './routes/RevisorRoutes'
import comisionesRoutes from './routes/ComisionesRoutes'
import ProfesorYComisionRoutes from './routes/ProfesorYComisionRoutes'
import TesistasRoutes from './routes/TesistasRoutes'
import ProfesorYTesisRoutes from './routes/ProfesorYTesisRoutes'
import ProyectosRoutes from './routes/ProyectosRoutes'
import ProfesorYProyectoRoutes from './routes/ProfesorYProyectoRoutes'
import ExternosProyectoRoutes from './routes/ExternosProyectoRoutes'
import TutoradosRoutes from './routes/TutoradosRoutes'
import MateriasRoutes from './routes/MateriasRoutes'
import PlanesRoutes from './routes/PlanesRoutes'
import PeriodosRoutes from './routes/PeriodosRoutes'
import ExternosApaRoutes from './routes/ExternosApaRoutes'
import ExternosCodirectorRoutes from './routes/ExternosCodirectorRoutes'
import ProfesorYMateriaRoutes from './routes/ProfesorYMateriaRoutes'
import ProfesorYMateriaMultipleRoutes from './routes/ProfesorYMateriaMultipleRoutes'
import GruposMultiplesRoutes from './routes/GruposMultiplesRoutes'

class Server {

	public app: Application

	constructor() {
		this.app = express()
		this.config()
		this.routes()
		this.app.use('/api/documentacion', swagger_ui_express.serve, swagger_ui_express.setup(swaggerDocument))
		this.app.use(express.static(__dirname))
	}

	config(): void {
		this.app.set('port', process.env.PORT || 3000)
		this.app.use(morgan('dev'))
		this.app.use(cors())
		this.app.use(express.json())
		this.app.use(express.urlencoded({extended: false}))
	}

	routes(): void {
		this.app.use(indexRoutes);
		this.app.use('/api/carreras', carrerasRoutes)
		this.app.use('/api/institutos', institutosRoutes)
		this.app.use('/api/profesores', ProfesoresRoutes)
		this.app.use('/api/profesorYArticulo', ProfesorYArticuloRoutes)
		this.app.use('/api/articulos', ArticulosRoutes)
		this.app.use('/api/archivoYArticulo', ArchivoYArticuloRoutes)
		this.app.use('/api/eventos', EventosRoutes)
		this.app.use('/api/actividades', ActividadesRoutes)
		this.app.use('/api/planes',PlanesRoutes)
		this.app.use('/api/patentes',PatentesRoutes)
		this.app.use('/api/profesorYPatente',ProfesorYPatenteRoutes)
		this.app.use('/api/externosPatente',ExternosPatenteRoutes)
		this.app.use('/api/revisor', RevisorRoutes)
		this.app.use('/api/comisiones', comisionesRoutes);
		this.app.use('/api/profesorYComision', ProfesorYComisionRoutes);
		this.app.use('/api/tesistas',TesistasRoutes)
		this.app.use('/api/profesorYTesis',ProfesorYTesisRoutes)
		this.app.use('/api/proyectos',ProyectosRoutes )
		this.app.use('/api/profesorYproyecto',ProfesorYProyectoRoutes )
		this.app.use('/api/externosProyecto',ExternosProyectoRoutes )
		this.app.use('/api/tutorados', TutoradosRoutes)
		this.app.use('/api/materias', MateriasRoutes);
		this.app.use('/api/periodos', PeriodosRoutes);
		this.app.use('/api/externosApa', ExternosApaRoutes);
		this.app.use('/api/externosCodirector',ExternosCodirectorRoutes);
		this.app.use('api/profesorYMateria', ProfesorYMateriaRoutes)
		this.app.use('api/profesorYMateriaMultiple', ProfesorYMateriaMultipleRoutes)
		this.app.use('api/gruposMultiples', GruposMultiplesRoutes)
	}

	start(): void {
		this.app.listen(this.app.get('port'), () => {
			console.log('Server on port', this.app.get('port'))
			console.log('Visit', 'http://localhost:' + this.app.get('port'), 'to check')
		})
	}

}

const server = new Server()
server.start()
