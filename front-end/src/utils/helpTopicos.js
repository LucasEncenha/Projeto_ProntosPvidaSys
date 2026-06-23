export const helpPacientes = {
    titulo: "Ajuda — Pacientes",
    topicos: [
        {
            titulo: "Como cadastrar um paciente",
            conteudo: [
                "Clique em 'Novo Paciente' no canto superior direito.",
                "Preencha o CPF, nome completo, data de nascimento e telefone.",
                "Informe o e-mail do paciente (necessário para receber alertas de consultas e exames).",
                "Informe o endereço completo.",
                "Clique em 'Cadastrar' para salvar."
            ]
        },
        {
            titulo: "Como editar um paciente",
            conteudo: [
                "Localize o paciente na tabela.",
                "Clique no botão amarelo (lápis) na coluna Ações.",
                "Altere os campos desejados.",
                "Clique em 'Salvar Alterações'."
            ]
        },
        {
            titulo: "Como excluir um paciente",
            conteudo: [
                "Localize o paciente na tabela.",
                "Clique no botão vermelho (lixeira) na coluna Ações.",
                "Confirme a exclusão na janela que aparecer.",
                "Atenção: a exclusão remove também as consultas e exames vinculados."
            ]
        },
        {
            titulo: "Como buscar um paciente",
            conteudo: [
                "Digite o nome, CPF, telefone ou endereço na barra de busca.",
                "Pressione Enter ou clique em 'Buscar'.",
                "Para limpar a busca, clique no botão ✕."
            ]
        },
        {
            titulo: "Como gerar o relatório PDF",
            conteudo: [
                "Clique no botão 'PDF' no canto superior direito.",
                "O arquivo será baixado automaticamente.",
                "Se houver um filtro ativo, o PDF incluirá apenas os registros filtrados."
            ]
        }
    ]
};

export const helpConsultas = {
    titulo: "Ajuda — Consultas",
    topicos: [
        {
            titulo: "Como agendar uma consulta",
            conteudo: [
                "Clique em 'Nova Consulta'.",
                "Digite o CPF do paciente e clique em 'Buscar' para localizar o cadastro.",
                "Selecione o médico responsável.",
                "Informe a data e o horário da consulta.",
                "Informe o tipo da consulta (ex: Retorno, Primeira consulta).",
                "Selecione o status: Agendada, Realizada ou Cancelada.",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como editar uma consulta",
            conteudo: [
                "Localize a consulta na tabela.",
                "Clique no botão amarelo (lápis).",
                "Altere os dados e clique em 'Salvar'."
            ]
        },
        {
            titulo: "Verificação de disponibilidade",
            conteudo: "O sistema verifica automaticamente se o médico já possui outra consulta no mesmo dia e horário. Caso o horário esteja ocupado, será exibida uma mensagem de conflito."
        },
        {
            titulo: "Como buscar consultas",
            conteudo: [
                "Digite o nome do paciente, médico, tipo ou status na barra de busca.",
                "Pressione Enter ou clique em 'Buscar'."
            ]
        },
        {
            titulo: "Alertas automáticos",
            conteudo: "O sistema envia automaticamente um e-mail de lembrete ao paciente no dia anterior à consulta, desde que o paciente tenha e-mail cadastrado e a consulta esteja com status 'Agendada'."
        }
    ]
};

export const helpExames = {
    titulo: "Ajuda — Exames",
    topicos: [
        {
            titulo: "Como cadastrar um exame",
            conteudo: [
                "Clique em 'Novo Exame'.",
                "Selecione o paciente na lista.",
                "Selecione o tipo de exame.",
                "Informe a data do exame.",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como editar um exame",
            conteudo: [
                "Localize o exame na tabela.",
                "Clique no botão amarelo (lápis).",
                "Altere os dados e clique em 'Salvar Alterações'."
            ]
        },
        {
            titulo: "Como excluir um exame",
            conteudo: [
                "Clique no botão vermelho (lixeira) na linha do exame.",
                "Confirme a exclusão."
            ]
        },
        {
            titulo: "Alertas automáticos",
            conteudo: "O sistema envia e-mail de lembrete ao paciente no dia anterior ao exame, desde que o paciente tenha e-mail cadastrado e o exame ainda não tenha resultado cadastrado."
        }
    ]
};

export const helpMedicos = {
    titulo: "Ajuda — Médicos",
    topicos: [
        {
            titulo: "Como cadastrar um médico",
            conteudo: [
                "Clique em 'Novo Médico'.",
                "Informe o nome completo.",
                "Informe o CRM (ex: CRM/SP 123456).",
                "Informe a especialidade (ex: Oncologia).",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como editar um médico",
            conteudo: [
                "Localize o médico na tabela.",
                "Clique no botão amarelo (lápis).",
                "Altere os dados e clique em 'Salvar'."
            ]
        },
        {
            titulo: "Como excluir um médico",
            conteudo: [
                "Clique no botão vermelho (lixeira).",
                "Confirme a exclusão.",
                "Atenção: médicos vinculados a consultas não podem ser excluídos."
            ]
        }
    ]
};

export const helpDoacoes = {
    titulo: "Ajuda — Doações",
    topicos: [
        {
            titulo: "Como registrar uma doação",
            conteudo: [
                "Clique em 'Nova Doação'.",
                "Selecione o doador na lista.",
                "Informe o valor doado.",
                "Informe a data da doação.",
                "Opcionalmente, adicione uma observação.",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como editar uma doação",
            conteudo: [
                "Localize a doação na tabela.",
                "Clique no botão amarelo (lápis).",
                "Altere os dados e clique em 'Salvar Alterações'."
            ]
        },
        {
            titulo: "Total arrecadado",
            conteudo: "O total arrecadado exibido no cabeçalho da tela soma automaticamente todas as doações listadas. Se houver filtro ativo, o total reflete apenas os registros filtrados."
        }
    ]
};

export const helpDoadores = {
    titulo: "Ajuda — Doadores",
    topicos: [
        {
            titulo: "Como cadastrar um doador",
            conteudo: [
                "Clique em 'Novo Doador'.",
                "Informe o nome completo.",
                "Informe o e-mail e telefone.",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como editar um doador",
            conteudo: [
                "Localize o doador na tabela.",
                "Clique no botão amarelo (lápis).",
                "Altere os dados e clique em 'Salvar Alterações'."
            ]
        }
    ]
};

export const helpTiposExame = {
    titulo: "Ajuda — Tipos de Exame",
    topicos: [
        {
            titulo: "Como cadastrar um tipo de exame",
            conteudo: [
                "Clique em 'Novo Tipo de Exame'.",
                "Informe o nome do exame (ex: Hemograma Completo).",
                "Selecione o status: Ativo ou Inativo.",
                "Opcionalmente, adicione uma descrição.",
                "Clique em 'Cadastrar'."
            ]
        },
        {
            titulo: "Como desativar um tipo de exame",
            conteudo: [
                "Clique no botão amarelo (lápis) na linha do exame.",
                "Altere o status para 'Inativo'.",
                "Clique em 'Salvar'.",
                "Tipos inativos não aparecem na seleção de novos exames."
            ]
        }
    ]
};

export const helpResultados = {
    titulo: "Ajuda — Resultados de Exames",
    topicos: [
        {
            titulo: "Como cadastrar um resultado",
            conteudo: [
                "Clique em 'Novo Resultado'.",
                "Digite o CPF do paciente e clique em 'Buscar'.",
                "Selecione o exame pendente na lista exibida.",
                "Informe a data do resultado.",
                "Digite o resultado em texto e/ou anexe um arquivo (PDF, JPG ou PNG, máx. 10MB).",
                "Clique em 'Salvar Resultado'."
            ]
        },
        {
            titulo: "Como visualizar um arquivo anexado",
            conteudo: [
                "Na tabela de resultados, clique no ícone azul de arquivo na coluna Ações.",
                "O arquivo será aberto em uma nova aba do navegador."
            ]
        },
        {
            titulo: "Exames pendentes",
            conteudo: "Apenas exames sem resultado cadastrado aparecem na busca por CPF. Após inserir o resultado, o exame sai da lista de pendentes."
        }
    ]
};