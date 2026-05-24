---
trigger: always_on
---
# Diretrizes de Logging para Rapport GenAI Router

## Obrigatoriedade

Todo código deve implementar logging abrangente para depuração, monitoramento e auditoria.

## Formato das Linhas de Log

Cada linha de log deve seguir o padrão estruturado:

```
[EMOTICON] [YYYY-MM-DD HH:MM:SS] [ARQUIVO] [FUNÇÃO:LINHA] MENSAGEM | parâmetros_relevantes
```

### Especificações:

- **EMOTICON**: Identificador visual conforme contexto (ver tabela abaixo)
- **Data/Hora**: Formato ISO 8601 com precisão de segundos
- **Arquivo**: Nome do arquivo sem extensão
- **Função**: Nome da função onde o log é gerado
- **Linha**: Número da linha exata do código
- **Mensagem**: Descrição clara e concisa do evento
- **Parâmetros**: Apenas dados não sensíveis, formatados como chave=valor

## Tabela de Emoticons por Contexto

| Contexto            | Emoticon               | Uso                                            |
| ------------------- | ---------------------- | ---------------------------------------------- |
| Início de processo | `rocket`             | `Iniciando processo de roteamento`           |
| Sucesso/Conclusão  | `white_check_mark`   | `Processo concluído com sucesso`            |
| Erro/Falha          | `x`                  | `Erro ao carregar arquivo de configuração` |
| Aviso/Atenção     | `warning`            | `Parâmetro opcional não fornecido`         |
| Informação        | `information_source` | `Sistema inicializado`                       |
| Depuração         | `bug`                | `Variável temporária criada`               |
| Performance         | `stopwatch`          | `Tempo de processamento: 2.3s`               |
| Dados/Entrada       | `inbox_tray`         | `Recebidos 150 componentes`                  |
| Saída/Resultado    | `outbox_tray`        | `Gerado arquivo de relatório`               |
| Configuração      | `gear`               | `Configuração carregada do arquivo`        |
| Rede/Comunicação  | `satellite`          | `Conectado ao servidor Ollama`               |
| Banco de Dados      | `file_folder`        | `Dados salvos no banco`                      |
| Validação         | `heavy_check_mark`   | `Validação de DRC passou`                  |
| Recurso/Sistema     | `computer`           | `Uso de memória: 512MB`                     |

## Níveis de Log

- **DEBUG**: Detalhes técnicos para desenvolvimento
- **INFO**: Informações gerais de operação
- **WARNING**: Situações anômalas não críticas
- **ERROR**: Erros que não interrompem execução
- **CRITICAL**: Erros graves que podem causar falha

## Armazenamento

- **Diretório Base**: `logs/`
- **Estrutura**: `logs/tipo_data/arquivo.log`
- **Rotação**: Arquivos rotacionados diariamente
- **Compressão**: Logs com mais de 7 dias devem ser comprimidos

## Exemplos de Implementação

### Python

```python
import logging
from datetime import datetime

def setup_logging():
    logging.basicConfig(
        level=logging.DEBUG,
        format='[%(emoticon)s] [%(asctime)s] [%(filename)s] [%(funcName)s:%(lineno)d] %(message)s | %(params)s',
        handlers=[
            logging.FileHandler('logs/routeai.log'),
            logging.StreamHandler()
        ]
    )

# Uso
logger.info("rocket", "Iniciando processo de roteamento", extra={
    'emoticon': 'rocket',
    'params': 'componentes=150, camadas=4'
})
```

## Segurança e Privacidade

- Nunca logar senhas, tokens ou chaves de API
- Mascarar dados sensíveis: `senha=***`, `token=****`
- Usar hash para identificadores sensíveis quando necessário

## Performance

- Logs síncronos apenas para erros críticos
- Usar logging assíncrono para operações de alta frequência
- Implementar buffering para reduzir I/O

## Integração com --debug

Quando a flag `--debug` estiver presente:

- Ativar nível DEBUG em todos os módulos
- Incluir stack trace completo em erros
- Adicionar informações de contexto adicionais
- Gerar logs de performance detalhados

## Validação

- Todo log deve ser validado quanto ao formato
- Testes devem verificar presença de logs em pontos críticos
- Logs devem ser verificáveis quanto à precisão dos dados
