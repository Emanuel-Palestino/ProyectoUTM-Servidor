"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var email = require("emailjs/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = (formulario) => {
    const token = jsonwebtoken_1.default.sign(formulario.email, process.env.TOKEN_SECRET || 'prueba');
    console.log(formulario.email);
    var server = email.server.connect({
        user: "prueba@emanuelpalestino.com",
        password: "Emanuel123%",
        host: "smtp.hostinger.com",
        ssl: true,
    });
    var message = {};
    message =
        {
            from: "Desarrollo Emanuel <prueba@emanuelpalestino.com>",
            to: formulario.email,
            bcc: "",
            subject: "Cambio de contraseña",
            attachment: [
                {
                    data: `
						En la siguiente liga podrás cambiar tu contraseña:
						<a href="http://localhost:4200/cambiarContrasena/${token}" >RECUPERAR</a>
						`,
                    alternative: true
                }
            ]
        };
    server.send(message, function (err, message) {
        console.log(1);
        console.log('Error:', err);
        console.log('Respuesta', message);
    });
};
