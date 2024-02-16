const stateSelect = document.getElementById("state-select");
const citySelect = document.getElementById("city-select")
const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const tableTitle = document.getElementById("city-table-head");
const body = document.querySelector("body");
const message = document.getElementById("message-content");


//Acesso à api para pegar os estados e fazer o primeiro select
fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then((response) =>{
            if(response.status!==200){
                throw new Error("Request Error");
            }
            return response.json();
        }) 
        .then(data => {   
            //Criei uma função para criar os estados
            stateSelectCreate(data);                    
})
.catch(error => {
    console.log(error);
});


//Acesso a api do IBGE para pegar as cidades com base no estado selecionado e fazer o select das cidades
stateSelect.addEventListener("change",function(){
    const UF = stateSelect.value;
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`)
    .then((response) =>{
            if(response.status!==200){
                throw new Error("Request Error");
            }
            return response.json();
        })   
    .then(data => {  
        citySelect.innerHTML="";
        citySelectCreate(data);              
        
    })
    .catch(error => {
        console.log(error);
    });
})


//Acesso agora a api do tempo do inmep para pegar as informações de acordo com a cidade selecionada
citySelect.addEventListener("change", function(){

    table.classList.remove("hidden");
    tbody.innerHTML = "";
    
    body.style.cursor ="wait";

    const idCity = citySelect.value;
    fetch(`https://apiprevmet3.inmet.gov.br/previsao/${idCity}`)
    .then((response) =>{
        if(response.status!==200){
            throw new Error ("Request Error");
        } return response.json();   
    })
    .then(data => {  
        //Agora para acessar os dados vou ter que fazer um for in para pegar o objeto de objetos com o id que eu passei
        //Depois dentro desse objeto como ele tem outro objeto dentro eu preciso fazer mais um for in para percorrê-lo e pegar os dados

        for (const key in data) {                  //Aqui esse key é o próprio id do munícipio e data é o json retornado pelo inmet
            for (const periodo in data[key]) {   //Agora tenho que percorrer esse objeto com esse id específico por isso o data[key]
               tableTitle.innerText = data[key][periodo].entidade;
                const diaAtual = periodo;          //Aqui coloquei numa constante para pegar a data e colocar na tabela   
                const dia = data[key][periodo];  // Coloquei isso em uma const pois vou ter usar algumas vezes, ele é objeto interno dentro do json do inmet, ou seja ele é cada um dos dias a partir do dia atual

                if (dia.hasOwnProperty('manha')) {  //Agora eu vou ver se ele tem a propriedade manha (se tiver ele tem manha, tarde e noite, e com isso vou acessar cada um dos dados do objeto com o suo do ponto .
                
                    // //Como vai se repetir para cada um dos períodos manhã, tarde e noite, vou tentar criar uma função com parâmetros
                        criarLinhaTabelaComPeriodo(dia, 'manha', diaAtual);
                        criarLinhaTabelaComPeriodo(dia, 'tarde', diaAtual);
                        criarLinhaTabelaComPeriodo(dia, 'noite', diaAtual);

                       // Quero colocar uma mensagem de requisição realizada com sucesso ou falha mas ela vai se repetir vou transformar em um função
                       showMessage("success","Requisição realizada com sucesso");


                        // message.innerText = "Requisição realizada com sucesso";
                        // message.classList.add("success");
                        // message.classList.remove("hidden");

                        // //Quero que a mensagem suma depois de um segundo
                        // setTimeout(() => {
                        //     message.classList.add("hidden");
                        //     message.classList.remove("success");
                        // }, 1000);

            } else {
                criarLinhaTabelaSemPeriodo(dia, diaAtual);

                showMessage("success","Requisição realizada com sucesso");
            }
          }
        }
    })
    .catch(error => {

        showMessage("fail","Falha na requisição");

        console.log(error);
    })
    .finally(() => {
        body.style.cursor ="default";
        
    });
   
})

function showMessage(status, statusMessage){

            message.innerText = statusMessage;
            message.classList.add(status);
            message.classList.remove("hidden");

            setTimeout(() => {
                message.classList.add("hidden");
                message.classList.remove(status);
            }, 1000);
}


function stateSelectCreate(data){
    const selectOption = document.createElement("option");
    selectOption.innerText = "Selecione um estado";
    selectOption.selected = true;
    selectOption.disabled = true;
    stateSelect.appendChild(selectOption);
    //Primeiro criei o select dos estados com um for
    for(let i=0;i<data.length;i++){
        const option = document.createElement("option");
        option.innerText = data[i].nome;
        option.value = data[i].sigla;
        option.id = data[i].id;
        stateSelect.appendChild(option);
    }
}

function citySelectCreate(data){
    const selectOption = document.createElement("option");
    selectOption.innerText = "Selecione um munícipio";
    selectOption.selected = true;
    selectOption.disabled = true;
    citySelect.appendChild(selectOption);

    //Primeiro criei o select dos estados com um for
    for(let i=0;i<data.length;i++){
        const option = document.createElement("option");
        option.innerText = data[i].nome;
        option.value = data[i].id;
        option.id = data[i].id;
        citySelect.appendChild(option);
    }
}

// Função para criar linhas na tabela quando tem períodos manhã tarde e noite
//Fui quebrando a cabeça pra montar uma função e tava errando ao não passar o diaAtual como parâmetro!!!!!  Erro besta!!
//data é o objeto já  dentro do dia com os períodos manha, tarde, noite
function criarLinhaTabelaComPeriodo(data, periodo, diaAtual) {
    //Nessa função como tem período manhã tarde e noite eu não posso pegar os dados direto de data, tenho que antes "entrar" no período passado, tipo data[manha].pega_o_que_quer   nas que não têm período posso acessar direto só com um ponto data.temp_min por exemplo
    const tr = document.createElement("tr");        
    const tdData = document.createElement("td");
    tdData.innerText = diaAtual;
    
    const tdPeriodo = document.createElement("td");

    if(periodo==='manha'){
        tdPeriodo.innerText = "Manhã";   
    } else if(periodo==='tarde'){
        tdPeriodo.innerText = "Tarde";  
    } else{
        tdPeriodo.innerText = "Noite";  
    }
   
    const tdDiaSemana = document.createElement("td");
    tdDiaSemana.innerText = data[periodo].dia_semana;

    const tdIcone = document.createElement("td");
    const imgIcone = document.createElement("img");
    imgIcone.src = data[periodo].icone;
    tdIcone.appendChild(imgIcone);

    const tdResumo = document.createElement("td");
    tdResumo.innerText = data[periodo].resumo;

    const tdTempMin = document.createElement("td");
    tdTempMin.innerText = data[periodo].temp_min;

    const tdTempMax = document.createElement("td");
    tdTempMax.innerText = data[periodo].temp_max;

    tr.appendChild(tdData);
    tr.appendChild(tdPeriodo);
    tr.appendChild(tdDiaSemana);
    tr.appendChild(tdIcone);
    tr.appendChild(tdResumo);
    tr.appendChild(tdTempMin);
    tr.appendChild(tdTempMax);

    tbody.appendChild(tr);
}


function criarLinhaTabelaSemPeriodo(data, diaAtual) {
    const tr = document.createElement("tr");        
    const tdData = document.createElement("td");
    tdData.innerText = diaAtual;

    const tdPeriodo = document.createElement("td");
    tdPeriodo.innerText = "";  //Como aqui não tem período vou deixá-lo vazio
   
    const tdDiaSemana = document.createElement("td");
    tdDiaSemana.innerText = data.dia_semana;

    const tdIcone = document.createElement("td");
    const imgIcone = document.createElement("img");
    imgIcone.src = data.icone;
    tdIcone.appendChild(imgIcone);

    const tdResumo = document.createElement("td");
    tdResumo.innerText = data.resumo;

    const tdTempMin = document.createElement("td");
    tdTempMin.innerText = data.temp_min;

    const tdTempMax = document.createElement("td");
    tdTempMax.innerText = data.temp_max;

    tr.appendChild(tdData);
    tr.appendChild(tdPeriodo);
    tr.appendChild(tdDiaSemana);
    tr.appendChild(tdIcone);
    tr.appendChild(tdResumo);
    tr.appendChild(tdTempMin);
    tr.appendChild(tdTempMax);

    tbody.appendChild(tr);
}
