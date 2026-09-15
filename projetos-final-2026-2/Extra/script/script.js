document.addEventListener("DOMContentLoaded", () => {
    const audioBtn = document.getElementById("toggle-audio-btn");
    const bgAudio = document.getElementById("bg-audio");
    const searchInput = document.getElementById("search-input");
    const app = document.getElementById("app");

    // Salva o conteúdo inicial da galeria
    const homeContent = app ? app.innerHTML : "";

    // 1. Alternar Áudio (Corrigido)
    function alternarAudio() {
        const audio = document.getElementById("bg-audio");
        const btn = document.getElementById("toggle-audio-btn");
        if (!audio) return;

        if (audio.paused) {
            audio.play()
                .then(() => {
                    if (btn) btn.textContent = "🔇 Pausar Música";
                })
                .catch((err) => console.error("Erro ao reproduzir áudio:", err));
        } else {
            audio.pause();
            if (btn) btn.textContent = "🔊 Ouvir Música";
        }
    }

    // 2. Filtro de busca dos cards
    function inicializarFiltro() {
        const input = document.getElementById("search-input");
        if (!input) return;

        input.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll(".card");

            cards.forEach((card) => {
                const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
                const description = card.querySelector("p")?.textContent.toLowerCase() || "";

                if (title.includes(term) || description.includes(term)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // 3. Animação de entrada dos cards
    function inicializarAnimacoes() {
        const cards = document.querySelectorAll(".card");
        if (!cards.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("card-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cards.forEach((card) => {
            card.classList.add("card-hidden");
            observer.observe(card);
        });
    }

    // 4. Carregamento de páginas internas via Fetch
    async function carregarPagina(url, pushState = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao carregar");

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const contInput = document.querySelector(".controles");

            if (url.endsWith("index.html") || url.endsWith("/")) {
                app.innerHTML = homeContent;
                if (contInput) contInput.style.display = "flex";
                inicializarFiltro();
                inicializarAnimacoes();
            } else {
                const novoConteudo = doc.querySelector(".container") || doc.body;
                app.innerHTML = novoConteudo.innerHTML;
                if (contInput) contInput.style.display = "none";
            }

            if (pushState) {
                history.pushState({ url }, "", url);
            }

            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Redirecionando via navegador por erro no fetch:", error);
            window.location.href = url;
        }
    }

    // Evento no botão de áudio
    if (audioBtn) {
        audioBtn.addEventListener("click", alternarAudio);
    }

    // Interceptação de links para navegação SPA
    document.body.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (href && (href.endsWith(".html") || href.includes("index.html"))) {
            e.preventDefault();
            carregarPagina(link.href);
        }
    });

    // Navegação no histórico (Avançar/Voltar)
    window.addEventListener("popstate", (e) => {
        if (e.state && e.state.url) {
            carregarPagina(e.state.url, false);
        } else {
            carregarPagina(window.location.pathname, false);
        }
    });

    inicializarFiltro();
    inicializarAnimacoes();
});