document.addEventListener('DOMContentLoaded', () => {
    const stereotypesListContainer = document.getElementById('stereotypes-list');
    const btnGenerateTxt = document.getElementById('btn-generate-txt');
    const btnGeneratePdf = document.getElementById('btn-generate-pdf');

    // Lista de descrições dos estereótipos
    const stereotypes = [
        "Nome de cara que usa corrente grossa de prata e faz roleta-russa com energético",
        "Nome de mulher que foi casada com um PM e agora só namora bandido",
        "Nome de motoboy que some no meio da entrega porque parou pra jogar sinuca no bar",
        "Nome de eletricista que desliga o relógio de luz para você \"não gastar nada\"",
        "Nome de velho que aposta no jogo do bicho e sempre erra por um número",
        "Nome de jovem revolucionário que nunca trabalhou, mas tem opiniões fortes sobre o proletariado",
        "Nome de professor de geografia que tem uma garrafa térmica de café e uma mochila de couro gasta",
        "Nome de coach quântico que fala sobre \"desbloquear a abundância\" e não paga pensão",
        "Nome de amiga que já pegou dois primos na mesma festa e se orgulha disso",
        "Nome de estagiário que sempre fala \"Posso dar uma sugestão?\" e nunca deveria dar",
        "Nome de dono de bar que diz que \"barraco a gente resolve na conversa\" e sempre apanha no próprio bar",
        "Nome de criança que ainda usa fralda, mas já xinga os outros na rua",
        "Nome de tio que diz \"Já viu no YouTube?\" como solução pra qualquer problema",
        "Nome de mulher que vende Rifa de Air Fryer e depois some com o dinheiro",
        "Nome de cara que usa camisa de time falsificada e sempre fala \"E aí, chefe?\"",
        "Nome de síndico que gosta de espalhar poder e sempre manda mensagem no grupo do condomínio às 6h da manhã",
        "Nome de corretor de imóveis que promete um apartamento maior e mais barato do que existe na realidade",
        "Nome de tia que vende geladinho gourmet e diz que é \"sua última chance\" toda semana",
        "Nome de tio que finge que entende de política, mas só repete o que viu no rádio AM",
        "Nome de sobrinho que pediu dinheiro emprestado e sumiu depois"
    ];

    // Função para criar os campos de input na página
    function renderStereotypes() {
        stereotypes.forEach((desc, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('stereotype-item');

            const descP = document.createElement('p');
            descP.textContent = desc;
            // Guardamos a descrição original num atributo para fácil acesso depois
            descP.dataset.originalDescription = desc;

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Digite um nome...');
            // Usamos um data-attribute para identificar o input associado à descrição
            input.dataset.stereotypeIndex = index;

            itemDiv.appendChild(descP);
            itemDiv.appendChild(input);
            stereotypesListContainer.appendChild(itemDiv);
        });
    }

    // Função para coletar os dados dos inputs
    function gatherData() {
        const results = [];
        const items = stereotypesListContainer.querySelectorAll('.stereotype-item');
        items.forEach(item => {
            const descElement = item.querySelector('p');
            const inputElement = item.querySelector('input');

            results.push({
                description: descElement.dataset.originalDescription,
                name: inputElement.value.trim() || "[Não preenchido]" // Usa placeholder se vazio
            });
        });
        return results;
    }

    // Função para gerar a string do relatório formatado
    function generateReportString(data) {
        let report = "MEU BATISMO DE ESTEREÓTIPOS:\n";
        report += "=================================\n\n";

        data.forEach(item => {
            report += `--- ${item.description} ---\n`;
            report += `Nome: ${item.name}\n\n`;
        });

        report += "=================================\n";
        report += "Gerado por Nomeia Aí!\n"; // Adicione o link do seu site aqui se quiser

        return report;
    }

    // Função para baixar arquivo TXT
    function downloadTxt(filename, text) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // Event Listener para o botão TXT
    btnGenerateTxt.addEventListener('click', () => {
        const data = gatherData();
        if (data.length > 0) {
            const reportText = generateReportString(data);
            downloadTxt('meus_nomes_estereotipos.txt', reportText);
        } else {
            alert("Preencha pelo menos um nome antes de gerar o relatório.");
        }
    });

    // Event Listener para o botão PDF
    btnGeneratePdf.addEventListener('click', () => {
        const data = gatherData();
        if (data.length === 0) {
             alert("Preencha pelo menos um nome antes de gerar o relatório.");
             return;
        }

        // Importa jsPDF do objeto window (carregado via CDN)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 15; // Posição Y inicial (margem superior)
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        const lineHeight = 7; // Espaçamento entre linhas

        doc.setFontSize(16);
        doc.text("MEU BATISMO DE ESTEREÓTIPOS", margin, y);
        y += lineHeight * 2;
        doc.setFontSize(11);

        data.forEach(item => {
            // Verifica se o conteúdo cabe na página atual
            const descriptionLines = doc.splitTextToSize(item.description, doc.internal.pageSize.width - margin * 2);
            const nameLine = `Nome: ${item.name}`;
            const requiredHeight = (descriptionLines.length * lineHeight) + lineHeight + (lineHeight * 1.5); // Descrição + Nome + Espaço

            if (y + requiredHeight > pageHeight - margin) {
                doc.addPage();
                y = margin; // Reseta Y para a margem superior na nova página
            }

            // Adiciona a descrição (pode quebrar linha)
            doc.setFont(undefined, 'bold'); // Deixa a descrição em negrito
            doc.text(descriptionLines, margin, y);
            y += descriptionLines.length * lineHeight;
            doc.setFont(undefined, 'normal'); // Volta ao normal para o nome

            // Adiciona o nome
            doc.text(nameLine, margin, y);
            y += lineHeight * 1.5; // Adiciona um espaço extra entre os itens
        });

        // Adiciona rodapé (simples) na última página
        const pageCount = doc.internal.getNumberOfPages();
        doc.setPage(pageCount);
        doc.setFontSize(8);
        doc.text(`Gerado por Nomeia Aí! - Página ${pageCount}`, margin, pageHeight - 10);


        doc.save('meus_nomes_estereotipos.pdf');
    });

    // Inicializa a página criando os campos
    renderStereotypes();
});
