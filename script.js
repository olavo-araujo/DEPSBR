let searchButton = document.getElementById("searchButton");
let searchInput = document.getElementById("searchInput");
let deputadosContainer = document.getElementById("deputadosContainer");

searchButton.addEventListener("click", () => {
  const query = searchInput.value;
  fetchDeputados(query);
});

function fetchDeputados(query = "") {
  let limit = window.matchMedia("(max-width: 425px)").matches ? 1 : 4;
  fetch("https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + query)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      displayDeputados(data.dados.slice(0, limit));
    })
    .catch(function(error) {
      console.log("Erro na fetch dos deputados: " + error)
    })
}

function displayDeputados(deputados) {
  deputadosContainer.innerHTML = ""
  if (deputados.length === 0) {
    var notfound = document.createElement("p");
    notfound.innerHTML = "Nenhum deputado encontrado."
    deputadosContainer.appendChild(notfound)
  } else {
    deputados.forEach(function(deputado) {
      var deputadoCard = document.createElement('div');
      deputadoCard.classList.add('deputado-card');
      deputadoCard.innerHTML = `
    <img src="${deputado.urlFoto}" alt="${deputado.nome}">
    <h3>${deputado.nome}</h3>
    <p id="ppartido"><strong>(${deputado.siglaPartido} — ${deputado.siglaUf})</strong></p>
    <p id="pdetalhes">Detalhes:</p>
    <div class="detalhes">
    <p>☉ Legislaturas em que exerceu mandato:<strong> ${deputado.idLegislatura}</strong></p>
    <p>☉ Partidos pelos quais ja foi deputado:<strong> ${deputado.siglaPartido}</strong></p>
    </div>
  `;
      deputadosContainer.appendChild(deputadoCard)
    });
  }
}

fetchDeputados();

/* EVENTOS - API */

document.getElementById("buscarBtn").addEventListener("click", buscarEventos);
document.getElementById("eventosSemanaBtn").addEventListener("click", buscarEventosSemana)

function buscarEventos() {
  let descricao = document.getElementById("descricaoEvento").value
  let data = document.getElementById("dataEvento").value
  let url = `https://dadosabertos.camara.leg.br/api/v2/eventos?dataInicio=${data}&dataFim=${data}&ordem=ASC&ordenarPor=dataHoraInicio`

  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarEventos(data.dados, descricao);
      ajustarAlturaSessao();
      esconderBotaoEventosSemana();
    })
    .catch(error => console.error("Erro ao buscar eventos:", error))
}

function buscarEventosSemana() {
  let hoje = new Date()
  let dataInicio = formatarData(hoje)
  let dataFim = formatarData(new Date(hoje.setDate(hoje.getDate() + 7)))
  let url = `https://dadosabertos.camara.leg.br/api/v2/eventos?dataInicio=${dataInicio}&dataFim=${dataFim}&ordem=ASC&ordenarPor=dataHoraInicio`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarEventos(data.dados);
      ajustarAlturaSessao();
      esconderBotaoEventosSemana();
    })
    .catch(error => console.error("Erro ao buscar eventos:", error))
}

function mostrarEventos(eventos, descricaoFiltro = "") {
  let listaEventos = document.getElementById('eventosList');
  listaEventos.innerHTML = "";
  if (eventos.length === 0) {
    let EventNotFound = document.createElement('p');
    EventNotFound.textContent = "Nenhum evento encontrado.";
    listaEventos.appendChild(EventNotFound);
  } else {
    eventos.forEach(evento => {
      if (descricaoFiltro && !evento.descricao.toLowerCase().includes(descricaoFiltro.toLowerCase())) {
        return;
      }

      let eventoItem = document.createElement("div");
      eventoItem.classList.add("evento-item");

      let titulo = document.createElement("h3");
      titulo.textContent = evento.descricao;

      let data = document.createElement("p");
      data.textContent = `Data: ${evento.dataHoraInicio.split('T')[0]} | Hora: ${evento.dataHoraInicio.split('T')[1].substring(0, 5)}`;

      let local = document.createElement("p");
      local.textContent = `Local: ${evento.localCamara.nome}`;

      eventoItem.appendChild(titulo);
      eventoItem.appendChild(data);
      eventoItem.appendChild(local);

      listaEventos.appendChild(eventoItem);
    });
  }
}

function formatarData(data) {
  let dia = String(data.getDate()).padStart(2, '0');
  let mes = String(data.getMonth() + 1).padStart(2, '0');
  let ano = data.getFullYear();
  return `${ano}-${mes}-${dia}`;
}

function ajustarAlturaSessao() {
  let sessaoEventos = document.querySelector('.sessaoEventos');
  let listaEventos = document.getElementById('eventosList');
  let alturaNecessaria = listaEventos.scrollHeight + 200;
  let marginBottom = 30;

  sessaoEventos.style.height = (alturaNecessaria + marginBottom) + 'px';
}

function esconderBotaoEventosSemana() {
  let botaoEventosSemana = document.getElementById("eventosSemanaBtn");
  botaoEventosSemana.classList.add("hidden");
}

/* FORMULARIO */

document.getElementById("formContato").addEventListener("submit", function(event) {
  event.preventDefault()

  let nome = document.getElementById("nome").value
  let email = document.getElementById("email").value
  let mensagem = document.getElementById("mensagem").value

  if (!nome || !email || !mensagem) {
    alert("Por favor, preencha todos os campos do formulário.")
    return
  }

  if (mensagem.length > 500) {
    alert("A mensagem não pode ter mais de 500 caracteres.")
    return
  }

  if (!validarEmail(email)) {
    alert("Por favor, insira um email válido.")
    return
  }

  alert("Mensagem enviada com sucesso!")
})

function validarEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

document.getElementById("mensagem").addEventListener("input", function() {
  let maxLenght = 500
  let currentLenght = this.value.length
  let remainingLenght = maxLenght - currentLenght
  document.getElementById("counter").textContent = `${remainingLenght} caracteres restantes`
})