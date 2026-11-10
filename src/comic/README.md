# Desafio Unifor — motion comic

Composição independente: `DesafioUniforHQ`, **24 s, 1920 × 1080, 60 FPS, 1440 quadros**.

Prévia: http://localhost:3000/DesafioUniforHQ

A introdução anterior continua em `Introducao / EmaKartTeaser`. A nova composição aparece em `Historia-em-quadrinhos / DesafioUniforHQ`.

## Arte e movimento

A animação usa diretamente `public/frames/historia-quadrinhos/Desafio-unifor.png` (1672 × 941). Os arquivos individuais foram consultados como referência narrativa. A página não foi redesenhada e seus textos não são reescritos: recortes e zooms preservam as proporções dos pixels da arte original.

Os oito quadros são revelados da esquerda para a direita, com máscaras próprias, divisórias pretas e movimentos de câmera na ordem de leitura. A imagem inteira de cada quadro recebe movimento uniforme de câmera. Não há recortes internos deslocados, personagens duplicados ou pedaços de fundo sobrepostos. Partículas, brilho elétrico, linhas de vento e água e realces de raízes complementam a arte. A página completa aparece antes da aproximação final no título e nos karts.

Os personagens permanecem na arte original íntegra; a sensação de movimento vem da câmera e dos efeitos de luz, energia, partículas, vento e água. Isso evita emendas, contornos duplicados e deformações.

| Tempo       | Ação                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| 0–4 s | Preto inicial, primeiro quadro, movimento de câmera e passos. |
| 4–7 s | Esbarrão, foco no livro, impacto e descarga elétrica da EQ-73. |
| 7–10 s | Energia azul, livro flutuando, partículas e vibração da máquina. |
| 10–13 s | Aproximação das lendas e da reação original de Moema. |
| 13–15,5 s | Curupira: realce progressivo das raízes, poeira e rompimento do solo. |
| 15,5–18 s | Saci: vórtice girando e resíduos voando. |
| 18–20,5 s | Boto: ondulações, respingos e efeitos de inundação. |
| 20,5–24 s | Página completa e aproximação final no desafio e nos karts. |

O clipe termina na história, sem incluir gameplay.

## Áudio

Trilha de aventura original sintetizada, crescente, com motivo melódico e percussão. Efeitos separados de passos, papel, livro, energia, aparição, raízes, vórtice, água e karts em `public/audio/comic/`, estéreo a 48 kHz. A música de GTA e os arquivos de áudio da introdução não entram nesta composição.

Recriar os sons: `python3 scripts/comic-audio.py`.

## Edição e exportação

- `comicTimeline.ts`: recortes, ordem, tempos e posições de câmera.
- `ComicPage.tsx`: revelações, câmera e efeitos internos.
- `ComicTeaser.tsx`: montagem e trilhas nomeadas no Studio.

Prévia: `npm run dev`.

Exportar, quando necessário: `npm run render:comic` → `out/DesafioUniforHQ.mp4`.

Verificação: `npm run lint`. A revisão visual usa quadros intermediários do campus, esbarrão e transformações, além do título final.
