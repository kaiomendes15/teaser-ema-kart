# Ema Kart — showcase inicial

Composição independente: `EmaKartShowcase`, **61,05 s / 3663 quadros / 1920 × 1080 / 60 FPS**.

Prévia: http://localhost:3000/EmaKartShowcase (`npm run dev` caso o Studio esteja fechado).

## Direção da montagem

Referência: [Cars — Tuner Scene but in 4K](https://www.youtube.com/watch?v=tVm6OWbUTG0).
Foram examinados planos da referência no navegador: detalhes mecânicos, traseira/escape e revelação dos carros. A adaptação usa os movimentos de câmera já gravados no jogo, sem introduzir cenários ou imagens do filme. Os quatro pilotos entram em blocos roda → escapamento → rosto. Cortes secos preservam o impacto dos detalhes e evitam dissoluções sobre ações rápidas.

Os 13 arquivos enviados são 1080p/60 FPS e **não contêm trilha de áudio**. Foram examinadas amostras de oito pontos de cada gravação. O MP3 tem 52,062 s; a abertura usa seus primeiros 23,72 s, com pequena entrada e saída de volume. Ataques espectrais medidos no arquivo orientaram os cortes da abertura, arredondados ao quadro. Isso é uma primeira sincronização técnica: o ajuste musical fino ainda deve ser revisado por escuta.

## Estrutura

| Tempo | Conteúdo |
| --- | --- |
| 0–5,50 s | Ema: roda, escape, rosto. |
| 5,50–10,80 s | Saci: roda, escape, rosto. |
| 10,80–16,35 s | Curupira: roda, escape, rosto. |
| 16,35–21,55 s | Boto: roda, escape, rosto. |
| 21,55–29,55 s | Entrada da curva, drift, carga e mini-turbo. |
| 29,55–43,55 s | Redemoinho, proteção do Boto, cipó e pena/turbo da Ema. |
| 43,55–50,55 s | Drone, corrida e câmera orbital do bullet-time. |
| 50,55–58,05 s | Ema, Boto, Curupira, Saci e saída do elenco. |
| 58,05–61,05 s | Logo oficial Ema Kart — Lendas da Unifor e saída para preto. |

A segunda parte usa **Cloudtop Cruise (Thundercloud, Frontrunning)** a partir de **21,32 s** (quadro 1279, arredondado para 21,3167 s a 60 FPS). A música entra antes do drift, com transição de 2,4 s sobre o final de Cars, até 23,72 s. Não há som de motor nas capturas e não foi acrescentado um motor artificial.

## Escolha da trilha do showcase

Foram analisados os quatro arquivos locais de `public/audio/sountrack/`, comparando pulsação, regularidade dos ataques, intensidade e proximidade dos ataques aos cortes existentes. Esta é uma seleção técnica; a preferência de timbre e o resultado da transição ainda precisam de revisão por escuta no Studio.

| Faixa | Resultado para esta montagem |
| --- | --- |
| Cloudtop Cruise — Thundercloud, Frontrunning | Escolhida: pulsação mais marcada que a versão comum, em torno de 158 BPM. Quatro batidas duram cerca de 1,52 s, próximas dos planos de 1,5 s do elenco. |
| Cloudtop Cruise — Thundercloud | Alternativa com a mesma pulsação e ataques menos regulares; útil se a versão escolhida parecer carregada na escuta. |
| Mount Wario | Maior variação de intensidade e de padrão rítmico; opção para uma remontagem com progressão musical mais ampla. |
| N64 Royal Raceway | Pulsação regular em torno de 143 BPM, com andamento menor; menos adequada à aceleração desejada nesta edição. |

O trecho escolhido começa no quadro **2519 da música (41,9833 s)** e segue continuamente até aproximadamente **81,7167 s** do arquivo. O ponto de entrada foi escolhido pela proximidade dos ataques aos cortes, com peso maior para a apresentação do elenco e a assinatura. Os cortes visuais e a velocidade da música foram preservados; não há sincronização exata de todos os cortes às batidas.

A medição inicial (Cars até 21,55 s, antes do prolongamento da transição) encontrou aproximadamente **−21,2 LUFS** na abertura e **−14,2 LUFS** na nova música antes do ajuste de volume. O ganho da nova música é **0,5 (−6 dB)** para aproximar os níveis sem uma subida brusca. A entrada de Cloudtop Cruise e a saída de Cars usam curvas cúbicas em S complementares: Cloudtop parte do silêncio em 21,32 s e chega ao ganho de 0,5 em 23,72 s, enquanto Cars cai de 1 para 0 no mesmo intervalo. A entrada começa devagar para evitar um salto de volume. A música termina com fade de 1,5 s junto à assinatura.

## Editar

- `src/showcase/Showcase.tsx`: cortes individuais, títulos e mixagem.
- `src/showcase/assets.ts`: referências aos arquivos originais, sem renomeá-los nem recodificá-los.
- `src/Root.tsx`: registro separado e propriedades do showcase. O registro e os componentes do teaser anterior foram preservados.
- Cada plano é um nó JSX próprio com nome, início, duração e ponto de entrada visíveis no Studio. Tempos de montagem são quadros a 60 FPS; trims de origem são segundos convertidos por `fps`.

Para experimentar outra música, altere `showcaseMusic` nas propriedades da composição em `src/Root.tsx`. `showcaseMusicStartSeconds` escolhe seu ponto de entrada no arquivo. A trilha entra em 21,32 s da composição e tem fades próprios; as curvas de volume ficam em `ShowcaseAudio`, em `src/showcase/Showcase.tsx`.

`openingAudioStartSeconds` permite experimentar outro trecho do áudio de Cars; mudar esse valor exige revisar a sincronização dos cortes. Use `showTitles: false` para avaliar uma versão sem legendas. Os nomes das habilidades seguem os nomes dos arquivos enviados, não uma validação das mecânicas do jogo.

## Pontos para a próxima revisão

- O plano do elenco foi filmado na pista de testes, com paredes vermelhas, enquanto os demais usam o estacionamento. A mudança de cenário permanece visível; uma gravação do elenco no estacionamento daria maior continuidade.
- O trecho do Saci termina antes da passagem encoberta pela árvore; o turbo da Ema usa o trecho inicial, evitando outra obstrução mais adiante.
- O plano de mini-turbo já contém mudanças de câmera e câmera lenta; foi mantido na velocidade gravada.
- O encerramento usa `public/components/logos/emakart-lendas-da-unifor-logo.png`, preservando proporções e transparência. A logo entra em 0,6 s e sai em 1,5 s. O último plano do elenco tem fade de 0,3 s antes dela.

## Validação e exportação

`npm run lint` verifica ESLint e TypeScript. A revisão também conferiu os limites de origem e a continuidade dos 26 planos, além de quadros no Studio. Não foi exportado um MP4 nesta etapa; a entrega inicial é a composição editável.

Quando quiser exportar:

```sh
npx remotion render src/index.ts EmaKartShowcase out/EmaKartShowcase.mp4 --codec=h264 --pixel-format=yuv420p
```
