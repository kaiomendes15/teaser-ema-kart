# Revisão do EmaKartTrailer

Composição: 5493 quadros, 60 FPS, 1920 × 1080, duração de 91,55 s.

## Ajustes desta revisão

- A assinatura tipográfica provisória foi substituída pela logo oficial `emakart-lendas-da-unifor-logo.png`, preservando proporções e transparência.
- A logo fica centralizada, com margens de segurança, sem slogan ou texto sobreposto à arte.
- O último plano do elenco escurece durante 0,3 s antes da logo.
- A logo entra em 0,6 s e sai nos mesmos 1,5 s do fade musical final. O último quadro é preto.
- A ordem dos blocos, os pontos de entrada das músicas, a pausa de 2 s e a transição musical aos 52 s foram preservados.

## Verificações

| Verificação | Resultado |
| --- | --- |
| 26 planos do showcase | Arquivos presentes; todos os pontos de entrada e durações cabem nas gravações originais. |
| 12 clipes de áudio do trailer | Arquivos presentes; recortes dentro da duração de cada fonte; curvas com ganhos finitos entre 0 e 1. |
| Mixagem completa | Reconstruída com os ganhos da composição em PCM estéreo a 12 kHz para análise de amplitude. Pico amostral de aproximadamente −6,02 dBFS, sem amostras saturadas. |
| Prévia no Studio | 64 posições distribuídas pela duração inteira, incluindo entradas e saídas dos blocos, troca musical, elenco e encerramento. Nenhum erro de execução nessas posições. |
| Imagens da montagem | Inspeção visual das 64 posições. O preto intencional entre teaser e showcase está de 28,50 a 30,50 s. Não foram encontrados quadros vazios inesperados nas amostras. |
| Logo oficial | Conferida visível em 89,25 s, sem recorte ou distorção. |
| Último quadro | Conferido preto no quadro 5492, com ganho musical igual a zero. |
| Código | ESLint, TypeScript, formatação dos arquivos alterados e `git diff --check` passaram. |

A análise de áudio verifica amplitudes e transições de ganho; não é uma avaliação por escuta. A inspeção visual usa amostras da prévia e não uma exportação completa de todos os quadros.
