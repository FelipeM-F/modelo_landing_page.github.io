async function loadContent(url, elementId) {
    const response = await fetch(url);
    const content = await response.text();
    document.getElementById(elementId).innerHTML = content;
    return content;
}

Promise.all([
    loadContent('/modelo_landing_page.github.io/src/header/header.html', 'header-container'),
    loadContent('/modelo_landing_page.github.io/src/footer/footer.html', 'footer-container')
]).then(() => {
    document.getElementById('user-icon').addEventListener('click', () => {
        const userMenu = document.getElementById('user-menu');
        userMenu.classList.toggle('hidden');
        userMenu.classList.toggle('show');
    });
}).catch(error => {
    console.error('Error loading content:', error);
});