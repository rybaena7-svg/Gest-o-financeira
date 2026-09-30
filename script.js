let lancamentos =
    JSON.parse(localStorage.getItem("lancamentos")) || [];


const formulario =
    document.getElementById("formFinanceiro");


formulario.addEventListener("submit", function(event) {

    event.preventDefault();


    const descricao =
        document.getElementById("descricao").value.trim();


    const valor =
        Number(
            document.getElementById("valor").value
        );


    const tipo =
        document.getElementById("tipo").value;


    const categoria =
        document.getElementById("categoria").value;


    const data =
        document.getElementById("data").value;


    if (!descricao || valor <= 0) {

        alert("Preencha a descrição e o valor.");

        return;

    }


    const lancamento = {

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        tipo: tipo,

        categoria: categoria,

        data: data

    };


    lancamentos.push(lancamento);


    salvar();


    formulario.reset();


    atualizarTela();


    alert("Lançamento adicionado!");

});


function salvar() {

    localStorage.setItem(
        "lancamentos",
        JSON.stringify(lancamentos)
    );

}


function atualizarTela() {

    atualizarResumo();

    atualizarLancamentos();

    atualizarGrafico();

}


function atualizarResumo() {

    let receitas = 0;

    let despesas = 0;


    lancamentos.forEach(function(item) {

        if (item.tipo === "receita") {

            receitas += Number(item.valor);

        }

        if (item.tipo === "despesa") {

            despesas += Number(item.valor);

        }

    });


    const saldo =
        receitas - despesas;


    document.querySelector(".saldo")
        .textContent = dinheiro(saldo);


    document.querySelector(".receita")
        .textContent = dinheiro(receitas);


    document.querySelector(".despesa")
        .textContent = dinheiro(despesas);

}


function atualizarLancamentos() {

    const lista =
        document.getElementById(
            "listaLancamentos"
        );


    const filtro =
        document.getElementById(
            "filtro"
        ).value;


    let itens = lancamentos;


    if (filtro !== "todos") {

        itens = lancamentos.filter(
            function(item) {

                return item.tipo === filtro;

            }
        );

    }


    if (itens.length === 0) {

        lista.innerHTML = `
            <p class="vazio">
                Nenhum lançamento encontrado.
            </p>
        `;

        return;

    }


    lista.innerHTML = "";


    itens.slice().reverse().forEach(
        function(item) {

            const div =
                document.createElement("div");


            div.className =
                "lancamento";


            const sinal =
                item.tipo === "receita"
                    ? "+"
                    : "-";


            const classe =
                item.tipo === "receita"
                    ? "valor-receita"
                    : "valor-despesa";


            div.innerHTML = `

                <div>

                    <strong>
                        ${item.descricao}
                    </strong>

                    <br>

                    <small>
                        ${item.tipo === "receita"
                            ? "Receita"
                            : "Despesa"}

                        • ${item.categoria}

                        ${item.data
                            ? " • " + formatarData(item.data)
                            : ""}
                    </small>

                </div>


                <div>

                    <span class="${classe}">
                        ${sinal}
                        ${dinheiro(item.valor)}
                    </span>


                    <button
                        class="botao-excluir"
                        onclick="excluir(${item.id})"
                    >
                        Excluir
                    </button>

                </div>

            `;


            lista.appendChild(div);

        }
    );

}


function atualizarGrafico() {

    const grafico =
        document.getElementById(
            "graficoGastos"
        );


    const despesas =
        lancamentos.filter(
            function(item) {

                return item.tipo === "despesa";

            }
        );


    if (despesas.length === 0) {

        grafico.innerHTML = `
            <p class="vazio">
                Nenhuma despesa cadastrada.
            </p>
        `;

        return;

    }


    const categorias = {};


    despesas.forEach(function(item) {

        if (!categorias[item.categoria]) {

            categorias[item.categoria] = 0;

        }


        categorias[item.categoria] +=
            Number(item.valor);

    });


    const maior =
        Math.max(
            ...Object.values(categorias)
        );


    grafico.innerHTML = "";


    Object.entries(categorias).forEach(
        function([categoria, valor]) {

            const porcentagem =
                (valor / maior) * 100;


            const linha =
                document.createElement("div");


            linha.className =
                "categoria-grafico";


            linha.innerHTML = `

                <div class="categoria-topo">

                    <strong>
                        ${categoria}
                    </strong>

                    <span>
                        ${dinheiro(valor)}
                    </span>

                </div>


                <div class="barra-fundo">

                    <div
                        class="barra-gasto"
                        style="width:${porcentagem}%"
                    ></div>

                </div>

            `;


            grafico.appendChild(linha);

        }
    );

}


function excluir(id) {

    lancamentos =
        lancamentos.filter(
            function(item) {

                return item.id !== id;

            }
        );


    salvar();

    atualizarTela();

}


document.getElementById("filtro")
    .addEventListener(
        "change",
        atualizarLancamentos
    );


function dinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function formatarData(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


atualizarTela();