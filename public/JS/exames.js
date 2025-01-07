document.addEventListener("DOMContentLoaded", function () {
    // Função para carregar os exames do XML e exibir na tabela
    function carregarExames() {
      fetch('./XML/exames.xml')
        .then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, "application/xml");
  
          const exames = xml.querySelectorAll("exame");
          const tabelaBody = document.querySelector("#tabela-exames tbody");
  
          tabelaBody.innerHTML = ""; // Limpar a tabela antes de adicionar os novos dados
  
          exames.forEach(exame => {
            const tipoExame = exame.querySelector("tipo").textContent;
            const paciente = exame.querySelector("paciente").textContent;
            const data = exame.querySelector("data").textContent;
            const hora = exame.querySelector("hora").textContent;
            const observacoes = exame.querySelector("observacoes") ? exame.querySelector("observacoes").textContent : "N/A";
          
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${tipoExame}</td>
              <td>${paciente}</td>
              <td>${data}</td>
              <td>${hora}</td>
              <td>${observacoes}</td>
            `;
            tabelaBody.appendChild(row);
          });
        })
        .catch(error => console.error("Erro ao carregar XML de exames:", error));
    }
  
    // Função para adicionar um novo exame na tabela (simulado)
    function adicionarExameNaTabela(tipo, paciente, data, hora, observacoes) {
        const tabelaBody = document.querySelector("#tabela-exames tbody");
      
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tipo}</td>
          <td>${paciente}</td>
          <td>${data}</td>
          <td>${hora}</td>
          <td>${observacoes || "N/A"}</td>
        `;
        tabelaBody.appendChild(row);
    }
  
    // Função de validação do formulário
    function validarFormulario(event) {
        event.preventDefault();
      
        const tipoExame = document.getElementById('tipo-exame');
        const paciente = document.getElementById('paciente');
        const data = document.getElementById('data');
        const hora = document.getElementById('hora');
        const observacoes = document.getElementById('observacoes').value;
      
        let isValid = true;
      
        if (!tipoExame.value) {
          alert('O campo "Tipo de Exame" é obrigatório.');
          isValid = false;
        }
      
        if (!paciente.value.trim()) {
          alert('O campo "Paciente" é obrigatório.');
          isValid = false;
        }
      
        if (!data.value) {
          alert('O campo "Data do Exame" é obrigatório.');
          isValid = false;
        }
      
        if (!hora.value) {
          alert('O campo "Horário" é obrigatório.');
          isValid = false;
        }
      
        if (isValid) {
          adicionarExameNaTabela(
            tipoExame.value,
            paciente.options[paciente.selectedIndex].text,
            data.value,
            hora.value,
            observacoes
          );
      
          alert("Exame agendado com sucesso!");
      
          // Limpar formulário após submissão
          tipoExame.value = "";
          paciente.value = "";
          data.value = "";
          hora.value = "";
          document.getElementById('observacoes').value = "";
        }
      }
  
    // Associar validação ao formulário
    const form = document.getElementById("form-exame");
    form.addEventListener("submit", validarFormulario);
  
    // Carregar tutores e pacientes
    fetch('./XML/tutor.xml')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
  
        const tutores = xml.querySelectorAll("tutor");
        const tutorSelect = document.getElementById("tutor");
        tutores.forEach(tutor => {
          const option = document.createElement("option");
          option.value = tutor.getAttribute("id");
          option.textContent = tutor.querySelector("nome").textContent;
          tutorSelect.appendChild(option);
        });
  
        const pacientes = xml.querySelectorAll("paciente");
        const pacienteSelect = document.getElementById("paciente");
        pacienteSelect.disabled = true;
  
        tutorSelect.addEventListener("change", function () {
          pacienteSelect.innerHTML = '<option value="">Selecione um paciente</option>';
          if (this.value) {
            const tutorId = this.value;
            const pacientesFiltrados = Array.from(pacientes).filter(
              paciente => paciente.getAttribute("tutorId") === tutorId
            );
            pacientesFiltrados.forEach(paciente => {
              const option = document.createElement("option");
              option.value = paciente.getAttribute("id");
              option.textContent = paciente.querySelector("nome").textContent;
              pacienteSelect.appendChild(option);
            });
            pacienteSelect.disabled = false;
          } else {
            pacienteSelect.disabled = true;
          }
        });
      })
      .catch(error => console.error("Erro ao carregar XML de tutores:", error));
  
    // Carregar exames existentes ao carregar a página
    carregarExames();
  });
  