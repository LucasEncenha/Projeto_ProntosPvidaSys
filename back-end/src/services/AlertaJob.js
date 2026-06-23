import cron from 'node-cron';
import pool from '../config/database.js';
import { enviarAlertaConsulta, enviarAlertaExame } from './AlertaService.js';

async function verificarConsultasAmanha() {
    try {
        const [consultas] = await pool.query(`
            SELECT 
                c.con_id, c.con_data, c.con_hora, c.con_tipo,
                p.pa_nome, p.pa_email,
                m.med_nome, m.med_especialidade
            FROM consultas c
            INNER JOIN pacientes p ON c.con_paciente_id = p.pa_id
            INNER JOIN medicos m ON c.con_medico_id = m.med_id
            WHERE 
                c.con_status = 'agendada'
                AND DATE(c.con_data) = DATE(NOW() + INTERVAL 1 DAY)
                AND p.pa_email IS NOT NULL
                AND p.pa_email != ''
        `);

        console.log(`[Alertas] Consultas amanhã: ${consultas.length}`);

        for (const consulta of consultas) {
            try {
                await enviarAlertaConsulta(consulta.pa_email, consulta);
                console.log(`[Alertas] E-mail de consulta enviado para ${consulta.pa_email}`);
            } catch (error) {
                console.error(`[Alertas] Falha ao enviar para ${consulta.pa_email}:`, error.message);
            }
        }
    } catch (error) {
        console.error('[Alertas] Erro ao verificar consultas:', error);
    }
}

async function verificarExamesAmanha() {
    try {
        const [exames] = await pool.query(`
            SELECT 
                e.ex_id, e.ex_data,
                p.pa_nome, p.pa_email,
                t.te_nome
            FROM exames e
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            LEFT JOIN resultado_exames r ON r.res_exame_id = e.ex_id
            WHERE 
                DATE(e.ex_data) = DATE(NOW() + INTERVAL 1 DAY)
                AND r.res_id IS NULL
                AND p.pa_email IS NOT NULL
                AND p.pa_email != ''
        `);

        console.log(`[Alertas] Exames amanhã: ${exames.length}`);

        for (const exame of exames) {
            try {
                await enviarAlertaExame(exame.pa_email, exame);
                console.log(`[Alertas] E-mail de exame enviado para ${exame.pa_email}`);
            } catch (error) {
                console.error(`[Alertas] Falha ao enviar para ${exame.pa_email}:`, error.message);
            }
        }
    } catch (error) {
        console.error('[Alertas] Erro ao verificar exames:', error);
    }
}

export function iniciarAlertas() {
    cron.schedule('0 8 * * *', async () => {
        console.log('[Alertas] Iniciando verificação de alertas...');
        await verificarConsultasAmanha();
        await verificarExamesAmanha();
        console.log('[Alertas] Verificação concluída.');
    }, {
        timezone: 'America/Sao_Paulo'
    });

    console.log('[Alertas] Job de alertas iniciado — executa todo dia às 8h.');
}

export async function dispararAlertasManualmente() {
    console.log('[Alertas] Disparo manual iniciado...');
    await verificarConsultasAmanha();
    await verificarExamesAmanha();
    console.log('[Alertas] Disparo manual concluído.');
}