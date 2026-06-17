let isMobile = window.matchMedia("(max-width: 768px)").matches;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isMobile) {
  document.querySelectorAll("video").forEach(v => {
    v.setAttribute("preload", "none");
  });
}

if (isMobile || reduceMotion) {
  console.log("modo leve ativado");
}

window.addEventListener("resize", () => {
  isMobile = window.matchMedia("(max-width: 768px)").matches;
});

const musica = document.getElementById('musica');
const modal = document.getElementById("videoModal");
const player = document.getElementById("videoPlayer");

const cards = document.querySelectorAll('.card');
const containerIndicadores = document.querySelector('.indicadores');

let indexAtual = 0;
let musicaAtiva = true;
let animando = false;
let desbloqueando = false;
let jaEscreveu = false;
let startX = 0;
let bolinhas = [];

function ativarVideoAtivo(index) {
  cards.forEach((card, i) => {
    const video = card.querySelector("video");
    if (!video) return;

    if (i === index) {
      if (video.getAttribute("preload") === "none") {
        video.setAttribute("preload", "metadata");
        video.load();
      }
    } else {
      video.pause();
    }
  });
}

function pausarTodosVideos() {
  document.querySelectorAll("video").forEach(v => {
    v.pause();
  });
}

function abrirModal(src) {
  pausarTodosVideos();
  modal.classList.add("ativo");
  player.src = src;
  player.currentTime = 0;
  player.play();
}

function fecharModal() {
  pausarTodosVideos();
  modal.classList.remove("ativo");
  player.pause();
  player.src = "";
  atualizarCarousel();
}

document.querySelector(".fechar").addEventListener("click", fecharModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

function desbloquear() {
  if (desbloqueando) return;
  desbloqueando = true;

  document.querySelector(".galeria").classList.add("show");
  document.body.classList.remove("lock");

  if (isMobile){
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
  }

  musica.volume = 0;
  musica.play().then(() => {
    let vol = 0;
    const fade = setInterval(() => {
      if (vol < 0.03) {
        vol += 0.002;
        musica.volume = vol;
      } else {
        clearInterval(fade);
      }
    }, 200);
  }).catch(e => console.log("Áudio bloqueado pelo navegador"));

  requestAnimationFrame(() => {
    const section = document.getElementById("gallery");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });

  setTimeout(() => {
    document.getElementById("btn-musica").style.display = "flex";
    desbloqueando = false;
  }, 1000);
}

function atualizarCarousel() {
  if (animando) return;
  animando = true;

  const total = cards.length;
  const esquerda = (indexAtual - 1 + total) % total;
  const direita = (indexAtual + 1) % total;

  cards.forEach((card, i) => {
    if (i === esquerda)        card.className = "card left";
    else if (i === indexAtual) card.className = "card active";
    else if (i === direita)    card.className = "card right";
    else                       card.className = "card hidden";
  });

  ativarVideoAtivo(indexAtual);

  const videoAtivo = cards[indexAtual].querySelector("video");
  if (videoAtivo && document.visibilityState === "visible" && !modal.classList.contains("ativo")) {
    videoAtivo.loop = true;
    videoAtivo.currentTime = 0;
    videoAtivo.play().catch(() => {});
  }

  atualizarBolinhas();

  setTimeout(() => {
    animando = false;
  }, 700);
}

function trocarCard(card) {
  if (animando) return;

  if (card.classList.contains("active")) {
    abrirModal(card.querySelector("video").src);
    return;
  }

  if (card.classList.contains("right")) {
    indexAtual = (indexAtual + 1) % cards.length;
  } else if (card.classList.contains("left")) {
    indexAtual = (indexAtual - 1 + cards.length) % cards.length;
  }

  atualizarCarousel();
}

function abrirVideo(event, btn) {
  event.stopPropagation();
  const card = btn.closest('.card');
  abrirModal(card.querySelector('video').src);
}

function criarIndicadores() {
  containerIndicadores.innerHTML = '';
  bolinhas = [];

  cards.forEach((_, i) => {
    const bolinha = document.createElement('span');
    if (i === indexAtual) bolinha.classList.add('ativo');

    bolinha.addEventListener('click', () => {
      indexAtual = i;
      atualizarCarousel();
    });

    containerIndicadores.appendChild(bolinha);
    bolinhas.push(bolinha);
  });
}

function atualizarBolinhas() {
  bolinhas.forEach((b, i) => {
    b.classList.toggle('ativo', i === indexAtual);
  });
}

document.querySelector('.carousel').addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

document.querySelector('.carousel').addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) < 40) return;

  indexAtual = diff > 0
    ? (indexAtual + 1) % cards.length
    : (indexAtual - 1 + cards.length) % cards.length;

  atualizarCarousel();
});

function toggleMusica() {
  const icon = document.querySelector("#btn-musica i");

  if (musicaAtiva) {
    musica.pause();
    icon.className = "fa-solid fa-volume-xmark";
  } else {
    musica.play();
    icon.className = "fa-solid fa-volume-high";
  }

  musicaAtiva = !musicaAtiva;
}

function abrirCarta(el) {
  el.classList.toggle("aberto");
}

window.addEventListener("DOMContentLoaded", () => {

  window.scrollTo(0,0);

  if (isMobile){
    document.body.style.position="fixed";
    document.body.style.top="0";
    document.body.style.left="0";
    document.body.style.right="0";
    document.body.style.width="100%";
  } else {
    document.body.classList.add("lock");
  }

  cards.forEach(card=>{
    const video = card.querySelector("video");
    if(video){
      video.setAttribute("preload","none");
    }
  });

  atualizarCarousel();
  criarIndicadores();

});

function abrirModal2(src) {
  const modal2 = document.getElementById("videoModal2");
  const player2 = document.getElementById("videoPlayer2");

  pausarTodosVideos();
  modal2.classList.add("ativo");
  player2.src = src;
  player2.currentTime = 0;
  player2.play();
}

function fecharModal2() {
  const modal2 = document.getElementById("videoModal2");
  const player2 = document.getElementById("videoPlayer2");

  modal2.classList.remove("ativo");
  player2.pause();
  player2.src = "";
}

document.getElementById("videoModal2").addEventListener("click", (e) => {
  if (e.target === document.getElementById("videoModal2")) fecharModal2();
});

const observerOptions = {
  threshold: 0.3
};

const transicoes = document.querySelectorAll('.transicao, .transicao2');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
}, { threshold: 0.2 });

transicoes.forEach(el => observer.observe(el));

const envelope = document.querySelector(".envelope");
const cenaCartaSection = document.querySelector(".cena-carta");

const observerCarta = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (envelope && !entry.isIntersecting) {
      envelope.classList.remove("aberto");
    }
  });
}, { threshold: 0.3 });

if (cenaCartaSection) {
  observerCarta.observe(cenaCartaSection);
}

function typeWriter(element, text, speed = 30) {
  if (!element) return;
  element.innerHTML = "";
  let i = 0;

  function escrever() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(escrever, speed);
    }
  }

  escrever();
}

const cenaCarta = document.querySelector(".cena-carta");

const observerTexto = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !jaEscreveu) {
      jaEscreveu = true;

      if (isMobile) {
        document.getElementById("frase-esq-1").innerHTML =
          "Entre todos os dias,<br>eu escolheria você outra vez.";
        document.getElementById("frase-dir-1").innerHTML =
          "Coisas pequenas que<br>viraram eternas.";
      } else {
        typeWriter(
          document.getElementById("frase-esq-1"),
          "Entre todos os dias,\neu escolheria você outra vez.",
          50
        );
        typeWriter(
          document.getElementById("frase-dir-1"),
          "Coisas pequenas que \n viraram eternas.",
          50
        );
      }
    }
  });
}, observerOptions);

if (cenaCarta) {
  observerTexto.observe(cenaCarta);
}

const btn = document.getElementById("btn-desbloquear");

btn.addEventListener("click", () => {
  if (isMobile) return;

  const rect = btn.getBoundingClientRect();

  for (let i = 0; i < 6; i++) {
    const particula = document.createElement("span");
    particula.classList.add("particula");

    const size = Math.random() * 4 + 3;
    particula.style.width = size + "px";
    particula.style.height = size + "px";

    const cores = ["#ffe08a", "#ffd700", "#ffcc66", "#fff2b2"];
    particula.style.background = cores[Math.floor(Math.random() * cores.length)];

    const offsetX = (Math.random() - 0.5) * rect.width * 1.2;
    const offsetY = (Math.random() - 0.5) * rect.height * 1.2;

    const startXp = rect.left + rect.width / 2 + offsetX;
    const startYp = rect.top + rect.height / 2 + offsetY;

    particula.style.left = startXp + "px";
    particula.style.top = startYp + "px";

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 80 + 40;

    particula.style.setProperty("--x", Math.cos(angle) * distance + "px");
    particula.style.setProperty("--y", Math.sin(angle) * distance + "px");

    document.body.appendChild(particula);

    setTimeout(() => particula.remove(), 900);
  }
});

const sessao = document.querySelector('.sessao-musica');

const observer1 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sessao.classList.add('ativo');
    }
  });
}, { threshold: 0.3 });

observer1.observe(sessao);

function voltarInicio() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  transicoes.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("show");
    }
  });
});