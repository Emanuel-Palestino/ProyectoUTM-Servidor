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
import comisionesRoutes from './routes/ComisionesRoutes'
import ProfesorYComisionRoutes from './routes/ProfesorYComisionRoutes'
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
		this.app.use('/api/comisiones', comisionesRoutes);
		this.app.use('/api/profesorYComision', ProfesorYComisionRoutes);
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
