document.addEventListener("DOMContentLoaded", function () {
    const consultasContainer = document.getElementById("consultas-container");
    const calendarDates = document.getElementById("calendarDates");
    const consultaDetalhes = document.getElementById("consulta-detalhes");

    const abertaCountEl = document.getElementById("aberta-count");
    const atrasadaCountEl = document.getElementById("atrasada-count");
    const concluidaCountEl = document.getElementById("concluida-count");
    const canceladaCountEl = document.getElementById("cancelada-count");

    let consultas = [];
    let currentMonth = new Date(); // Armazena o mês atualmente exibido

    // Carregar consultas do XML
    function loadConsultas() {
        fetch("XML/Consultas.xml")
            .then((response) => response.text())
            .then((xmlText) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                const consultaNodes = xmlDoc.getElementsByTagName("consulta");

                consultas = Array.from(consultaNodes).map((node) => ({
                    id: node.getElementsByTagName("id")[0]?.textContent?.trim(),
                    status: node.getElementsByTagName("status")[0]?.textContent?.trim(),
                    data: node.getElementsByTagName("data")[0]?.textContent?.trim(),
                    descricao: node.getElementsByTagName("descricao")[0]?.textContent?.trim(),
                }));

                atualizarContadores();
                renderCalendar();
            })
            .catch((error) => console.error("Erro ao carregar XML:", error));
    }

    // Atualiza os contadores de status
    function atualizarContadores() {
        const filteredConsultas = filtrarConsultasPorMes();
        const abertaCount = filteredConsultas.filter(c => c.status === "Aberta").length;
        const atrasadaCount = filteredConsultas.filter(c => c.status === "Atrasada").length;
        const concluidaCount = filteredConsultas.filter(c => c.status === "Concluída").length;
        const canceladaCount = filteredConsultas.filter(c => c.status === "Cancelada").length;

        abertaCountEl.textContent = abertaCount;
        atrasadaCountEl.textContent = atrasadaCount;
        concluidaCountEl.textContent = concluidaCount;
        canceladaCountEl.textContent = canceladaCount;
    }

    // Filtra as consultas pelo mês atual (para o calendário)
    function filtrarConsultasPorMes() {
        const month = currentMonth.getMonth() + 1; // Mês atual (0-11, por isso adicionamos 1)
        const year = currentMonth.getFullYear(); // Ano atual
    
        return consultas.filter((consulta) => {
            const [cYear, cMonth] = consulta.data.split("-").map(Number); // Extrai ano e mês da data
            return cYear === year && cMonth === month; // Verifica se o ano e o mês coincidem
        });
    }

    // Renderiza o calendário com as consultas
    function renderCalendar() {
        calendarDates.innerHTML = ""; // Limpa o calendário atual
    
        // Obtém o primeiro dia da semana e a quantidade de dias no mês atual
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
        const lastDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
        // Preenche os dias vazios no início do calendário
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("empty-cell");
            calendarDates.appendChild(emptyCell);
        }
    
        // Adiciona os dias do mês atual ao calendário
        for (let day = 1; day <= lastDate; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.classList.add("day-cell");
    
            const fullDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
            // Filtra todas as consultas com base no dia atual
            const dayConsultas = consultas.filter(c => c.data === fullDate);
    
            if (dayConsultas.length > 0) {
                // Aplica a classe de status da primeira consulta do dia
                const firstConsultaStatus = dayConsultas[0].status?.replace("í", "i").toLowerCase();
                dayCell.classList.add(`status-${firstConsultaStatus}`);
    
                // Adiciona um evento para exibir os detalhes das consultas
                dayCell.addEventListener("click", () => showConsultas(dayConsultas));
            }
    
            calendarDates.appendChild(dayCell);
        }
    
        // Atualiza o título do mês atual
        const currentMonthElement = document.getElementById("currentMonth");
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        currentMonthElement.textContent = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    }

    // Exibe os detalhes das consultas para um dia específico
    function showConsultas(dayConsultas) {
        consultaDetalhes.innerHTML = "";
        if (dayConsultas.length === 0) {
            consultaDetalhes.innerHTML = "<p>Nenhuma consulta para este dia.</p>";
            return;
        }

        dayConsultas.forEach((consulta) => {
            const consultaDiv = document.createElement("div");
            consultaDiv.classList.add("consulta");
            consultaDiv.innerHTML = `
                <p><strong>ID:</strong> ${consulta.id}</p>
                <p><strong>Status:</strong> ${consulta.status}</p>
                <p><strong>Data:</strong> ${consulta.data}</p>
                <p><strong>Descrição:</strong> ${consulta.descricao}</p>
            `;
            consultaDetalhes.appendChild(consultaDiv);
        });
    }

    // Navegação entre meses
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
        atualizarContadores();
    });
    
    document.getElementById("nextMonth").addEventListener("click", () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
        atualizarContadores();
    });
    
    loadConsultas();
});
