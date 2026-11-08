# Moema — teaser do kart

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
| 1,40 s | O kart da Moema entra **ao fundo**, longe e abafado, por baixo da música, e vem se aproximando. |
| 3,60–4,80 s | Vento cresce e a música abaixa suavemente para cerca de 40% do volume, ficando ao fundo até 7,50 s. |
| 4,95–5,15 s | O papel **estufa**: brilho no centro e sombra em anel, como um banner empurrado por trás, com um rangido de papel esticando. |
| 5,15 s | O banner **rasga como papel**: buraco irregular com borda de fibras brancas e sete abas do próprio banner que dobram para a câmera (mostrando o verso branco). A Moema aparece pela abertura que se forma entre as abas e atravessa. Estouro abafado e som de rasgo. |
| 5,15–7,50 s | Aproximação acelerada, centrada no símbolo da universidade. Tiras de papel leves tremulam, são freadas pelo ar e caem. |
| 7,50–8 s | Corte abrupto para preto absoluto e silêncio, sem cauda de impacto. |

A superfície do banner permanece no mesmo enquadramento; só o estufamento, o buraco, as abas e as tiras se movem.

## Por que papel, e não vidro

A versão anterior revelava `logo-rasgada.png`, que tem rachaduras finas atravessando o pôster inteiro, e jogava fragmentos rígidos: a leitura era de vidro estilhaçando. Agora o rasgo é feito em tempo real sobre o banner inteiro (`logo-inteira.jpg`):

- **Borda:** irregular, com lóbulos largos e dentes finos, e uma faixa branca de fibras (o miolo do papel).
- **Abas:** sete fatias do próprio banner, presas ao contorno, dobram de 66° a 96° na direção da câmera, passam um pouco do ponto e balançam até assentar. Como dobram para quem olha, o que aparece é o verso, branco como o de um papel de verdade.
- **Tiras:** irregulares, com a impressão na frente e o verso branco atrás. O arrasto do ar freia as tiras, que caem devagar, oscilando.
- **Som:** papel esticando, um "puf" abafado, o rasgo com estalos de fibra e as abas e tiras esvoaçando, sem o estrondo grave.

`logo-rasgada.png` não é mais usada no teaser, mas continua no repositório.

## Referências e áudio

- Banner: `public/components/logos/logo-inteira.jpg`, ocupando toda a tela. O rasgo, as abas e as tiras recortam esta mesma imagem.
- Moema e kart: `public/components/personagens/ema.png`, com proporção original, cores e símbolo preservados.
- Música enviada: `public/audio/audio-gta.mp3`. A composição toca o arquivo desde 0,00 s, começando em 0,75 s da composição e seguindo até o corte em 7,50 s. O volume cresce com o banner e abaixa quando o kart se aproxima, sem sumir.
- Kart, vento, papel esticando, estouro e rasgo: stems estéreo determinísticos em 48 kHz, sintetizados por `python scripts/teaser-audio.py` (só a biblioteca padrão do Python). O `teaser-startup.wav` (ignição de perto) continua sendo gerado, mas não entra mais no teaser: o kart vem de longe.

A animação usa as imagens em camadas com perspectiva: não é uma reconstrução tridimensional articulada da personagem. A escala segue distância inversa à câmera, com aceleração progressiva. O motion blur temporal do kart usa três amostras e obturador de 90°, com `CameraMotionBlur` para compatibilidade entre Studio e renderização.

## Arquivos de edição

- `src/Root.tsx`: resolução, duração, FPS e trecho musical.
- `src/timeline.ts`: marcos em segundos.
- `src/Composition.tsx`: montagem e trilhas nomeadas.
- `src/layers/MotionScene.tsx`: fade, estufamento e buraco do banner (`BannerLayer`), abas de papel (`FlapsLayer`), aproximação do kart (`KartLayer`) e tiras (`DebrisLayer`).
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
