# Moema — teaser do kart

O showcase de funcionalidades tem uma composição independente, `EmaKartShowcase`.
Veja [SHOWCASE.md](SHOWCASE.md) para a sequência, a prévia e os controles de edição.

Composição `EmaKartTeaser`: **8 segundos, 1920 × 1080 (16:9), 60 FPS, 480 quadros**.

## Prévia

```sh
npm run dev
```

Abra http://localhost:3000/EmaKartTeaser e ative o áudio do player.

## Sequência

| Tempo | Imagem e som |
| --- | --- |
| 0–0,75 s | Tela completamente preta e silêncio. |
| 0,75–3,15 s | Música e banner começam juntos: ambos aumentam suavemente durante 2,4 s, com a música partindo do volume zero. |
| 3,15–3,35 s | Banner completamente visível e imóvel. |
| 3,35 s | Partida forte: pulsos de arranque, ignição grave e primeira acelerada. A música começa a diminuir. |
| 3,60–4,60 s | Vento e motor crescem; a música diminui suavemente para cerca de um terço do volume anterior e permanece ao fundo até 7,50 s. |
| 5,15 s | Impacto e rasgo sincronizados. Moema atravessa o centro do banner; fragmentos da própria impressão avançam em perspectiva. |
| 5,15–7,50 s | Aproximação acelerada, centrada no símbolo da universidade. O bico do kart e o símbolo preenchem a tela. |
| 7,50–8 s | Corte abrupto para preto absoluto e silêncio, sem cauda de impacto. |

Não há pista, cenário externo ou personagem visível antes da ruptura. A superfície do banner permanece no mesmo enquadramento; apenas o buraco, suas bordas e os fragmentos se movem após o impacto.

## Referências e áudio

- Banner: `public/components/logos/logo-inteira.jpg`, ocupando toda a tela.
- Banner rasgado: `public/components/logos/logo-rasgada.png`, revelado do centro para fora no impacto, preservando as bordas e dobras da referência. As duas imagens usam enquadramento central com preenchimento 16:9, sem distorcer suas proporções.
- Moema e kart: `public/components/personagens/ema.png`, com proporção original, cores e símbolo preservados.
- Música enviada: `public/audio/audio-gta.mp3`. A composição toca o arquivo desde 0,00 s, começando em 0,75 s da composição e seguindo até o corte em 7,50 s. O volume cresce com o banner e diminui quando o motor entra, permanecendo audível ao fundo.
- Partida, motor, vento, impacto e rasgo: cinco stems estéreo determinísticos em 48 kHz, sintetizados por `python3 scripts/teaser-audio.py`. Os arquivos de áudio anteriores foram preservados.

A animação usa as imagens em camadas com perspectiva: não é uma reconstrução tridimensional articulada da personagem. A escala segue distância inversa à câmera, com aceleração progressiva. Fragmentos giram em 3D e usam recortes da impressão original. O motion blur temporal do kart usa três amostras e obturador de 90°, com `CameraMotionBlur` para compatibilidade entre Studio e renderização.

## Arquivos de edição

- `src/Root.tsx`: resolução, duração, FPS e trecho musical.
- `src/timeline.ts`: marcos em segundos.
- `src/Composition.tsx`: montagem e trilhas nomeadas.
- `src/layers/MotionScene.tsx`: fade, revelação da referência rasgada, aproximação e fragmentos.
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
npx remotion still src/index.ts EmaKartTeaser out/review.png --frame=323
```

Os quadros 0 e 450 devem ser inteiramente pretos. Os quadros 189 e 308 devem ser idênticos, garantindo a imobilidade e a ocultação da Moema antes do impacto. O quadro 449 deve estar preenchido pelo símbolo. Todas as trilhas terminam antes ou no quadro 450.
