export const gerarRelatorioPDF = async (rota, filtros = {}) => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            params.append(key, value);
        }
    });

    try {
        const url = `http://localhost:3000/api/${rota}/relatorio?${params.toString()}`;
        const response = await fetch(url, { credentials: 'include' });

        if (!response.ok) {
            throw new Error(`Erro no servidor (${response.status})`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Relatorio_${rota}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert(`Não foi possível gerar o PDF: ${error.message}`);
    }
};