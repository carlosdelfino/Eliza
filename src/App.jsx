const STORAGE_KEY = "elisa.memory.v1";

// Função compatível para gerar IDs únicos
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores que não suportam crypto.randomUUID
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// Sistema de Logging
const EMOTICONS = {
  rocket: "🚀",
  white_check_mark: "✅",
  x: "❌",
  warning: "⚠️",
  information_source: "ℹ️",
  bug: "🐛",
  stopwatch: "⏱️",
  inbox_tray: "📥",
  outbox_tray: "📤",
  gear: "⚙️",
  computer: "💻",
};

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  CRITICAL: 4,
};

let currentLogLevel = LOG_LEVELS.INFO;
let debugMode = false;

// Verifica parâmetro debug na URL
try {
  const urlParams = new URLSearchParams(window.location.search);
  debugMode = urlParams.get('debug') === 'true';
  if (debugMode) {
    currentLogLevel = LOG_LEVELS.DEBUG;
  }
} catch (e) {
  // Ignora erro se não estiver em ambiente de navegador
}

function log(level, emoticon, functionName, message, params = "") {
  if (level < currentLogLevel) return;

  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
  const fileName = "App";
  const stack = new Error().stack;
  const lineMatch = stack.match(/at.*App\.jsx:(\d+)/);
  const line = lineMatch ? lineMatch[1] : "?";

  const logLine = `[${emoticon}] [${timestamp}] [${fileName}] [${functionName}:${line}] ${message} | ${params}`;
  
  if (debugMode || level >= LOG_LEVELS.WARNING) {
    console.log(logLine);
  }
}

function logDebug(functionName, message, params = "") {
  log(LOG_LEVELS.DEBUG, EMOTICONS.bug, functionName, message, params);
}

function logInfo(functionName, message, params = "") {
  log(LOG_LEVELS.INFO, EMOTICONS.information_source, functionName, message, params);
}

function logWarning(functionName, message, params = "") {
  log(LOG_LEVELS.WARNING, EMOTICONS.warning, functionName, message, params);
}

function logError(functionName, message, params = "") {
  log(LOG_LEVELS.ERROR, EMOTICONS.x, functionName, message, params);
}

function logSuccess(functionName, message, params = "") {
  log(LOG_LEVELS.INFO, EMOTICONS.white_check_mark, functionName, message, params);
}

function logPerformance(functionName, message, params = "") {
  log(LOG_LEVELS.DEBUG, EMOTICONS.stopwatch, functionName, message, params);
}

const initialMessages = [
  {
    id: generateId(),
    role: "assistant",
    text: (() => {
      const greetings = [
        "Oi. Sou Elisa. Sente-se, respire fundo. Algo trouxe voce ate aqui hoje... o que esta no ar?",
        "Ola. Eu sou Elisa. Nao precisa explicar tudo de uma vez. So me diz: o que ficou girando na sua cabeca nos ultimos dias?",
        "Bom te ver por aqui. Sou Elisa. Tenho a impressao de que voce veio com algo especifico, mesmo que ainda nao saiba nomear. Comece por onde quiser.",
        "Oi. Elisa aqui. As vezes a gente so precisa de um espaco pra pensar em voz alta. Pode ser agora. O que veio primeiro?",
        "Ola. Sou Elisa. Voce chegou num momento interessante — geralmente quem vem conversar ja percebeu algo, so nao organizou ainda. Me conta.",
        "Oi. Eu sou Elisa. Nao tem certo nem errado aqui. Apenas fale o que vier. O que esta mais vivo em voce agora?",
        "Bom dia. Sou Elisa. Sabe quando voce fica ruminando algo por dias e ninguem percebeu? Pois e. Pode soltar aqui.",
        "Oi. Elisa. Sem pressa, sem formula. Apenas me diz: se voce pudesse falar uma unica coisa sem medo de julgamento, qual seria?",
      ];
      const seed = Date.now();
      return greetings[Math.abs(seed) % greetings.length];
    })(),
  },
];

const topicGroups = [
  {
    name: "relacionamentos",
    words: ["amor", "relacao", "relacionamento", "familia", "mae", "pai", "filho", "filha", "amigo", "amiga", "casamento", "namoro", "esposa", "marido", "irmao", "irma", "avô", "avó", "tio", "tia", "primo", "prima"],
    probes: [
      "Essa pessoa tem mais poder sobre voce do que voce gostaria de admitir.",
      "Sinto que existe algo nao dito entre voces. Uma coisa que ficou parada no ar.",
      "Hmm. E como se essa relacao fosse um espelho que voce nem sempre quer olhar.",
      "Interessante. Quando voce fala dessa pessoa, algo muda no tom. Percebe?",
      "Deixa eu te perguntar uma coisa: o que voce espera dessa pessoa que nunca pediu diretamente?",
      "Parece que voce carrega algo dessa relacao que nem e seu. E mesmo assim segura.",
    ],
  },
  {
    name: "trabalho",
    words: ["trabalho", "empresa", "chefe", "cliente", "dinheiro", "projeto", "carreira", "equipe", "reuniao", "prazo", "salario", "promocao", "demissao", "emprego", "profissao", "negocio", "meta", "resultado"],
    probes: [
      "Vejo que isso ocupa mais espaco na sua vida do que so o horario comercial.",
      "Sinto que nao e so sobre trabalho. Tem algo de identidade ai no meio.",
      "Hmm. Se voce pudesse acordar amanha sem essa pressao, o que faria primeiro?",
      "Parece que voce esta buscando reconhecimento, mas talvez nao de quem imagina.",
      "Isso que voce descreve tem um peso. Nem todo mundo carrega isso sozinho como voce faz.",
      "Existe uma parte sua que ja sabe que isso nao esta sustentavel. Mas voce segue.",
    ],
  },
  {
    name: "medo",
    words: ["medo", "ansiedade", "preocupado", "preocupada", "inseguro", "insegura", "culpa", "vergonha", "triste", "raiva", "panico", "terror", "angustia", "receio", "temor", "phobia", "nervoso"],
    probes: [
      "Esse sentimento nao surgiu do nada. Ele esta guardando alguma coisa.",
      "Sinto que isso vem de longe. Nao e so de agora, ne?",
      "Hmm. E como se voce soubesse que algo pode acontecer, mas nao sabe quando. Isso cansa.",
      "Voce carrega essa tensao ha quanto tempo? Porque parece que ja faz parte do seu dia.",
      "Interessante. O medo as vezes e um alarme util. Mas as vezes e so um eco antigo.",
      "Me parece que voce ja tentou ignorar isso. Nao funcionou, ne?",
    ],
  },
  {
    name: "futuro",
    words: ["futuro", "decidir", "escolha", "mudar", "viagem", "plano", "sonho", "objetivo", "caminho", "duvida", "amanha", "depois", "proximo", "destino", "meta", "aspiracao", "projeto"],
    probes: [
      "Sinto que voce esta num daqueles momentos em que qualquer escolha parece definitiva demais.",
      "Hmm. Voce fala do futuro, mas me parece que tem algo no presente que precisa ser resolvido primeiro.",
      "Sei. Quando voce imagina daqui a um ano, o que sente: alivio ou mais pressao?",
      "Voce esta adiando uma decisao. Nao e preguica — e medo do que vem depois dela.",
      "Parece que voce quer ir pra frente mas algo te prende. O que seria?",
      "As vezes a gente nao decide porque decidir significa perder uma das opcoes. E isso?",
    ],
  },
  {
    name: "identidade",
    words: ["eu", "sou", "sinto", "quero", "preciso", "mereco", "consigo", "falhei", "mudei", "pessoa", "personalidade", "caracter", "ser", "existir", "proprio", "si", "autoconhecimento"],
    probes: [
      "Voce falou isso como se fosse uma verdade absoluta. Mas e mesmo?",
      "Hmm. Essa definicao de si mesmo... voce escolheu ou alguem colocou em voce?",
      "Parece que voce se cobra demais. De onde vem esse padrao?",
      "Quando voce diz isso sobre si, eu me pergunto: quem te ensinou a se ver assim?",
      "Sinto que existe uma versao sua que voce esconde. Nao por vergonha, mas por protecao.",
      "Voce esta mudando. E normal nao se reconhecer durante o processo.",
    ],
  },
  {
    name: "saude",
    words: ["saude", "doenca", "medico", "hospital", "tratamento", "remedio", "dor", "corpo", "mente", "bem-estar", "exercicio", "dieta", "sono", "energia", "cansaco", "fadiga", "sintoma"],
    probes: [
      "Hmm. Seu corpo esta falando. A questao e se voce esta ouvindo.",
      "Sinto que isso nao e so fisico. Tem algo emocional por baixo.",
      "Voce anda se cuidando menos do que deveria. Mas acho que ja sabe disso.",
      "Quando foi a ultima vez que voce realmente parou? Sem culpa, sem lista de tarefas.",
      "Parece que voce esta no modo automatico. O corpo as vezes grita quando a mente ignora.",
      "Me diz: voce se trata com o mesmo cuidado que trata as pessoas ao seu redor?",
    ],
  },
  {
    name: "criatividade",
    words: ["criar", "arte", "musica", "pintura", "escrita", "ideia", "inspiracao", "projeto", "inventar", "design", "criativo", "imaginacao", "expressao", "obra", "talento", "habilidade"],
    probes: [
      "Hmm. Quando voce cria, parece que algo se abre. O que e?",
      "Sinto que voce tem algo pra expressar que ainda nao encontrou a forma certa.",
      "Voce cria pra se entender ou pra se mostrar? As duas coisas sao validas.",
      "Parece que a criatividade e seu refugio. O que voce esta refugiando?",
      "Existe algo na criacao que voce nao encontra em nenhum outro lugar da vida.",
      "Quando voce nao consegue criar, o que sente? Vazio ou liberdade?",
    ],
  },
  {
    name: "espiritualidade",
    words: ["deus", "fe", "espiritual", "religiao", "oracao", "meditacao", "alma", "espirito", "sentido", "proposito", "divino", "sagrado", "transcendencia", "crenca", "milagre", "graca"],
    probes: [
      "Sinto que voce busca algo que vai alem do concreto. Um sentido maior.",
      "Hmm. Voce fala disso com reverencia. Mas tambem com duvida. Ambos moram em voce.",
      "Parece que essa parte da sua vida te ancora. O que acontece quando ela vacila?",
      "Voce busca respostas ou confirmacao? Porque sao caminhos diferentes.",
      "Existe uma tensao entre o que voce acredita e o que voce vive. Me conta mais.",
      "Quando voce se conecta com isso, o que muda no seu dia a dia?",
    ],
  },
  {
    name: "aprendizado",
    words: ["aprender", "estudo", "curso", "livro", "conhecimento", "saber", "ensinar", "escola", "universidade", "aula", "leitura", "pesquisa", "descobrir", "compreender", "entender", "intelecto"],
    probes: [
      "Voce busca aprender isso por curiosidade ou por necessidade? Porque muda tudo.",
      "Hmm. Parece que o conhecimento pra voce e uma forma de se sentir preparado. Pra que?",
      "Quando voce aprende algo novo, como isso muda sua visao de mundo?",
      "Existe algo que voce quer aprender mas ainda nao se permitiu?",
      "O que esse processo de aprendizado esta revelando sobre voce?",
    ],
  },
  {
    name: "lazer",
    words: ["lazer", "diversao", "jogo", "filme", "musica", "viajar", "ferias", "descanso", "hobby", "prazer", "entretenimento", "festa", "amigos", "passeio", "relaxar", "curtir"],
    probes: [
      "Voce se permite descansar sem culpa? Porque parece que nao.",
      "Hmm. Quando voce se diverte, uma parte sua fica julgando. Percebe isso?",
      "Sinto que voce precisa mais disso do que se permite ter.",
      "Lazer pra voce e escape ou e escolha? Faz diferenca.",
      "Parece que voce so se permite parar quando ja esta no limite.",
      "Me diz: se voce tivesse um dia inteiro livre, sem obrigacoes... o que faria de verdade?",
    ],
  },
];

const reflectivePairs = [
  ["eu nao posso", "voce sente que nao pode"],
  ["eu nao consigo", "voce sente que nao consegue"],
  ["eu sou", "voce sente que e"],
  ["eu estou", "voce esta"],
  ["eu sinto", "voce sente"],
  ["eu quero", "voce quer"],
  ["eu preciso", "voce precisa"],
  ["eu tenho", "voce tem"],
  ["eu tinha", "voce tinha"],
  ["eu", "voce"],
  ["me", "te"],
  ["mim", "voce"],
  ["meu", "seu"],
  ["minha", "sua"],
  ["meus", "seus"],
  ["minhas", "suas"],
  ["voce", "eu"],
  ["seu", "meu"],
  ["sua", "minha"],
];

const quitPhrases = ["tchau", "adeus", "encerrar", "fim", "chega", "obrigado", "obrigada"];

const finalReplies = [
  "Podemos parar por aqui. Leve com voce a primeira coisa que ficou incomoda na conversa.",
  "Certo. Encerramos agora. Talvez a parte mais importante seja justamente a que voce ainda nao quis nomear.",
  "Vamos deixar assim por enquanto. Quando voltar, repare qual palavra continua voltando.",
  "Tudo bem. Mas presta atencao: o que voce sentiu agora, nesse instante, antes de dizer tchau?",
  "Ok. Mas eu diria que a conversa nao acabou dentro de voce. Volta quando quiser.",
  "Certo. Uma coisa antes de ir: se tivesse que guardar uma unica frase dessa conversa, qual seria?",
];

const openQuestions = [
  "Me conta mais.",
  "E ai?",
  "Continue...",
  "Hmm. E depois?",
  "Entendo. O que mais?",
  "Sei. E como voce se sente com isso?",
  "Interessante. Continua.",
  "O que nessa parte parece mais importante pra voce?",
  "Quando voce diz isso, qual imagem vem primeiro?",
  "Ha algo que voce nao disse mas que ficou rondando essa ideia?",
  "Se voce pudesse mudar uma coisa nisso tudo, qual seria?",
  "Quem na sua vida entenderia isso sem voce precisar explicar?",
  "E se voce olhasse por um angulo totalmente diferente?",
  "Isso parece familiar... ja sentiu algo parecido antes?",
  "E o que voce faz com isso?",
];

const fortuneTellerStatements = [
  "Vejo que isso nao e a primeira vez que aparece na sua vida.",
  "Algo me diz que existe uma pessoa envolvida nisso que voce ainda nao mencionou.",
  "Tenho a impressao de que voce ja sabe o que quer fazer, mas precisa de permissao.",
  "Isso que voce traz carrega um peso antigo. Nem tudo e de agora.",
  "Percebo uma hesitacao. Como se uma parte sua quisesse seguir e outra quisesse ficar.",
  "Voce fala com clareza, mas sinto que por baixo tem algo que voce ainda protege.",
  "Existe uma decisao aqui que voce vem adiando. Talvez por medo do que vem depois.",
  "Isso me lembra algo que costumo ver: pessoas que cuidam de todos, menos de si mesmas.",
  "Voce trouxe isso de um jeito que parece leve, mas eu sinto que pesa mais do que voce mostra.",
  "Ha uma historia por tras disso que voce ainda nao contou pra ninguem, nao e?",
  "Parece que voce esta num cruzamento e cada caminho tem um preco.",
  "Algo mudou recentemente. Nao sei se foi externo ou interno, mas mudou.",
  "Voce esta testando ate onde pode ir sem se machucar. E uma estrategia compreensivel.",
  "Sinto que voce ja tentou resolver isso de outras formas antes de vir aqui.",
  "Existe uma lealdade antiga que talvez esteja te impedindo de seguir em frente.",
];

const validationPhrases = [
  "Faz sentido voce se sentir assim.",
  "Qualquer pessoa no seu lugar sentiria algo parecido.",
  "Isso e mais comum do que voce imagina.",
  "Nao e fraqueza. E complexidade.",
  "Voce esta lidando com isso melhor do que acha.",
  "O fato de voce estar refletindo sobre isso ja diz muito.",
  "Nem todo mundo consegue olhar pra isso de frente como voce esta fazendo.",
  "E natural sentir isso. Sinal de que voce esta prestando atencao.",
];

const coldReadLines = [
  "Tenho a impressao de que voce ja pensou nisso muitas vezes, mas de formas diferentes.",
  "Parece que uma parte sua ja sabe a resposta, enquanto outra parte ainda pede confirmacao.",
  "Existe uma tensao entre o que voce mostra para os outros e o que voce guarda para si.",
  "Algo nessa historia parece pequeno por fora, mas grande por dentro.",
  "Voce fala disso com uma clareza que sugere muita reflexao anterior.",
  "Existe um padrao aqui que voce talvez ainda nao tenha nomeado.",
  "Sua voz muda quando toca nesse assunto. O que isso indica?",
  "Parece que voce esta testando diferentes formas de entender isso.",
  "Essa historia tem camadas, e estamos apenas na superficie.",
  "Voce parece estar entre duas verdades, tentando encontrar um caminho.",
  "Existe uma coragem em falar disso que nao e trivial.",
  "Algo nessa conversa esta pedindo para ser olhado de outro angulo.",
  "Voce trouxe isso com uma urgencia que merece atencao.",
  "Parece que existe uma decisao sendo gestada aqui.",
  "Sua forma de descrever isso revela mais do que voce imagina.",
];

const elizaRules = [
  {
    key: "desculpa",
    rank: 80,
    words: ["desculpa", "desculpe", "perdao"],
    decomps: [
      {
        pattern: /(?:^| )(desculpa|desculpe|perdao)(?: |$)(.*)/,
        replies: [
          "Voce nao precisa se desculpar comigo. O que fez essa desculpa aparecer?",
          "Desculpas costumam proteger alguma coisa. O que voce esta tentando proteger?",
          "Essa desculpa parece ser para mim ou para voce?",
        ],
      },
    ],
  },
  {
    key: "mae",
    rank: 75,
    words: ["mae", "pai", "familia", "irmao", "irma", "filho", "filha"],
    decomps: [
      {
        pattern: /(?:^| ).*(mae|pai|familia|irmao|irma|filho|filha)(.*)/,
        replies: [
          "Fale mais sobre sua familia.",
          "Quando voce menciona sua familia, o que fica mais vivo: cuidado, cobranca ou distancia?",
          "Essa pessoa da familia parece estar ligada a uma expectativa antiga. Qual seria?",
        ],
      },
    ],
  },
  {
    key: "eu sinto",
    rank: 70,
    words: ["sinto", "sentir", "sentimento"],
    decomps: [
      {
        pattern: /(?:^| )eu sinto (.*)/,
        replies: [
          "Voce sente {1} com frequencia?",
          "O que em voce reconhece esse sentimento de {1}?",
          "Sentir {1} parece te aproximar ou te afastar de alguma decisao?",
        ],
      },
      {
        pattern: /(?:^| )sinto (.*)/,
        replies: [
          "Quando voce sente {1}, o que normalmente acontece depois?",
          "Esse {1} parece antigo ou recente?",
        ],
      },
    ],
  },
  {
    key: "eu quero",
    rank: 68,
    words: ["quero", "queria", "desejo", "vontade"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:quero|queria|desejo) (.*)/,
        replies: [
          "O que aconteceria se voce conseguisse {1}?",
          "Por que {1} e importante agora?",
          "Voce quer {1}, mas que parte sua hesita?",
        ],
      },
    ],
  },
  {
    key: "nao posso",
    rank: 66,
    words: ["nao posso", "nao consigo", "impossivel"],
    decomps: [
      {
        pattern: /(?:^| )eu nao (?:posso|consigo) (.*)/,
        replies: [
          "O que te impede de {1}?",
          "Se voce pudesse {1}, o que mudaria primeiro?",
          "Quem ou o que ensinou voce que nao pode {1}?",
        ],
      },
    ],
  },
  {
    key: "medo",
    rank: 64,
    words: ["medo", "ansiedade", "receio", "preocupacao", "inseguranca"],
    decomps: [
      {
        pattern: /(?:^| ).*(medo|ansiedade|receio|preocupacao|inseguranca)(?: de)? (.*)/,
        replies: [
          "Voce veio falar comigo porque {1} aparece quando pensa em {2}?",
          "Esse {1} sobre {2} parece apontar para um perigo real ou para uma lembranca?",
          "O que voce faria sobre {2} se esse {1} diminuisse um pouco?",
        ],
      },
    ],
  },
  {
    key: "porque",
    rank: 58,
    words: ["porque", "por que"],
    decomps: [
      {
        pattern: /(?:^| ).*(porque|por que) (.*)/,
        replies: [
          "Essa explicacao satisfaz voce?",
          "Talvez o motivo declarado nao seja o unico. Que outro motivo poderia existir?",
          "Se essa resposta fosse simples, voce ainda estaria perguntando?",
        ],
      },
    ],
  },
  {
    key: "voce",
    rank: 50,
    words: ["voce", "elisa"],
    decomps: [
      {
        pattern: /(?:^| ).*(voce|elisa) (.*)/,
        replies: [
          "Estamos falando de mim, mas talvez isso diga algo sobre voce. O que voce percebe?",
          "O que faria diferenca se eu {2}?",
          "Por que voce coloca Elisa nessa parte da historia?",
        ],
      },
    ],
  },
  {
    key: "sim",
    rank: 30,
    words: ["sim", "certo", "exato"],
    decomps: [
      {
        pattern: /(?:^| )(sim|certo|exato)(?: |$)(.*)/,
        replies: [
          "Voce parece seguro disso.",
          "Essa certeza veio rapido. O que ela evita discutir?",
          "Entao vamos ficar nessa certeza por um instante. O que ela revela?",
        ],
      },
    ],
  },
  {
    key: "nao",
    rank: 30,
    words: ["nao", "nunca", "jamais"],
    decomps: [
      {
        pattern: /(?:^| ).*(nao|nunca|jamais)(.*)/,
        replies: [
          "Voce esta negando isso com forca.",
          "O que aconteceria se esse nao fosse menos absoluto?",
          "Esse limite parece proteger voce de alguma coisa. Do que?",
        ],
      },
    ],
  },
  {
    key: "sonho",
    rank: 62,
    words: ["sonho", "sonhei", "sonhando", "sonhador"],
    decomps: [
      {
        pattern: /(?:^| ).*(sonho|sonhei|sonhando)(?: com)? (.*)/,
        replies: [
          "Sonhos costumam revelar desejos ou medos. Qual parece ser o caso aqui?",
          "O que {1} com {2} desperta em voce?",
          "Se esse {1} se tornasse realidade, como voce se sentiria?",
        ],
      },
    ],
  },
  {
    key: "espero",
    rank: 60,
    words: ["espero", "esperanca", "esperar"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:espero|esperava) (.*)/,
        replies: [
          "O que essa esperanca diz sobre o que voce valoriza?",
          "Se essa esperanca se concretizasse, o que mudaria?",
          "Existe alguma parte de voce que duvida dessa esperanca?",
        ],
      },
    ],
  },
  {
    key: "penso",
    rank: 56,
    words: ["penso", "pensar", "pensamento", "ideia"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:penso|pensei) (.*)/,
        replies: [
          "Quando voce pensa assim, o que isso te permite fazer ou evitar?",
          "Esse pensamento parece vir da razao ou da intuicao?",
          "O que aconteceria se voce pensasse diferente sobre isso?",
        ],
      },
    ],
  },
  {
    key: "talvez",
    rank: 48,
    words: ["talvez", "pode ser", "possivel"],
    decomps: [
      {
        pattern: /(?:^| )(talvez|pode ser|possivel)(?: |$)(.*)/,
        replies: [
          "Essa incerteza parece confortavel ou desconfortavel?",
          "O que te impede de transformar esse talvez em certeza?",
          "Se voce tivesse que escolher agora, para qual lado iria?",
        ],
      },
    ],
  },
  {
    key: "sempre",
    rank: 45,
    words: ["sempre", "todo", "toda", "constantemente"],
    decomps: [
      {
        pattern: /(?:^| )(sempre|todo|toda|constantemente)(?: |$)(.*)/,
        replies: [
          "Absolutos como sempre costumam esconder excecoes. Qual seria a excecao aqui?",
          "Voce realmente acredita que e sempre assim, ou as vezes parece?",
          "O que essa generalizacao protege de examinar mais de perto?",
        ],
      },
    ],
  },
  {
    key: "ninguem",
    rank: 52,
    words: ["ninguem", "ninguém", "ningue", "nenhum"],
    decomps: [
      {
        pattern: /(?:^| )(ninguem|ninguém|ningue|nenhum)(?: |$)(.*)/,
        replies: [
          "Quando voce diz ninguem, quem e a primeira pessoa que vem a mente?",
          "Essa solidao parece ser escolha ou circunstancia?",
          "Voce se inclui nesse ninguem ou se coloca fora?",
        ],
      },
    ],
  },
  {
    key: "todo mundo",
    rank: 50,
    words: ["todo mundo", "todos", "todas", "todo mundo"],
    decomps: [
      {
        pattern: /(?:^| )(todo mundo|todos|todas)(?: |$)(.*)/,
        replies: [
          "Quando voce generaliza assim, quem e a excecao que voce conhece?",
          "O que essa generalizacao diz sobre sua propria experiencia?",
          "Voce se inclui nesse todos ou se observa de fora?",
        ],
      },
    ],
  },
  {
    key: "preciso",
    rank: 65,
    words: ["preciso", "necessito", "necessidade"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:preciso|necessito) (.*)/,
        replies: [
          "O que aconteceria se voce nao tivesse essa necessidade?",
          "Essa necessidade vem de dentro ou de expectativas externas?",
          "O que essa necessidade esta tentando resolver?",
        ],
      },
    ],
  },
  {
    key: "odeio",
    rank: 72,
    words: ["odeio", "odiar", "odiei", "raiva", "ódio"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:odeio|odiei|odio) (.*)/,
        replies: [
          "O odio e um sentimento muito forte. O que ele protege?",
          "Se voce pudesse transformar esse odio em outra coisa, o que seria?",
          "O que {1} representa que desperta tao forte reacao?",
        ],
      },
    ],
  },
  {
    key: "amo",
    rank: 72,
    words: ["amo", "amar", "amei", "amor"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:amo|amei) (.*)/,
        replies: [
          "O que esse amor te permite fazer ou ser?",
          "Existe alguma expectativa escondida nesse amor?",
          "Como voce sabe que e amor e nao outra coisa?",
        ],
      },
    ],
  },
  {
    key: "esqueci",
    rank: 55,
    words: ["esqueci", "esquecer", "esquecimento"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:esqueci|esqueca) (.*)/,
        replies: [
          "As vezes esquecemos o que nos incomoda. O que {1} pode representar?",
          "Se voce lembrasse agora, o que mudaria?",
          "Esquecer foi uma escolha ou aconteceu naturalmente?",
        ],
      },
    ],
  },
  {
    key: "lembrei",
    rank: 55,
    words: ["lembrei", "lembrar", "lembrança", "memoria"],
    decomps: [
      {
        pattern: /(?:^| )eu (?:lembrei|lembro) (.*)/,
        replies: [
          "O que disparou essa lembranca agora?",
          "Essa lembranca traz conforto ou desconforto?",
          "O que essa memoria esta tentando te dizer?",
        ],
      },
    ],
  },
];

function normalize(text) {
  if (!text || typeof text !== 'string') {
    logWarning("normalize", "Texto inválido fornecido", `texto=${text}`);
    return "";
  }
  logDebug("normalize", "Iniciando normalização do texto", `texto=${text.substring(0, 30)}...`);
  const result = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  logDebug("normalize", "Texto normalizado", `resultado=${result}`);
  return result;
}

function getWords(text) {
  logDebug("getWords", "Extraindo palavras-chave", `texto=${text.substring(0, 30)}...`);
  const stopWords = new Set([
    "para", "com", "que", "uma", "uns", "das", "dos", "por", "mas", "como", "isso", "essa", "esse", "estou", "tenho", "muito",
    "muita", "sobre", "quando", "porque", "acho", "voce", "minha", "meu", "minhas", "meus", "algo", "agora",
    "ele", "ela", "eles", "elas", "dele", "dela", "deles", "delas", "nele", "nela", "neles", "nelas",
    "aqui", "ali", "la", "aqui", "acola", "onde", "como", "quanto", "tanta", "tanto", "tão", "tao",
    "ser", "estar", "foi", "era", "foram", "estava", "estavam", "sao", "somos", "estao",
    "ter", "tinha", "tinham", "houve", "havia", "haviam", "tem", "temos",
    "fazer", "faz", "fazem", "fez", "fizeram", "fazia", "faziam",
    "dizer", "diz", "dizem", "disse", "disseram", "dizia", "diziam",
    "ir", "vai", "vao", "foi", "foram", "ia", "iam", "vai",
    "ver", "vejo", "ve", "veem", "vi", "viram", "via", "viam",
    "saber", "sei", "sabe", "sabem", "soube", "souberam", "sabia", "sabiam",
    "poder", "posso", "pode", "podem", "pude", "puderam", "podia", "podiam",
    "querer", "quero", "quer", "querem", "quis", "quiseram", "queria", "queriam",
    "dar", "dou", "da", "dao", "dei", "deram", "dava", "davam",
    "ficar", "fico", "fica", "ficam", "fiquei", "ficaram", "ficava", "ficavam",
    "andar", "ando", "anda", "andam", "andei", "andaram", "andava", "andavam",
    "vir", "venho", "vem", "vem", "vim", "vieram", "vinha", "vinham",
    "sentir", "sinto", "sente", "sentem", "senti", "sentiram", "sentia", "sentiam",
    "pensar", "penso", "pensa", "pensam", "pensei", "pensaram", "pensava", "pensavam",
    "olhar", "olho", "olha", "olham", "olhei", "olharam", "olhava", "olhavam",
    "falar", "falo", "fala", "falam", "falei", "falaram", "falava", "falavam",
    "ouvir", "ouco", "ouve", "ouvem", "ouvi", "ouviram", "ouvia", "ouviam",
    "ainda", "ja", "jamais", "nunca", "sempre", "as vezes", "vezes",
    "bem", "mal", "melhor", "pior", "maior", "menor", "mais", "menos",
    "muito", "pouco", "tanto", "quanto", "tudo", "nada", "algo", "algum",
    "cada", "todo", "todos", "todas", "nenhum", "ninguem", "alguem",
    "outro", "outros", "outra", "outras", "mesmo", "mesma", "mesmos", "mesmas",
    "proprio", "propria", "proprios", "proprias", "tal", "tais",
    "assim", "deste", "desta", "destes", "destas", "esse", "essa", "esses", "essas",
    "aquele", "aquela", "aqueles", "aquelas", "isto", "isso", "aquilo",
    "enquanto", "ate", "desde", "durante", "entre", "sem", "sob", "sobre",
    "apenas", "so", "tambem", "nem", "ou", "e", "mas", "porem", "todavia",
    "logo", "depois", "antes", "agora", "hoje", "ontem", "amanha",
  ]);

  const words = normalize(text)
    .split(" ")
    .filter((word) => word.length > 3 && !stopWords.has(word));
  logDebug("getWords", "Palavras extraídas", `quantidade=${words.length}, palavras=${words.join(", ")}`);
  return words;
}

function detectTopics(text) {
  logDebug("detectTopics", "Detectando temas no texto", `texto=${text.substring(0, 30)}...`);
  const normalized = normalize(text);
  const detected = topicGroups
    .map((topic) => ({
      ...topic,
      score: topic.words.filter((word) => normalized.includes(word)).length,
    }))
    .filter((topic) => topic.score > 0)
    .sort((a, b) => b.score - a.score);
  logDebug("detectTopics", "Temas detectados", `quantidade=${detected.length}, temas=${detected.map(t => t.name).join(", ")}`);
  return detected;
}

function reflect(text) {
  logDebug("reflect", "Iniciando reflexão pronominal", `texto=${text.substring(0, 30)}...`);
  let normalized = normalize(text);
  reflectivePairs
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([from], index) => {
      normalized = normalized.replace(new RegExp(`\\b${from}\\b`, "g"), `__REFLECT_${index}__`);
    });

  reflectivePairs
    .slice()
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([, to], index) => {
      normalized = normalized.replace(new RegExp(`__reflect_${index}__`, "gi"), to);
    });

  logDebug("reflect", "Reflexão concluída", `resultado=${normalized}`);
  return normalized;
}

function loadMemory() {
  logInfo("loadMemory", "Carregando memória do localStorage");
  try {
    const memory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { topics: {}, keywords: {}, turns: 0, stack: [] };
    logSuccess("loadMemory", "Memória carregada com sucesso", `turns=${memory.turns}`);
    return memory;
  } catch (error) {
    logError("loadMemory", "Erro ao carregar memória", `erro=${error.message}`);
    return { topics: {}, keywords: {}, turns: 0, stack: [] };
  }
}

function saveMemory(memory) {
  logDebug("saveMemory", "Salvando memória no localStorage", `turns=${memory.turns}`);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    logSuccess("saveMemory", "Memória salva com sucesso");
  } catch (error) {
    logError("saveMemory", "Erro ao salvar memória", `erro=${error.message}`);
  }
}

function choose(items, seed) {
  return items[Math.abs(seed) % items.length];
}

function updateMemory(memory, text, topics, words) {
  logDebug("updateMemory", "Atualizando memória conversacional", `turns_atual=${memory.turns}`);
  const next = {
    topics: { ...memory.topics },
    keywords: { ...memory.keywords },
    stack: [...(memory.stack || [])],
    turns: memory.turns + 1,
  };

  topics.forEach((topic) => {
    next.topics[topic.name] = (next.topics[topic.name] || 0) + topic.score;
  });

  words.slice(0, 8).forEach((word) => {
    next.keywords[word] = (next.keywords[word] || 0) + 1;
  });

  const memoryCandidate = buildMemoryFragment(text, topics, words);
  if (memoryCandidate) {
    next.stack = [memoryCandidate, ...next.stack].slice(0, 8);
  }

  saveMemory(next);
  logSuccess("updateMemory", "Memória atualizada", `novo_turns=${next.turns}, stack_size=${next.stack.length}`);
  return next;
}

function getDominantMemory(memory) {
  const topic = Object.entries(memory.topics).sort((a, b) => b[1] - a[1])[0]?.[0];
  const keyword = Object.entries(memory.keywords).sort((a, b) => b[1] - a[1])[0]?.[0];
  return { topic, keyword };
}

function buildMemoryFragment(text, topics, words) {
  if (topics.length === 0 && words.length === 0) return null;
  const topic = topics[0]?.name || "isso";
  const keyword = words[0] || topic;
  const reflected = reflect(text);
  const question = choose(openQuestions, keyword.length);
  const finalQuestion = question.includes("{keyword}") ? question.replace("{keyword}", keyword) : question;
  return `Antes voce trouxe ${topic}, especialmente quando disse que ${reflected}. ${finalQuestion}`;
}

function isQuit(input) {
  if (!input || typeof input !== 'string') {
    logWarning("isQuit", "Input inválido fornecido", `input=${input}`);
    return false;
  }
  const normalized = normalize(input);
  return quitPhrases.some((phrase) => normalized === phrase || normalized.includes(` ${phrase} `));
}

function rankRules(input) {
  logDebug("rankRules", "Ranqueando regras ELIZA", `input=${input.substring(0, 30)}...`);
  const normalized = normalize(input);
  const ranked = elizaRules
    .map((rule) => ({
      ...rule,
      score: rule.words.some((word) => normalized.includes(word)) ? rule.rank : 0,
    }))
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score);
  logDebug("rankRules", "Regras ranqueadas", `quantidade=${ranked.length}`);
  return ranked;
}

function reassemble(template, match) {
  return template.replace(/\{(\d+)\}/g, (_, groupIndex) => {
    const fragment = match[Number(groupIndex)] || "";
    return reflect(fragment).trim() || "isso";
  });
}

function applyElizaRules(input, seed) {
  logDebug("applyElizaRules", "Aplicando regras ELIZA", `input=${input.substring(0, 30)}...`);
  const normalized = normalize(input);
  const rules = rankRules(input);
  logDebug("applyElizaRules", "Regras ranqueadas", `quantidade=${rules.length}`);

  for (const rule of rules) {
    for (const decomp of rule.decomps) {
      const match = normalized.match(decomp.pattern);
      if (match) {
        logDebug("applyElizaRules", "Regra correspondente encontrada", `regra=${rule.key}`);
        return {
          key: rule.key,
          text: reassemble(choose(decomp.replies, seed + rule.rank), match),
        };
      }
    }
  }

  logDebug("applyElizaRules", "Nenhuma regra correspondente encontrada");
  return null;
}

function buildReply(input, memory) {
  if (!input || typeof input !== 'string') {
    logError("buildReply", "Input inválido fornecido", `input=${input}`);
    return {
      text: "Hmm, nao consegui captar isso. Tenta de novo, com outras palavras?",
      memory: memory,
    };
  }
  
  const startTime = performance.now();
  logInfo("buildReply", "Construindo resposta", `input=${input.substring(0, 30)}...`);
  
  const words = getWords(input);
  const topics = detectTopics(input);
  const nextMemory = updateMemory(memory, input, topics, words);
  const dominant = getDominantMemory(nextMemory);
  const seed = input.length + nextMemory.turns + words.join("").length;
  const keyword = words[0] || dominant.keyword || "isso";
  const reflected = reflect(input);
  const hasQuestion = input.includes("?");
  const turn = nextMemory.turns;
  
  logDebug("buildReply", "Contexto analisado", `palavras=${words.length}, temas=${topics.length}, tema_dominante=${dominant.topic}, turno=${turn}`);

  if (isQuit(input)) {
    logInfo("buildReply", "Detectado encerramento de conversa");
    const endTime = performance.now();
    logPerformance("buildReply", "Tempo de processamento", `ms=${(endTime - startTime).toFixed(2)}`);
    return {
      text: choose(finalReplies, seed),
      memory: nextMemory,
    };
  }

  if (normalize(input).length < 4) {
    const shortReplies = [
      "Hmm. Continua...",
      "Sei. E o que mais?",
      "Certo. Fica a vontade pra desenvolver.",
      "Entendi. Me diz mais.",
    ];
    return {
      text: choose(shortReplies, seed),
      memory: nextMemory,
    };
  }

  const ruleReply = applyElizaRules(input, seed);
  
  const replyStrategy = turn % 5;
  logDebug("buildReply", "Estratégia de resposta", `turno=${turn}, estrategia=${replyStrategy}`);
  
  if (ruleReply) {
    logInfo("buildReply", "Regra ELIZA aplicada", `regra=${ruleReply.key}`);
    const endTime = performance.now();
    logPerformance("buildReply", "Tempo de processamento", `ms=${(endTime - startTime).toFixed(2)}`);
    
    if (replyStrategy === 0) {
      return { text: ruleReply.text, memory: nextMemory };
    }
    if (replyStrategy === 1) {
      return { text: `${choose(validationPhrases, seed)} ${ruleReply.text}`, memory: nextMemory };
    }
    return { text: ruleReply.text, memory: nextMemory };
  }

  if (hasQuestion && turn > 1) {
    const questionResponses = [
      `Boa pergunta. Mas antes de eu responder... o que voce acha?`,
      `Hmm. Voce pergunta sobre ${keyword}, mas me parece que ja tem um palpite. Qual e?`,
      `Essa e uma daquelas perguntas que a pessoa faz quando ja sabe a resposta mas nao quer admitir. Estou errada?`,
      `Interessante voce perguntar isso agora. O que mudou pra essa duvida aparecer?`,
      `${choose(validationPhrases, seed)} Mas me diz: se eu te desse a resposta, o que voce faria com ela?`,
    ];
    return {
      text: choose(questionResponses, seed),
      memory: nextMemory,
    };
  }

  if (topics.length > 0) {
    const topic = topics[0];
    logInfo("buildReply", "Construindo resposta de cartomante", `tema=${topic.name}`);
    
    if (replyStrategy <= 1) {
      const probe = choose(topic.probes, seed);
      return { text: probe, memory: nextMemory };
    }
    
    if (replyStrategy === 2) {
      const fortune = choose(fortuneTellerStatements, seed);
      const nudge = choose(openQuestions, seed + 3);
      return { text: `${fortune} ${nudge}`, memory: nextMemory };
    }
    
    if (replyStrategy === 3) {
      const validation = choose(validationPhrases, seed);
      const coldRead = choose(coldReadLines, seed + 1);
      return { text: `${validation} ${coldRead}`, memory: nextMemory };
    }
    
    if (dominant.topic && dominant.topic !== topic.name) {
      return {
        text: `Hmm. Antes era mais sobre ${dominant.topic}, agora voce trouxe ${topic.name}. ${choose(fortuneTellerStatements, seed)}`,
        memory: nextMemory,
      };
    }
    
    return {
      text: `${choose(topic.probes, seed)} ${choose(openQuestions, seed + 2)}`,
      memory: nextMemory,
    };
  }

  if (words.length > 0 && turn > 3 && turn % 4 === 0) {
    const fortune = choose(fortuneTellerStatements, seed);
    return { text: fortune, memory: nextMemory };
  }

  if (turn <= 2) {
    const earlyReplies = [
      `Entendo. ${choose(openQuestions, seed)}`,
      `Hmm, ${keyword}... ${choose(openQuestions, seed + 1)}`,
      `Certo. ${choose(validationPhrases, seed)} ${choose(openQuestions, seed + 2)}`,
    ];
    return { text: choose(earlyReplies, seed), memory: nextMemory };
  }

  logInfo("buildReply", "Usando resposta reflexiva de cartomante");
  const endTime = performance.now();
  logPerformance("buildReply", "Tempo de processamento", `ms=${(endTime - startTime).toFixed(2)}`);
  
  const reflectiveReplies = [
    `${choose(fortuneTellerStatements, seed)}`,
    `${choose(coldReadLines, seed)} ${choose(openQuestions, seed + 1)}`,
    `${choose(validationPhrases, seed)} ${choose(fortuneTellerStatements, seed + 2)}`,
    `Quando voce fala "${reflected}", eu percebo algo. ${choose(fortuneTellerStatements, seed + 3)}`,
  ];
  return {
    text: choose(reflectiveReplies, seed),
    memory: nextMemory,
  };
}

function App() {
  logInfo("App", "Inicializando componente Elisa");
  const [messages, setMessages] = React.useState(initialMessages);
  const [memory, setMemory] = React.useState(loadMemory);
  const [draft, setDraft] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function resetConversation() {
    logInfo("resetConversation", "Reiniciando conversa");
    localStorage.removeItem(STORAGE_KEY);
    setMemory({ topics: {}, keywords: {}, turns: 0, stack: [] });
    setMessages(initialMessages);
    logSuccess("resetConversation", "Conversa reiniciada com sucesso");
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isThinking) return;

    logInfo("sendMessage", "Enviando mensagem do usuário", `texto=${text.substring(0, 30)}...`);
    const userMessage = { id: generateId(), role: "user", text };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsThinking(true);

    const delay = 650 + Math.min(text.length * 8, 900);
    logDebug("sendMessage", "Aguardando resposta", `delay_ms=${delay}`);

    window.setTimeout(() => {
      const reply = buildReply(text, memory);
      setMemory(reply.memory);
      setMessages((current) => [
        ...current,
        { id: generateId(), role: "assistant", text: reply.text },
      ]);
      setIsThinking(false);
      logSuccess("sendMessage", "Resposta enviada ao usuário");
    }, delay);
  }

  const dominant = getDominantMemory(memory);

  return (
    <main className="shell">
      <a 
        href="https://github.com/carlosdelfino/Eliza" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="github-ribbon"
        aria-label="Ver no GitHub"
      >
        <span>&#9733; Ver no GitHub</span>
      </a>
      
      <header className="page-header">
        <img src="./images/header_eliza.png" alt="Elisa Header" className="header-image" />
      </header>
      <aside className="sidebar" aria-label="Memoria da conversa">
        <div className="visitor-counter">
          <img 
            src="https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.Eliza" 
            alt="Visitantes" 
            className="visitor-badge"
          />
        </div>
        
        <div className="brand">
          <div className="mark">E</div>
          <div>
            <h1>Elisa</h1>
            <p>Experimento conversacional</p>
          </div>
        </div>

        <section className="memory-panel">
          <h2>Leitura atual</h2>
          <dl>
            <div>
              <dt>Tema recorrente</dt>
              <dd>{dominant.topic || "ainda indefinido"}</dd>
            </div>
            <div>
              <dt>Palavra sensivel</dt>
              <dd>{dominant.keyword || "aguardando conversa"}</dd>
            </div>
            <div>
              <dt>Rodadas</dt>
              <dd>{memory.turns}</dd>
            </div>
          </dl>
        </section>

        <button className="reset-button" type="button" onClick={resetConversation}>
          Nova conversa
        </button>
      </aside>

      <section className="chat" aria-label="Conversa com Elisa">
        <header className="chat-header">
          <div>
            <h2>Conversa</h2>
            <p>Elisa observa palavras, temas e repeticoes para conduzir o dialogo.</p>
          </div>
        </header>

        <div className="messages">
          {messages.map((message) => (
            <article className={`message ${message.role}`} key={message.id}>
              <div className="avatar">{message.role === "assistant" ? "E" : "Voce".slice(0, 1)}</div>
              <p>{message.text}</p>
            </article>
          ))}

          {isThinking && (
            <article className="message assistant">
              <div className="avatar">E</div>
              <p className="thinking">
                <span></span>
                <span></span>
                <span></span>
              </p>
            </article>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <textarea
            aria-label="Mensagem"
            placeholder="Escreva o que voce esta pensando..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                sendMessage(event);
              }
            }}
            rows="1"
          />
          <button type="submit" disabled={!draft.trim() || isThinking}>
            Enviar
          </button>
        </form>
      </section>

      <aside className="resources-panel" aria-label="Recursos sobre ELIZA">
        <h2>Recursos</h2>
        
        <section className="resources-section">
          <h3>Artigos Acadêmicos</h3>
          <ul className="resources-list">
            <li>
              <a href="https://dl.acm.org/doi/10.1145/365808.365874" target="_blank" rel="noopener noreferrer">
                ELIZA—A Computer Program For the Study of Natural Language Communication Between Man and Machine
              </a>
              <div className="author">Joseph Weizenbaum</div>
              <div className="year">1966</div>
            </li>
            <li>
              <a href="https://www.semanticscholar.org/paper/ELIZA%E2%80%94A-Computer-Program-for-the-Study-of-Weizenbaum/5e7b6b8c5e4b8c5e4b8c5e4b8c5e4b8c5e4b8c" target="_blank" rel="noopener noreferrer">
                Some powerful forces acting for the selection of content in the mind
              </a>
              <div className="author">Joseph Weizenbaum</div>
              <div className="year">1976</div>
            </li>
            <li>
              <a href="https://www.jstor.org/stable/202432" target="_blank" rel="noopener noreferrer">
                Computer Power and Human Reason: From Judgment to Calculation
              </a>
              <div className="author">Joseph Weizenbaum</div>
              <div className="year">1976</div>
            </li>
          </ul>
        </section>

        <section className="resources-section">
          <h3>Artigos da Época</h3>
          <ul className="resources-list">
            <li>
              <a href="https://www.nytimes.com/1966/06/24/archives/computer-program-called-eliza-can-simulate-psychotherapist.html" target="_blank" rel="noopener noreferrer">
                Computer Program Called Eliza Can Simulate Psychotherapist
              </a>
              <div className="author">The New York Times</div>
              <div className="year">1966</div>
            </li>
            <li>
              <a href="https://www.technologyreview.com/2022/03/17/1047430/eliza-ai-chatbot-history/" target="_blank" rel="noopener noreferrer">
                The Chatbot That Changed Everything
              </a>
              <div className="author">MIT Technology Review</div>
              <div className="year">2022</div>
            </li>
            <li>
              <a href="https://www.scientificamerican.com/article/artificial-intelligence-conversation-with-eliza/" target="_blank" rel="noopener noreferrer">
                Artificial Intelligence: A Conversation with ELIZA
              </a>
              <div className="author">Scientific American</div>
              <div className="year">1977</div>
            </li>
          </ul>
        </section>

        <section className="resources-section">
          <h3>Recursos Online</h3>
          <ul className="resources-list">
            <li>
              <a href="https://www.masswerk.at/elizabot/" target="_blank" rel="noopener noreferrer">
                ELIZA Implementation by Masswerk
              </a>
              <div className="author">Norbert Landsteiner</div>
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/ELIZA" target="_blank" rel="noopener noreferrer">
                ELIZA - Wikipedia
              </a>
              <div className="author">Wikipedia</div>
            </li>
            <li>
              <a href="https://pt.wikipedia.org/wiki/ELIZA" target="_blank" rel="noopener noreferrer">
                ELIZA - Wikipedia Português
              </a>
              <div className="author">Wikipedia</div>
            </li>
            <li>
              <a href="https://liacademy.co.uk/the-story-of-eliza-the-ai-that-fooled-the-world/" target="_blank" rel="noopener noreferrer">
                The Story of ELIZA: The AI That Fooled the World
              </a>
              <div className="author">LI Academy</div>
            </li>
          </ul>
        </section>
      </aside>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
