function alternarMenu() {
    const menu = document.getElementById('dropdown-tema');
    menu.classList.toggle('show');
}

function definirTema(tema) {
    if (tema === 'dark') {
        document.body.className = 'dark-mode';
    } else {
        document.body.className = '';
    }
}

document.addEventListener('click', function (evento) {
    const menu = document.getElementById('dropdown-tema');
    if (!menu.contains(evento.target) && !evento.target.matches('.theme-button')) {
        menu.classList.remove('show');
    }
});

