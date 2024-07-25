import { pageLoad } from "../jogos/jogos.js";


async function loadContent(url, elementId = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const content = await response.text();
    if (elementId) {
      document.getElementById(elementId).innerHTML = content;
    } else {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const newContent = doc.querySelector("main").innerHTML;
      document.querySelector("main").innerHTML = newContent;
      window.history.pushState({}, "", url);
      await checkAndLoadScripts(url); // Espera a execução da função de carga dos scripts
    }
    return content;
  } catch (error) {
    console.error("Error loading content:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {

    await Promise.all([
      loadContent("/src/header/header.html", "header-container"),
      loadContent("/src/footer/footer.html", "footer-container"),
      loadContent("/src/modal/modal.html", "modal-container"),
    ]);

    const currentPath = window.location.pathname;
    await checkAndLoadScripts(currentPath); // Espera a execução da função de carga dos scripts

    const navLinks = {
      "/": "nav-home",
      "/src/jogos/jogos.html": "nav-jogos",
      "/src/sobre/sobre.html": "nav-sobre",
      "/src/contato/contato.html": "nav-contato",
    };

    document
      .getElementById("search-form")
      .addEventListener("submit", (event) => {
        console.log("busca");
        event.preventDefault(); // Impede o envio padrão do formulário
        const searchQuery = document.getElementById("nome-jogo").value.trim();
        if (searchQuery) {
          const url = `/src/jogos/jogos.html?nome-jogo=${encodeURIComponent(
            searchQuery
          )}`;
          loadContent(url); // Carrega a página de jogos com a consulta de busca
        }
      });

    let isLinkFound = false;
    for (const path in navLinks) {
      if (currentPath.endsWith(path)) {
        const navLink = document.getElementById(navLinks[path]);
        if (navLink) {
          navLink.classList.add("active");
          isLinkFound = true;
        }
        break;
      }
    }

    if (!isLinkFound) {
      console.warn("No matching navigation link found for the current URL.");
    }

    await applyNavEvents();
  } catch (error) {
    console.error("Error during initial page load:", error);
  }
});

async function checkAndLoadScripts(url) {
  if (!url) {
    console.error("Error: url is undefined");
    return;
  }

  if (url.includes("/src/jogos/jogos.html")) {
    console.log(url.includes("/src/jogos/jogos.html"));
    console.log("Carregando scripts para jogos.html");
    await loadScriptOnce("/src/jogos/jogos.js");
    pageLoad();
  }
}

async function loadScriptOnce(url) {
  if (!document.querySelector(`script[src="${url}"]`)) {
    const script = document.createElement("script");
    script.src = url;
    script.type = "module";
    script.setAttribute("data-dynamic", "true"); // Marcar script como dinâmico
    script.onload = () => console.log(`Script carregado: ${url}`);
    script.onerror = () => console.error(`Falha ao carregar o script: ${url}`);
    document.body.appendChild(script);
    // Aguarda a execução do script
    return new Promise((resolve) => {
      script.onload = () => resolve();
    });
  } else {
    console.log(`Script já carregado: ${url}`);
    return Promise.resolve();
  }
}

function removeOldScripts() {
  const oldScripts = document.querySelectorAll('script[data-dynamic="true"]');
  oldScripts.forEach((script) => {
    console.log(`Removendo script: ${script.src}`);
    script.remove();
  });
}

function applyNavEvents() {
  return new Promise((resolve) => {
    const navLinks = document.querySelectorAll("a.nav-link");
    navLinks.forEach((link) => {
      link.removeEventListener("click", handleNavLinkClick);
      link.addEventListener("click", handleNavLinkClick);
    });
    resolve(); 
  });
}

function handleNavLinkClick(event) {
  event.preventDefault();
  const url = event.target.href;
  document.querySelectorAll('a.nav-link').forEach((link) => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');

  loadContent(url)
    .then(() => applyNavEvents())
    .catch(console.error);
}

window.addEventListener("popstate", () => {
  const url = window.location.pathname;
  loadContent(url).catch(console.error);
});
