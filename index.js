import express from 'express';
import cors from 'cors';
import rotaMaquina from './Rotas/rotaMaquina.js';
import rotaFabricante from './Rotas/rotaFabricante.js';
import session from 'express-session';
import dotenv from 'dotenv';	
import rotaAutenticacao from './Rotas/rotaAutenticacao.js';
import { verificarAutenticacao } from './Seguranca/autenticar.js';

dotenv.config();

const host = '0.0.0.0';
const porta = 4000;

const app = express();

// Configuração de sessão
app.use(session({
    secret: process.env.CHAVE_SECRETA,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Melhorar a segurança
        secure: process.env.NODE_ENV === 'production', // Usar cookies seguros em produção
        sameSite: 'strict', // Melhorar a segurança
        maxAge: 1000 * 60 * 15 // 15 minutos
    }
}));

// Configuração de CORS
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://192.168.0.101:3000"],
}));

// Middleware para ler dados do corpo da requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.use('/fabricante', verificarAutenticacao, rotaFabricante);
app.use('/maquina', verificarAutenticacao, rotaMaquina);
app.use('/login', rotaAutenticacao);


// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Iniciar o servidor
app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});