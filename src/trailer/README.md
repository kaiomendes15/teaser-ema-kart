# EmaKartTrailer

Composição completa: **91,55 s, 1920 × 1080, 60 FPS, 5493 quadros**.

Prévia: http://localhost:3000/EmaKartTrailer, na pasta `Trailer-completo` do Studio.

| Tempo | Montagem |
| --- | --- |
| 0–8,50 s | `animacao-emakart.mp4`, com fade de saída de 1 s durante a corrida ilustrada. O encerramento de premiação do arquivo é omitido. |
| 8,10–24,10 s | Os cinco patrocínios, entrando sobre a saída da animação. O cartão de título intermediário foi removido. |
| 23,30 s | O motor começa discretamente sob a saída da última logo. |
| 23,80–28,50 s | Teaser original de 3,75 a 8,45 s: banner, partida, ruptura e aproximação. |
| 28,50–30,50 s | Respiro em preto com antecipação suave de Cars. |
| 30,50–91,55 s | Showcase completo: detalhes dos pilotos, drift, habilidades, corrida, elenco e assinatura final. |

O áudio da animação continua até 9,90 s, sob os primeiros patrocínios, com saída de quase 3 s. GTA VI começa em 7 s, saindo do silêncio até ganho de apenas 0,02 em 9 s. Cresce progressivamente durante os patrocínios até o ganho anterior de 0,24 em **25,20 s**, quando o banner está completamente revelado. Depois diminui sob os efeitos e termina em 29,50 s, durante a antecipação de Cars no preto.

O banner entra com fade de 1 s e escurece nos últimos 0,4 s. Depois há **2 s de preto**, de 28,50 a 30,50 s. Um trecho de Cars entra discretamente durante esse intervalo, crescendo até ganho de 0,18 e desaparecendo sobre o início do showcase.

A montagem principal do showcase e seu áudio Cars começam juntos em **30,50 s**, ambos do ponto original. A antecipação é uma faixa separada: não desloca a música principal nem elimina os primeiros planos. A imagem é revelada em 0,4 s; Cars chega ao ganho de 0,9 em 1,5 s. A cauda de motor termina ainda durante o preto, em 29,30 s. Na troca em 51,82 s, Cars diminui durante 5 s, até 56,82 s. Cloudtop começa do silêncio e chega a apenas 0,025 de ganho nos primeiros 1,5 s; cresce até 0,24 em 56,82 s e só chega ao ganho final de 0,32 em 58,82 s. O nível final foi reduzido de 0,45 para 0,32 (cerca de −3 dB), evitando uma subida brusca de intensidade em relação ao áudio do filme. As curvas são cúbicas suaves e o encerramento musical mantém o fade de 1,5 s.

`EmaKartTrailer.tsx` contém os blocos nomeados e as pontes de áudio. O showcase recebe um limite próprio de 3663 quadros. Suas músicas internas e os efeitos internos do teaser estão desativados nesta composição: as faixas e os efeitos ficam no áudio principal para que as trocas de cena não cortem suas caudas. As composições individuais continuam disponíveis com sua montagem original.

Os arquivos originais não são recodificados. Não é necessário exportar um MP4 para revisar esta composição no Studio.

## Encerramento e revisão

A assinatura usa a logo oficial `public/components/logos/emakart-lendas-da-unifor-logo.png`, com proporções e transparência preservadas, centralizada em uma área de 1200 × 840 px. A saída do elenco tem fade de 0,3 s; a logo entra em 0,6 s e desaparece junto à música nos últimos 1,5 s. O último quadro é preto.

A revisão técnica cobre os 26 planos, as 12 faixas de áudio e a sequência completa de 91,55 s. Veja [o registro de validação](VALIDACAO.md).
