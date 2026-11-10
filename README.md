# Moema — teaser do kart

Composição `EmaKartTeaser`: **26 segundos, 1920 × 1080 (16:9), 60 FPS, 1560 quadros**.

## Composições no Studio

- `Trailer-completo / EmaKartTrailer`: montagem completa com animação, título, patrocínios, teaser e showcase, em 91,55 s. [Estrutura e transições](src/trailer/README.md).
- `Introducao / EmaKartTeaser`: teaser do kart existente, com sua montagem preservada.
- `Historia-em-quadrinhos / DesafioUniforHQ`: novo motion comic independente, 24 s em 1080p/60 FPS. [Detalhes e edição](src/comic/README.md).

Prévia da HQ: http://localhost:3000/DesafioUniforHQ

## Prévia

```sh
npm run dev
```

Abra http://localhost:3000/EmaKartTeaser e ative o áudio do player.

## Sequência

| Tempo | Imagem e som |
| --- | --- |
| 0–2 s | Tela completamente preta e silêncio. |
| 2–2,75 s | Tela ainda preta; a música começa em volume baixo (5%) e cresce gradualmente. |
| 2,75–5,15 s | O banner aparece suavemente durante 2,4 s. A música continua crescendo até 72% quando o banner fica totalmente visível. |
| 5,15–5,35 s | Banner completamente visível e imóvel. |
| 5,35 s | Partida forte: pulsos de arranque, ignição grave e primeira acelerada. A música começa a diminuir. |
| 5,60–6,60 s | Vento e motor crescem; a música diminui suavemente para cerca de um terço do volume anterior e permanece ao fundo até 8,45 s. |
| 7,15 s | Impacto e rasgo sincronizados. Moema atravessa o centro do banner; fragmentos da própria impressão avançam em perspectiva. |
| 7,15–8,45 s | Aproximação rápida em 1,3 s, com fumaça emitida atrás das rodas e rastros de velocidade crescentes. O bico do kart e o símbolo preenchem a tela. |
| 8,45–10 s | Corte abrupto para preto absoluto e silêncio, sem cauda de impacto. |
| 10–13,2 s | Patrocínio: Ancine. |
| 13,2–16,4 s | Patrocínio: Caixa. |
| 16,4–19,6 s | Patrocínio: Missão. |
| 19,6–22,8 s | Patrocínio: Fortune Tiger. |
| 22,8–26 s | Patrocínio: Gordão Motors e encerramento em preto. |

Os patrocínios aparecem individualmente no centro, sobre fundo preto e em silêncio. Cada logo tem 0,8 s de fade-in, 1,3 s totalmente visível, 0,8 s de fade-out e 0,3 s de preto antes da próxima. As proporções originais são preservadas.

Não há pista, cenário externo ou personagem visível antes da ruptura. A superfície do banner permanece no mesmo enquadramento; apenas o buraco, suas bordas e os fragmentos se movem após o impacto.

## Referências e áudio

- Banner: `public/components/logos/logo-inteira.jpg`, ocupando toda a tela.
- Banner rasgado: `public/components/logos/logo-rasgada.png`, revelado do centro para fora no impacto, preservando as bordas e dobras da referência. As duas imagens usam enquadramento central com preenchimento 16:9, sem distorcer suas proporções.
- Fumaça e velocidade: `efeito-fumaca-kart.png`, `efeito-nivel2.png` e `efeito-nivel3.png`, em `public/components/efeitos/velocidade/`. A fumaça expande a partir das posições anteriores das rodas traseiras, atrás da personagem. Todas as emissões começam na ruptura e terminam no corte para preto.
- Moema e kart: `public/components/personagens/ema.png`, com proporção original, cores e símbolo preservados.
- Música enviada: `public/audio/audio-gta.mp3`. A composição toca o arquivo desde 0,00 s, começando em 2 s da composição, 0,75 s antes do banner, e seguindo até o corte em 8,45 s. O volume parte de 5% e cresce até 72% com a revelação completa do banner e diminui quando o motor entra, permanecendo audível ao fundo.
- Partida, motor, vento, impacto e rasgo: cinco stems estéreo determinísticos em 48 kHz, sintetizados por `python3 scripts/teaser-audio.py`. Os arquivos de áudio anteriores foram preservados.

A animação usa as imagens em camadas com perspectiva: não é uma reconstrução tridimensional articulada da personagem. A escala segue distância inversa à câmera, com aceleração progressiva. Fragmentos giram em 3D e usam recortes da impressão original. O motion blur temporal do kart usa três amostras e obturador de 90°, com `CameraMotionBlur` para compatibilidade entre Studio e renderização.

## Arquivos de edição

- `src/Root.tsx`: resolução, duração, FPS e trecho musical.
- `src/timeline.ts`: marcos em segundos.
- `src/Composition.tsx`: montagem e trilhas nomeadas.
- `src/layers/MotionScene.tsx`: fade, revelação da referência rasgada, aproximação e fragmentos.
- `src/layers/Sponsors.tsx`: ordem, tamanho e fades das cinco logos de `public/components/logos/patrocinios/`.
- `src/assets.ts`: caminhos das referências originais.

## Exportação

A prévia fica disponível no Studio. Para gerar o MP4 H.264 em 1080p/60:

```sh
npm run render
```

Destino: `out/EmaKartTeaser.mp4`.

## Validação

```sh
npm run lint
npx remotion still src/index.ts EmaKartTeaser out/review.png --frame=443
```

Os quadros 0, 164 e 507 devem ser inteiramente pretos. Os quadros 309 e 428 devem ser idênticos, garantindo a imobilidade e a ocultação da Moema antes do impacto. O quadro 506 deve estar preenchido pelo símbolo. Todas as trilhas terminam antes ou no quadro 507.
