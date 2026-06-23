export const gerarRelatorioPDF = async (rota, filtros = {}) => {
    const params = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            params.append(key, value);
        }
    });

    try {
        const token = localStorage.getItem('auth_token');
        const baseURL = `${import.meta.env.VITE_API_URL}/api`;
        const url = `${baseURL}/${rota}/relatorio?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });

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