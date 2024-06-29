<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Significados no tarô</title>
    <style>
        body {
            font-family: Roboto, sans-serif;
            font-size: 16px;
            margin: 20px;
            color: white; 
            background-color: black;
           line-height: 0.7;
        }
        p {
        	margin-top: 2px;
			margin-bottom: 2px;
        }
        h1 {
        	font-size: 18px;
        }
        .menu-section {
            margin-bottom: 20px;
        }
        .sentidos {
            margin-left: 20px;
            margin-top: 2px;
            margin-bottom: 2px;
            font-size: 12px;
            line-height: 0.7;
        }
    </style>
</head>
<body>
    <h1>Selecione as cartas</h1>

    <div class="menu-section">
        <label for="menu1">Carta 1:</label>
        <select id="menu1" onchange="updateSentidos('menu1', 'sentidos1')">
           <option value="">Selecione</option>
<option value="Mago">Mago</option>
<option value="Louco">Louco</option>
<option value="Papisa">Papisa</option>
<option value="Imperatriz">Imperatriz</option>
<option value="Imperador">Imperador</option>
<option value="Papa">Papa</option>
<option value="Amante">Amante</option>
<option value="Carro">Carro</option>
<option value="Justiça">Justiça</option>
<option value="Eremita">Eremita</option>
<option value="Roda">Roda</option>
<option value="Força">Força</option>
<option value="Enforcado">Enforcado</option>
<option value="Morte">Morte</option>
<option value="Temperança">Temperança</option>
<option value="Diabo">Diabo</option>
<option value="Torre">Torre</option>
<option value="Estrela">Estrela</option>
<option value="Lua">Lua</option>
<option value="Sol">Sol</option>
<option value="Julgamento">Julgamento</option>
<option value="Mundo">Mundo</option>
</select>
        <div id="sentidos1" class="sentidos"></div>
    </div>

    <div class="menu-section">
        <label for="menu2">Carta 2:</label>
        <select id="menu2" onchange="updateSentidos('menu2', 'sentidos2')">
<option value="">Selecione</option>
<option value="Mago">Mago</option>
<option value="Louco">Louco</option>
<option value="Papisa">Papisa</option>
<option value="Imperatriz">Imperatriz</option>
<option value="Imperador">Imperador</option>
<option value="Papa">Papa</option>
<option value="Amante">Amante</option>
<option value="Carro">Carro</option>
<option value="Justiça">Justiça</option>
<option value="Eremita">Eremita</option>
<option value="Roda">Roda</option>
<option value="Força">Força</option>
<option value="Enforcado">Enforcado</option>
<option value="Morte">Morte</option>
<option value="Temperança">Temperança</option>
<option value="Diabo">Diabo</option>
<option value="Torre">Torre</option>
<option value="Estrela">Estrela</option>
<option value="Lua">Lua</option>
<option value="Sol">Sol</option>
<option value="Julgamento">Julgamento</option>
<option value="Mundo">Mundo</option>
</select> 
        <div id="sentidos2" class="sentidos"></div>
    </div>

    <div class="menu-section">
        <label for="menu3">Carta 3:</label>
        <select id="menu3" onchange="updateSentidos('menu3', 'sentidos3')">
<option value="">Selecione</option>
<option value="Mago">Mago</option>
<option value="Louco">Louco</option>
<option value="Papisa">Papisa</option>
<option value="Imperatriz">Imperatriz</option>
<option value="Imperador">Imperador</option>
<option value="Papa">Papa</option>
<option value="Amante">Amante</option>
<option value="Carro">Carro</option>
<option value="Justiça">Justiça</option>
<option value="Eremita">Eremita</option>
<option value="Roda">Roda</option>
<option value="Força">Força</option>
<option value="Enforcado">Enforcado</option>
<option value="Morte">Morte</option>
<option value="Temperança">Temperança</option>
<option value="Diabo">Diabo</option>
<option value="Torre">Torre</option>
<option value="Estrela">Estrela</option>
<option value="Lua">Lua</option>
<option value="Sol">Sol</option>
<option value="Julgamento">Julgamento</option>
<option value="Mundo">Mundo</option>
</select>
        </select>
        <div id="sentidos3" class="sentidos"></div>
    </div>

    <script>
        const sentidosMap = {
            
'Louco': ['Grande viagem',
'Longa caminhada',
'Loucura',
'Errância',
'Instabilidade',
'Irresponsável',
'Não pretence ao grupo',
'Ir embora',
'Imaginação exuberante',
'Alegria de viver',
'Liberação',
'Peregrinação',
'Sem domicílio fixo',
'Mendigo sagrado',
'Bufão ou saltimbanco',
'Nômade ou emigrante',
'Delírio',
'Necessidade de agir',
'Vitalidade',
'Liberdade',
'Idealismo',
'Profeta',
'Caminho para a evolução',
'Visionário',
'Energia divina',
'Aporte de energia (se O Louco se dirige para uma carta)',
'Liberação ou fuga (se ele se separa de uma carta)'
], 

'Mago': ['Começo',
'Prestidigitador',
'Trapaceiro',
'Jogador(a)',
'Há algo escondido embaixo da mesa',
'Nova empreitada',
'Novos estudos •',
'Renovação profissional',
'Princípio de uma relação',
'Menino ou ou menina masculinizada',
'Principiante',
'Astúcia',
'Habilidade',
'Arte de convencer',
'Talentos múltiplos',
'Dispõe-se de tudo o que é necessário para agir',
'Necessidade de ajuda ou de guia',
'Querer ou ousar ou poder ou obedecer',
'Escolha do que fazer',
'Hesitação',
'Multiplicidade dos potenciais',
'Animus do consulente ou homem ou mulher',
'Começo da busca da sabedoria',
'Iniciado(a)',
'Mágico(a)',
'Espiritualização da matéria'
], 

'Papisa': ['Acumulação',
'Preparação',
'Estudo',
'Virgindade',
'Escritura de um livro',
'Contabilidade',
'Espera',
'Constância',
'Retiro',
'Mulher fria',
'Perdão',
'Atriz aprendendo seu papel',
'Monja',
'Mãe severa',
'Obstinação',
'Peso da religião',
'Isolamento',
'Frigidez',
'Pessoa de grande qualidade moral',
'Educação estrita',
'Gestação',
'Necessidade de calor',
'Ideal de pureza',
'Solidão',
'Silêncio',
'Meditação',
'Sabedoria no feminino',
'Figura carismática feminina',
'A Virgem Maria',
'Leitura de textos sagrados'
], 

'Imperatriz': ['Mulher bonita',
'Fertilidade',
'Ama',
'Mãe calorosa',
'Sedutora',
'Criatividade',
'Adolescência',
'Fecundidade',
'Encanto',
'Coqueteria',
'Mulher de negócios',
'Prostituta',
'Amante',
'Artista',
'Produção',
'Beleza',
'Abundância',
'Ação criativa irracional ou que não sabe aonde vai',
'Ebulição',
'A pulsão vital como motor de crescimento'
], 

'Imperador': ['Homem de poder',
'Capacidade de pacificar ou de reinar ou de proteger',
'Estabilidade',
'Equilíbrio econômico',
'Dinheiro',
'Administração',
'Sucesso nos negócios',
'Aliado financeiro',
'Autoridade',
'Exercício da Lei',
'Paz',
'Esposo',
'Homem franco',
'Segurança',
'Retidão',
'Espírito racional',
'Potência',
'Lar estável',
'Casa',
'Pai poderoso ou dominador',
'Protetor',
'Questões relacionadas à potência sexual',
'Masculinidade',
'Patriarcado',
'Tirania',
'Ditador',
'Abuso de poder',
'Enraizamento na matéria',
'Respeito às leis do universo',
'Equilíbrio das energias',
'Deus Pai'
], 

'Papa': ['Mestre',
'Professor',
'Homem casado',
'Homem espiritual',
'Casamento ou união',
'Sacerdote',
'Guru ou sincero ou falso',
'Tartufo',
'Dogma religioso',
'União entre Céu e Terra',
'Mostrar o caminho',
'Vínculo',
'Domínio de si mesmo',
'Amplitude de visão',
'Emergência de um novo ideal',
'Todos os meios de comunicação',
'Intermediário',
'Desejo de comunicar',
'Nova comunicação',
'Revelação dos segredos',
'O pai diante dos filhos',
'Guia espiritual',
'Bênção',
'Questionamento sobre a fé e o dogma'
], 

'Amante': ['Vida social',
'Alegria',
'Gostar daquilo que se faz',
'Fazer aquilo de que se gosta',
'Nova união',
'Escolher o que fazer',
'Prazer',
'Beleza',
'Amizade',
'Triângulo amoroso',
'Apaixonar-se',
'Conflito emocional',
'Separação',
'Disputa',
'Terreno incestuoso',
'Irmãos',
'Ideal e realidade',
'Primeiros passos na alegria de viver',
'Amor consciente',
'O caminho da Beleza'
], 

'Carro': ['Vitória',
'Ação no mundo',
'Empreitada bem-sucedida',
'Viagem',
'Dinamismo',
'Amante',
'Guerreiro',
'Mensageiro',
'Conquistador',
'Príncipe',
'Anão',
'Saqueador',
'Ação intensa',
'Sucesso midiático',
'Tela de televisão ou de cinema ou de computador',
'Síntese',
'Levar em conta prós e contras',
'Harmonia animus/anima',
'Conduzir as energias',
'O espírito na matéria',
'Triunfo',
'Consciência imortal'
], 

'Justiça': ['Perfeição feminina',
'Acolher',
'Mulher grávida',
'Maternidade',
'Inflexibilidade',
'Implacabilidade',
'Julgar',
'Claridade',
'Proibir',
'Autorizar',
'Dar (a si mesmo) aquilo que é merecido',
'Pensamento límpido',
'Processo',
'Ação de justiça',
'A Lei',
'Desejo de perfeição',
'Perfeccionismo',
'Espírito crítico',
'Mãe normativa ou castradora',
'Truque ou enganar',
'Exatidão',
'Leis cósmicas',
'Perfeição',
'Harmonia',
'Momento presente',
'Completude',
'Equilíbrio ou estabilidade'
], 

'Eremita': ['Crise positiva',
'Guia',
'Solidão',
'Homem velho',
'Velhice',
'Prudência',
'Retiro',
'Terapeuta',
'Mestre masculino',
'Peregrinação',
'Castidade',
'Alcoolismo',
'Inverno',
'Dúvida e superação',
'Iluminar o passado',
'Ir para o futuro sem saber aonde vai',
'Andar de costas',
'Terapia',
'Pai ausente ou frio',
'Avô',
'Humildade',
'Saturno',
'Visão clara do mundo',
'Sabedoria',
'Amor desinteressado',
'Abnegação',
'Altruísmo',
'Mestre secreto'
], 

'Roda': ['Fim de um ciclo',
'Princípio de um ciclo',
'Necessidade de uma ajuda exterior',
'Nova partida',
'Mudança da sorte',
'Circunstâncias alheias à vontade do consulente',
'Oportunidade a ser aproveitada',
'Ciclo hormonal',
'Enigma emocional por resolver',
'Bloqueio',
'Parada',
'Beco sem saída •',
'Roda do karma ou reencarnações sucessivas',
'Leis da natureza',
'Providência',
'Ciclo completo',
'Completude',
'Filmagem',
'Ganho de dinheiro'
], 

'Força': ['Início de uma atividade',
'Aporte de nova energia',
'Energia instintiva',
'Animalidade',
'Força',
'Cólera',
'Heroísmo',
'Coragem',
'Autodisciplina',
'Relação entre o espírito e o instinto',
'Abertura ou repressão',
'Chamado da sexualidade',
'Inibição sexual',
'Repressão',
'Dificuldade de expressão',
'Abertura',
'Orgasmo',
'Tantra'
], 

'Enforcado': ['Parada',
'Espera',
'Imobilidade',
'O momento de agir ainda não chegou',
'Ocultar algo',
'Autopunição',
'Feto em gestação',
'Segredo',
'Inversão das perspectivas',
'Ver de outro ponto de vista',
'Não escolher',
'Repouso •',
'Doença',
'Dificuldade',
'Condições da gestação do consulente',
'Vínculo com a árvore genealógica',
'Prece',
'Sacrifício',
'Doação de si mesmo',
'Meditação profunda',
'Não fazer',
'Forças interiores recebidas através da prece',
'Parada',
'Espera',
'Imobilidade',
'O momento de agir ainda não chegou',
'Ocultar algo',
'Autopunição',
'Feto em gestação',
'Segredo',
'Inversão das perspectivas',
'Ver de outro ponto de vista',
'Não escolher',
'Repouso •',
'Doença',
'Dificuldade',
'Condições da gestação do consulente',
'Vínculo com a árvore genealógica',
'Prece',
'Sacrifício',
'Doação de si mesmo',
'Meditação profunda',
'Não fazer',
'Forças interiores recebidas através da prece'
], 

'Morte': ['Transformação profunda',
'Revolução',
'Corte',
'Eliminar o que nos impede de avançar',
'Fim de uma ilusão',
'Ruptura saudável',
'Cólera',
'Revolucionário',
'Agressividade',
'Colheita',
'Trabalho de luto relativo a uma pessoa ou a uma situação',
'Ódio',
'Violência',
'Limpeza •',
'Purificação radical',
'Essência da mudança',
'Trabalho do inconsciente',
'O rosto destruidor da divindade',
'A morte como máscara de Deus',
'Transmutação',
'Erradicação do antigo para dar lugar ao novo •',
'Trabalho relacionado ao esqueleto humano',
'Movimento essencial',
'Raio X',
'Psicanalista. pessoa que acompanha a mudança'
], 

'Temperança': ['Cura',
'Saúde',
'Proteção',
'Equilíbrio dinâmico',
'Trocas •',
'Reconciliação',
'Circulação de fluidos (sangue ou água .. .)',
'Fluxo de energias',
'Passagem de umafronteira . Viagens',
'Sonhos premonitórios •',
'Harmonia',
'Humor equilibrado e aprazível',
'Mesclar',
'Ponderar',
'Colocar âgua no vinho (atenuar paixões)',
'Equilíbrio das forças vitais',
'Angelismo (o anjo não tem sexo)',
'Tendência excessiva à moderação •',
'Avareza',
'Comunicação consigo mesmo',
'Mensageiro da graça',
'Cura',
'espiritual . Anjo da guarda',
'Evoca um defunto (escultura funerária)',
'Transmigração das almas ou reencarnação',
'Serpente emplumada'
], 

'Diabo': ['Paixão',
'Apego',
'Dependência',
'Possessividade',
'Adoração •',
'Grande criatividade',
'O proibido',
'Tentação',
'Bestialidade',
'Drogas',
'Contrato promissor que se deve estudar de perto',
'Entrada de dinheiro',
'Potências ocultas do inconsciente humano (negativas ou positivas) •',
'Fermentação',
'Prostituição',
'Crueldade',
'Trabalho das profondezas',
'Psiquiatria',
'Face obscura do ser',
'Sexualidade',
'Lúcifer ou anjo caído',
'portador da luz',
'Soberba',
'Possessão',
'Obsessão',
'Magia negra',
'Recusa a envelhecer',
'Grande vigor sexual',
'Fantasmas',
'Tesouro escondido',
'Energia oculta no psiquismo',
'Superação'
], 

'Torre': ['Libertação',
'Abertura',
'Destampar',
'Ruptura',
'Mudança',
'Casa •',
'Golpe folminante',
'Segredo revelado',
'Explosão de alegria',
'Prosperidade',
'Cenário de teatro',
'Ejaculação (às vezes precoce)',
'Destruição •',
'Divórcio',
'Disputa',
'Castração',
'Explosão de energia sexual',
'Dança',
'O corpo ou templo da divindade',
'Grande explosão de energia',
'Revelação',
'Assunção',
'Explosão sem limites',
'Iluminação'
], 

'Estrela': ['Êxito',
'Sorte',
'Verdade',
'Generosidade',
'Ação altruísta',
'Colocar frente a frente duas ações ou duas relações',
'Encontrar seu lugar',
'Vedete',
'Mulher fértil',
'Amamentar',
'Mulher grávida . Ferida no joelho',
'Amante ideal',
'Doação ou desperdício (segundo a direção na qual A Estrela esvazia seus vasos)',
'Nostalgia (se ela olha para o passado)',
'Purificação do mundo',
'Ecologia',
'Fonte',
'Irrigação . Recepção da energia cósmica',
'Sacralização de um lugar',
'Harmonia com as forças da natureza',
'Paraíso',
'Aquário',
'Xamã',
'Bruxa bela'
], 

'Lua': ['Intuição',
'Noite',
'Sonho',
'Devaneios',
'Superstição',
'Poesia',
'Adivinhação',
'Imaginação . Inconsciente profundo',
'Sensualidade',
'Verdade oculta (por descobrir)',
'Loucura',
'Solidão',
'Terror noturno',
'Gestação',
'Exigência sem limites',
'Vampiro de energia',
'Criança em busca do amor materno',
'Amor que une',
'Depressão',
'Segredo •',
'Travessia do mar',
'Oceano',
'Receptividade',
'Vida obscura da matéria',
'Ideal que se quer alcançar',
'Feminilidade',
'Arquétipo maternal cósmico'
], 

'Sol': ['Amor recíproco',
'Fraternidade',
'Ajuda mútua',
'União feliz',
'Nova vida',
'Associação',
'Sucesso ou colheita abundante',
'Felicidade',
'Luz •',
'Verão',
'Irradiação',
'Inteligência',
'Brio',
'Riqueza',
'Seca por excesso de calor',
'Crianças ou infância',
'Gêmeos ou geminidade',
'Rivalidade',
'Arquétipo paterno cósmico',
'Pai ideal',
'Pai ausente',
'Cortar vínculos com o pasado para construir mais longe',
'Construção',
'Solidariedade'
], 

'Julgamento': ['Chamado',
'Desejo irresistível',
'Tomada de consciência',
'Anúncio',
'Boa-nova',
'Vocação',
'Triunfo',
'Renome',
'Projeto de futuro •',
'Dar vida',
'Nascimento de uma criança',
'Cura',
'Música',
'Abertura',
'Eclosão',
'Obra de um casal',
'Célula pai/mãe/filho',
'Amor dependente dos pais',
'Condições do nascimento do consulente',
'Negar-se a agir como adulto',
'Emergência do que está oculto',
'A Graça',
'Despertar da consciência',
'Diabo sublimado',
'Impulso para a luz'],
            'Tyffo': ['Oculto', 'Exposto', 'Quase']
        };

        function updateSentidos(menuId, sentidosDivId) {
            const select = document.getElementById(menuId);
            const sentidosDiv = document.getElementById(sentidosDivId);
            const selectedValue = select.value;

            sentidosDiv.innerHTML = '';

            if (selectedValue) {
                const sentidosList = sentidosMap[selectedValue];
                sentidosList.forEach(sentido => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = sentido;
                    checkbox.value = sentido;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(sentido));
                    const p = document.createElement('p');
                    p.appendChild(label);
                    sentidosDiv.appendChild(p);
                });
            }
        }
    </script>
</body>
</html>
