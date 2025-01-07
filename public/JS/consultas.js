document.addEventListener("DOMContentLoaded", function () {
    const xmlFile = "XML/consultas.xml"; // Caminho para o arquivo XML
    const tableBody = document.querySelector("#tabela-consultas tbody"); // Seleciona o corpo da tabela

    fetch(xmlFile)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo XML.");
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const consultas = xmlDoc.getElementsByTagName("consulta");

            // Limpa a tabela antes de preencher
            tableBody.innerHTML = "";

            // Percorre cada consulta e cria uma linha na tabela
            Array.from(consultas).forEach(consulta => {
                const row = document.createElement("tr");

                const data = consulta.getElementsByTagName("data")[0].textContent;
                const hora = consulta.getElementsByTagName("hora")[0].textContent;
                const tutor = consulta.getElementsByTagName("tutor")[0].textContent;
                const paciente = consulta.getElementsByTagName("paciente")[0].textContent;
                const tipoConsulta = consulta.getElementsByTagName("tipoConsulta")[0].textContent;

                row.innerHTML = `
                    <td>${data}</td>
                    <td>${hora}</td>
                    <td>${tutor}</td>
                    <td>${paciente}</td>
                    <td>${tipoConsulta}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            tableBody.innerHTML = "<tr><td colspan='5'>Erro ao carregar as consultas.</td></tr>";
        });
});
