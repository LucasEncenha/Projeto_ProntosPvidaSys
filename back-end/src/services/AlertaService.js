import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function enviarAlertaConsulta(destinatario, dados) {
    const { pa_nome, med_nome, med_especialidade, con_data, con_hora, con_tipo } = dados;

    await transporter.sendMail({
        from: `"ProntosPvidaSys" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: 'Lembrete: Consulta amanhã',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e9ecef; border-radius: 8px;">
                <h2 style="color: #1a1a2e;">Lembrete de Consulta</h2>
                <p>Olá, <strong>${pa_nome}</strong>!</p>
                <p>Você tem uma consulta agendada para <strong>amanhã</strong>:</p>
                <div style="background: #e8f0fe; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Médico:</strong> ${med_nome}</p>
                    <p style="margin: 4px 0;"><strong>Especialidade:</strong> ${med_especialidade}</p>
                    <p style="margin: 4px 0;"><strong>Data:</strong> ${new Date(con_data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    <p style="margin: 4px 0;"><strong>Horário:</strong> ${con_hora ? con_hora.slice(0, 5) : ''}</p>
                    ${con_tipo ? `<p style="margin: 4px 0;"><strong>Tipo:</strong> ${con_tipo}</p>` : ''}
                </div>
                <p style="color: #888; font-size: 0.85rem;">Por favor, chegue com 15 minutos de antecedência. Em caso de dúvidas, entre em contato com a instituição.</p>
            </div>
        `
    });
}

export async function enviarAlertaExame(destinatario, dados) {
    const { pa_nome, te_nome, ex_data } = dados;

    await transporter.sendMail({
        from: `"ProntosPvidaSys" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: 'Lembrete: Exame amanhã',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e9ecef; border-radius: 8px;">
                <h2 style="color: #1a1a2e;">Lembrete de Exame</h2>
                <p>Olá, <strong>${pa_nome}</strong>!</p>
                <p>Você tem um exame agendado para <strong>amanhã</strong>:</p>
                <div style="background: #e0f7fa; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <p style="margin: 4px 0;"><strong>Exame:</strong> ${te_nome}</p>
                    <p style="margin: 4px 0;"><strong>Data:</strong> ${new Date(ex_data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                </div>
                <p style="color: #888; font-size: 0.85rem;">Em caso de dúvidas, entre em contato com a instituição.</p>
            </div>
        `
    });
}