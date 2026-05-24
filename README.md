![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.Eliza)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow)
![Status](https://img.shields.io/badge/Status-Experimento%20Social-brightgreen)
![GitHub Stars](https://img.shields.io/github/stars/carlosdelfino/Eliza?style=social)
![GitHub Forks](https://img.shields.io/github/forks/carlosdelfino/Eliza?style=social)
![GitHub Issues](https://img.shields.io/github/issues/carlosdelfino/Eliza)
![Repository Size](https://img.shields.io/github/repo-size/carlosdelfino/Eliza)
![Last Commit](https://img.shields.io/github/last-commit/carlosdelfino/Eliza)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=220&section=header&text=Elisa%20-%20Chatbot%20Conversacional&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Experimento%20Social%20Inspirado%20no%20ELIZA&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Elisa Header"/>
</p>

# Elisa

Elisa é um experimento social sofisticado, inspirado no clássico ELIZA de Joseph Weizenbaum. Trata-se de um chatbot conversacional desenvolvido em React que conduz diálogos abertos e reflexivos, identificando temas recorrentes e devolvendo perguntas ou provocações cuidadosamente elaboradas para estimular o usuário a revelar camadas mais profundas de seu contexto pessoal e emocional.

## Como Executar

A aplicação é servida via HTTP simples e pode ser executada localmente sem dependências complexas:

```bash
python3 -m http.server 4173
```

Após iniciar o servidor, acesse `http://localhost:4173` no seu navegador.

### Arquitetura Técnica

- **Frontend**: React 18 via CDN (sem build step)
- **Persistência**: `localStorage` do navegador para memória conversacional
- **Processamento**: JavaScript puro no cliente
- **Servidor**: Não requer backend nem APIs externas

## Estrutura do Projeto

```
Eliza/
├── index.html          # Ponto de entrada HTML com scripts React
├── README.md           # Documentação do projeto
└── src/
    ├── App.jsx         # Lógica principal do chatbot Elisa
    └── styles.css      # Estilização da interface
```

### Descrição dos Componentes

- **index.html**: Arquivo HTML base que carrega React, ReactDOM e Babel via CDN, além de vincular os estilos e o script principal.
- **src/App.jsx**: Contém toda a lógica do chatbot, incluindo:
  - Sistema de regras inspirado no ELIZA original
  - Detecção de temas e palavras-chave
  - Mecanismo de reflexão pronominal
  - Gerenciamento de memória conversacional
  - Interface React com estado local
- **src/styles.css**: Define a aparência visual moderna e responsiva da interface de chat.

## Funcionalidades

Elisa implementa um conjunto sofisticado de técnicas de processamento de linguagem natural:

- **Extração de Palavras-chave**: Identifica termos significativos nas mensagens do usuário, filtrando stop-words em português.
- **Sistema de Regras Prioritárias**: Aplica regras hierarquizadas inspiradas no ELIZA original, com scores de relevância.
- **Decomposição e Remontagem**: Quebra frases do usuário em componentes e as reconstrói em perguntas reflexivas.
- **Espelhamento Pronominal**: Transforma perspectivas como "eu sinto" em "você sente", mantendo o fluxo conversacional.
- **Detecção de Temas**: Reconhece categorias como relacionamentos, trabalho, medo, futuro e identidade.
- **Memória Conversacional**: Mantém registro de tópicos, palavras recorrentes e fragmentos anteriores no `localStorage`.
- **Respostas Reflexivas**: Gera reflexões, perguntas abertas e frases ambíguas no estilo de uma leitura psicológica.
- **Reconhecimento de Encerramento**: Identifica frases de despedida como "tchau", "fim" e "obrigado".
- **Interface Moderna**: Interface de chat responsiva com indicadores de digitação e painel de memória.

## Sistema de Inteligência

### Temas Detectados

Elisa monitora dez categorias principais de temas:

1. **Relacionamentos**: amor, família, amigos, casamento, namoro
2. **Trabalho**: empresa, chefe, cliente, carreira, equipe
3. **Medo**: ansiedade, preocupação, insegurança, culpa, vergonha
4. **Futuro**: decisões, escolhas, planos, sonhos, objetivos
5. **Identidade**: autoconceito, sentimentos, desejos, capacidades
6. **Saúde**: doença, médico, tratamento, corpo, mente, bem-estar
7. **Criatividade**: arte, música, escrita, ideia, inspiração, expressão
8. **Espiritualidade**: fé, religião, oração, alma, sentido, propósito
9. **Aprendizado**: estudo, curso, livro, conhecimento, saber, ensinar
10. **Lazer**: diversão, jogo, filme, viagem, férias, descanso

### Regras de Transformação

O sistema utiliza regras de decomposição com padrões regex para identificar estruturas linguísticas específicas e gerar respostas apropriadas. Cada regra possui:

- **Palavras-chave**: Termos que ativam a regra
- **Rank**: Prioridade de execução (maior = mais prioritário)
- **Decomposições**: Padrões regex para capturar estruturas
- **Respostas**: Templates de resposta com placeholders para fragmentos capturados

### Memória Conversacional

Elisa mantém três tipos de memória:

- **Tópicos**: Contagem de menções por categoria temática
- **Palavras-chave**: Frequência de termos significativos
- **Stack**: Fragmentos recentes da conversa para referência contextual

## Referências

- [ELIZA - Masswerk](https://www.masswerk.at/elizabot/)
- [ELIZA - Wikipedia](https://pt.wikipedia.org/wiki/ELIZA)
- [The Story of ELIZA](https://liacademy.co.uk/the-story-of-eliza-the-ai-that-fooled-the-world/)
- [Weizenbaum, J. (1966). ELIZA—A Computer Program For the Study of Natural Language Communication Between Man and Machine](https://dl.acm.org/doi/10.1145/365808.365874)

## Modo de Depuração

Para ativar o modo de depuração e visualizar logs detalhados, adicione o parâmetro `--debug` à URL:

```
http://localhost:4173?debug=true
```

Os logs serão exibidos no console do navegador com informações detalhadas sobre:
- Processamento de mensagens
- Detecção de temas
- Aplicação de regras
- Atualizações de memória
- Tempo de processamento

## Licença

Este projeto é licenciado sob CC BY-SA 4.0 - Creative Commons Attribution-ShareAlike 4.0 International.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

**Resumo:** Este arquivo contém a documentação completa do projeto Elisa, um chatbot conversacional inspirado no ELIZA original.
**Data de Criação:** 2025-10-15
**Última Atualização:** 2026-05-23
