import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function enviarEmailCodigoRecuperacao(destinatario, codigo) {
    const mailOptions = {
        from: `"ProntosPvidaSys" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: 'Código de recuperação de senha',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e9ecef; border-radius: 8px;">
                <h2 style="color: #1a1a2e; margin-bottom: 8px;">Recuperação de Senha</h2>
                <p style="color: #555;">Você solicitou a redefinição da sua senha no sistema <strong>ProntosPvidaSys</strong>.</p>
                <p style="color: #555;">Use o código abaixo para continuar. Ele expira em <strong>15 minutos</strong>.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d6efd; background: #e8f0fe; padding: 16px 32px; border-radius: 8px;">
                        ${codigo}
                    </span>
                </div>
                <p style="color: #888; font-size: 0.85rem;">Se você não solicitou isso, ignore este e-mail. Sua senha não será alterada.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}