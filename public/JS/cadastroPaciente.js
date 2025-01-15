function exibirDados() {
    const nomeTutor = document.getElementById('nomeTutor').value;
    const telefoneTutor = document.getElementById('telefoneTutor').value;
    const emailTutor = document.getElementById('emailTutor').value || "Não informado";
    const nomePet = document.getElementById('nomePet').value;
    const especie = document.getElementById('especie').value;
    const peso = document.getElementById('peso').value || "kg";
    const fotoPet = document.getElementById('fotoPet').files[0];

    const resultDiv = document.getElementById('result');

    let fotoPetUrl = '';
    if (fotoPet) {
        fotoPetUrl = URL.createObjectURL(fotoPet);
    }

    // Verifica se está editando um cadastro
    const editIndex = document.getElementById("cadastroForm").dataset.editIndex;
    if (editIndex) {
        const pacienteDiv = document.getElementsByClassName("paciente-card")[editIndex];
        pacienteDiv.innerHTML = `
            <div class="texto">
                <h3>Pet: ${nomePet} (${especie})</h3>
                <p><strong>Tutor:</strong> ${nomeTutor}</p>
                <p><strong>Telefone:</strong> ${telefoneTutor}</p>
                <p><strong>E-mail:</strong> ${emailTutor}</p>
                <p><strong>Peso:</strong> ${peso} kg</p>
            </div>
            ${fotoPetUrl ? `<img src="${fotoPetUrl}" alt="Foto de ${nomePet}" class="foto-pet">` : ''}
            <button class="edit-btn" onclick="editarCadastro('${editIndex}')">Editar</button>
        `;
        delete document.getElementById("cadastroForm").dataset.editIndex; // Remove estado de edição
    } else {
        const pacienteDiv = document.createElement('div');
        pacienteDiv.classList.add('paciente-card');
        pacienteDiv.innerHTML = `
            <div class="texto">
                <h3>Pet: ${nomePet} (${especie})</h3>
                <p><strong>Tutor:</strong> ${nomeTutor}</p>
                <p><strong>Telefone:</strong> ${telefoneTutor}</p>
                <p><strong>E-mail:</strong> ${emailTutor}</p>
                <p><strong>Peso:</strong> ${peso} kg</p>
            </div>
            ${fotoPetUrl ? `<img src="${fotoPetUrl}" alt="Foto de ${nomePet}" class="foto-pet">` : ''}
            <button class="edit-btn" onclick="editarCadastro('${resultDiv.childElementCount}')">Editar</button>
        `;
        resultDiv.appendChild(pacienteDiv);
    }

    document.getElementById('cadastroForm').reset();
}

function carregarPacientes() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./XML/pacientes.xml", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const xml = xhr.responseXML;
            const pacientes = xml.getElementsByTagName("paciente");
            const resultSection = document.getElementById("result");
            resultSection.innerHTML = "";

            for (let i = 0; i < pacientes.length; i++) {
                const paciente = pacientes[i];
                const nomeTutor = paciente.getElementsByTagName("nomeTutor")[0]?.textContent || "Não informado";
                const telefoneTutor = paciente.getElementsByTagName("telefoneTutor")[0]?.textContent || "Não informado";
                const emailTutor = paciente.getElementsByTagName("emailTutor")[0]?.textContent || "Não informado";
                const nomePet = paciente.getElementsByTagName("nomePet")[0]?.textContent || "Desconhecido";
                const especie = paciente.getElementsByTagName("especie")[0]?.textContent || "Não especificado";
                const peso = paciente.getElementsByTagName("peso")[0]?.textContent || "kg";
                const fotoPet = paciente.getElementsByTagName("fotoPet")[0]?.textContent;

                // Use ícone do Bootstrap
                const fotoPetHtml = fotoPet
                    ? `<img src="${fotoPet}" alt="Foto de ${nomePet}" class="foto-pet">`
                    : `<i class="bi bi-person-circle foto-pet"></i>`; // Ícone do Bootstrap

                const pacienteDiv = document.createElement("div");
                pacienteDiv.classList.add("paciente-card");
                pacienteDiv.innerHTML = `
                    <div class="texto">
                        <h3>Pet: ${nomePet} (${especie})</h3>
                        <p><strong>Tutor:</strong> ${nomeTutor}</p>
                        <p><strong>Telefone:</strong> ${telefoneTutor}</p>
                        <p><strong>E-mail:</strong> ${emailTutor}</p>
                        <p><strong>Peso:</strong> ${peso} kg</p>
                    </div>
                    ${fotoPetHtml}
                `;

                resultSection.appendChild(pacienteDiv);
            }
        }
    };
    xhr.send();
}

// Carregar os pacientes ao abrir a página
document.addEventListener("DOMContentLoaded", carregarPacientes);

function editarCadastro(index) {
    const pacientes = document.getElementsByClassName("paciente-card");
    const paciente = pacientes[index];
    
    // Recupera os valores exibidos no cadastro
    const nomeTutor = paciente.querySelector('p:nth-child(2)').textContent.replace("Tutor: ", "");
    const telefoneTutor = paciente.querySelector('p:nth-child(3)').textContent.replace("Telefone: ", "");
    const emailTutor = paciente.querySelector('p:nth-child(4)').textContent.replace("E-mail: ", "");
    const nomePet = paciente.querySelector('h3').textContent.split(": ")[1].split(" (")[0];
    const especie = paciente.querySelector('h3').textContent.split("(")[1].replace(")", "");
    const peso = paciente.querySelector('p:nth-child(5)').textContent.replace("Peso: ", "").replace(" kg", "");

    // Preenche o formulário com os dados do paciente
    document.getElementById("nomeTutor").value = nomeTutor;
    document.getElementById("telefoneTutor").value = telefoneTutor;
    document.getElementById("emailTutor").value = emailTutor;
    document.getElementById("nomePet").value = nomePet;
    document.getElementById("especie").value = especie;
    document.getElementById("peso").value = peso;

    // Define o índice de edição no formulário
    document.getElementById("cadastroForm").dataset.editIndex = index;

    // Desloca a página para o formulário para facilitar a edição
    document.getElementById("cadastroForm").scrollIntoView({ behavior: "smooth" });
}