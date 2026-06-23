import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import PacientesRotas from './routes/PacienteRotas.js';
import TipoExameRotas from './routes/TipoExameRotas.js';
import DoadorRotas from './routes/DoadorRotas.js';
import AuthRotas  from './routes/AuthRotas.js';
import ExameRotas from './routes/ExameRotas.js';
import DoacaoRotas from './routes/DoacaoRotas.js';
import MedicoRotas from './routes/MedicoRotas.js';
import ConsultaRotas from './routes/ConsultaRotas.js';
import ResultadoExameRotas from './routes/ResultadoExameRotas.js';
import AlertaRotas from './routes/AlertaRotas.js';
import UsuarioRotas from './routes/UsuarioRotas.js';
import { iniciarAlertas } from './services/AlertaJob.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static('uploads'));

app.use('/auth', AuthRotas);
app.use('/api', PacientesRotas);
app.use('/api', TipoExameRotas);
app.use('/api', DoadorRotas);
app.use('/api', ExameRotas);
app.use('/api', DoacaoRotas);
app.use('/api', MedicoRotas);
app.use('/api', ConsultaRotas);
app.use('/api', ResultadoExameRotas);
app.use('/api', AlertaRotas);
app.use('/api', UsuarioRotas);

app.get('/',(req,res) => {
    res.json({message: 'API pacientes está rodando'})
});
app.use((req,res) => {
    res.status(404).json({error: 'Rota não encontrada'})
});

app.listen(PORT,() => {
    console.log('Servidor rodando na porta:' + PORT);
    iniciarAlertas();
})

export default app;