# Ema Kart — showcase inicial

Composição independente: `EmaKartShowcase`, **61,05 s / 3663 quadros / 1920 × 1080 / 60 FPS**.

Prévia: http://localhost:3000/EmaKartShowcase (`npm run dev` caso o Studio esteja fechado).

## Direção da montagem

Referência: [Cars — Tuner Scene but in 4K](https://www.youtube.com/watch?v=tVm6OWbUTG0).
Foram examinados planos da referência no navegador: detalhes mecânicos, traseira/escape e revelação dos carros. A adaptação usa os movimentos de câmera já gravados no jogo, sem introduzir cenários ou imagens do filme. Os quatro pilotos entram em blocos roda → escapamento → rosto. Cortes secos preservam o impacto dos detalhes e evitam dissoluções sobre ações rápidas.

Os 13 arquivos enviados são 1080p/60 FPS e **não contêm trilha de áudio**. Foram examinadas amostras de oito pontos de cada gravação. O MP3 tem 52,062 s; a abertura usa seus primeiros 21,55 s, com pequena entrada e saída de volume. Ataques espectrais medidos no arquivo orientaram os cortes da abertura, arredondados ao quadro. Isso é uma primeira sincronização técnica: o ajuste musical fino ainda deve ser revisado por escuta.

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
| 58,05–61,05 s | Assinatura tipográfica Ema Kart e saída para preto. |

A segunda parte está **sem música por enquanto**, pois a escolha ainda será enviada. Não há som de motor nas capturas e não foi acrescentado um motor artificial. A montagem continua normalmente após o áudio da abertura terminar. Seus tempos são provisórios até a definição da trilha.

## Editar

- `src/showcase/Showcase.tsx`: cortes individuais, títulos e mixagem.
- `src/showcase/assets.ts`: referências aos arquivos originais, sem renomeá-los nem recodificá-los.
- `src/Root.tsx`: registro separado e propriedades do showcase. O registro e os componentes do teaser anterior foram preservados.
- Cada plano é um nó JSX próprio com nome, início, duração e ponto de entrada visíveis no Studio. Tempos de montagem são quadros a 60 FPS; trims de origem são segundos convertidos por `fps`.

Para adicionar a próxima música, coloque-a em `public/audio/` e preencha `showcaseMusic` com `audio/nome-do-arquivo.mp3` nas propriedades da composição. `showcaseMusicStartSeconds` escolhe seu ponto de entrada. Ela entra em 21,55 s e tem fades próprios. Depois, ajuste os cortes à música escolhida.

`openingAudioStartSeconds` permite experimentar outro trecho do áudio de Cars; mudar esse valor exige revisar a sincronização dos cortes. Use `showTitles: false` para avaliar uma versão sem legendas. Os nomes das habilidades seguem os nomes dos arquivos enviados, não uma validação das mecânicas do jogo.

## Pontos para a próxima revisão

- O plano do elenco foi filmado na pista de testes, com paredes vermelhas, enquanto os demais usam o estacionamento. A mudança de cenário permanece visível; uma gravação do elenco no estacionamento daria maior continuidade.
- O trecho do Saci termina antes da passagem encoberta pela árvore; o turbo da Ema usa o trecho inicial, evitando outra obstrução mais adiante.
- O plano de mini-turbo já contém mudanças de câmera e câmera lenta; foi mantido na velocidade gravada.
- A assinatura final é tipográfica e provisória, sem reaproveitar a arte GTA do teaser anterior.

## Validação e exportação

`npm run lint` verifica ESLint e TypeScript. A revisão também conferiu os limites de origem e a continuidade dos 26 planos, além de quadros no Studio. Não foi exportado um MP4 nesta etapa; a entrega inicial é a composição editável.

Quando quiser exportar:

```sh
npx remotion render src/index.ts EmaKartShowcase out/EmaKartShowcase.mp4 --codec=h264 --pixel-format=yuv420p
```
