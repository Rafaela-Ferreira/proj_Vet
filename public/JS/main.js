function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const body = document.body;

    sidebar.classList.toggle('minimized');

    body.classList.toggle('sidebar-minimized');
}