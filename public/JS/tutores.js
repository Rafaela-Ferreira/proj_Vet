document.addEventListener("DOMContentLoaded", function () {
    const tutorSelect = document.getElementById("tutor");
  
    // Função para carregar tutores do arquivo XML
    function carregarTutores() {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "./XML/tutores.xml", true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const xmlDoc = xhr.responseXML;
          const tutores = xmlDoc.getElementsByTagName("tutor");
  
          for (let i = 0; i < tutores.length; i++) {
            const id = tutores[i].getElementsByTagName("id")[0].textContent;
            const nome = tutores[i].getElementsByTagName("nome")[0].textContent;
  
            const option = document.createElement("option");
            option.value = id;
            option.textContent = nome;
            tutorSelect.appendChild(option);
          }
        } else {
          console.error("Erro ao carregar o arquivo XML de tutores.");
        }
      };
      xhr.onerror = function () {
        console.error("Erro na requisição do arquivo XML de tutores.");
      };
      xhr.send();
    }
  
    carregarTutores();
  });

// Função de validação do formulário
function validarFormulario(event) {
  event.preventDefault();
  const paciente = document.getElementById('paciente');
  const data = document.getElementById('data');
  const hora = document.getElementById('hora');
  const veterinario = document.getElementById('veterinario');

  let isValid = true;

  if (!paciente.value.trim()) {
    document.getElementById('error-paciente').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('error-paciente').style.display = 'none';
  }

  if (!data.value) {
    document.getElementById('error-data').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('error-data').style.display = 'none';
  }

  if (!hora.value) {
    document.getElementById('error-hora').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('error-hora').style.display = 'none';
  }

  if (!veterinario.value) {
    document.getElementById('error-veterinario').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('error-veterinario').style.display = 'none';
  }

  if (isValid) {
    alert('Consulta agendada com sucesso!');
    document.getElementById('form-agendamento').submit();
  }
}