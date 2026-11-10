// Coordinates refer to the supplied 1672 × 941 page, without resampling the art.
export const COMIC_PAGE = "frames/historia-quadrinhos/Desafio-unifor.png";
export const PANELS = [
  {
    id: "campus",
    start: 0.15,
    end: 4,
    polygon: "12,10 941,10 895,263 12,263",
    box: [12, 10, 929, 253],
  },
  {
    id: "collision",
    start: 4,
    end: 7,
    polygon: "951,10 1658,10 1658,263 906,263",
    box: [906, 10, 752, 253],
  },
  {
    id: "energy",
    start: 7,
    end: 10,
    polygon: "12,278 1658,278 1658,460 12,460",
    box: [12, 278, 1646, 182],
  },
  {
    id: "legends",
    start: 10,
    end: 13,
    polygon: "12,476 685,476 649,710 12,710",
    box: [12, 476, 673, 234],
  },
  {
    id: "roots",
    start: 13,
    end: 15.5,
    polygon: "698,476 1076,476 925,710 662,710",
    box: [662, 476, 414, 234],
  },
  {
    id: "vortex",
    start: 15.5,
    end: 18,
    polygon: "1088,476 1363,476 1240,710 939,710",
    box: [939, 476, 424, 234],
  },
  {
    id: "water",
    start: 18,
    end: 20.5,
    polygon: "1375,476 1658,476 1658,710 1254,710",
    box: [1254, 476, 404, 234],
  },
  {
    id: "challenge",
    start: 20.5,
    end: 24,
    polygon: "12,727 1658,727 1658,931 12,931",
    box: [12, 727, 1646, 204],
  },
] as const;

// Camera travels over the page in reading order; the final pullback reveals
// the assembled page, then the last push lands on the original title artwork.
export const CAMERA = [
  { time: 0.0, x: 470, y: 140, zoom: 1.72 },
  { time: 3.583784, x: 480, y: 145, zoom: 1.82 },
  { time: 4.6, x: 1282, y: 145, zoom: 2.03 },
  { time: 6.7, x: 1290, y: 140, zoom: 2.1 },
  { time: 7.6, x: 835, y: 355, zoom: 1.14 },
  { time: 9.55, x: 835, y: 358, zoom: 1.2 },
  { time: 10.54, x: 340, y: 586, zoom: 2.16 },
  { time: 12.64, x: 350, y: 584, zoom: 2.28 },
  { time: 13.36, x: 853, y: 591, zoom: 2.8 },
  { time: 15.250001, x: 862, y: 588, zoom: 2.94 },
  { time: 15.880001, x: 1151, y: 591, zoom: 2.8 },
  { time: 17.709999, x: 1165, y: 586, zoom: 2.93 },
  { time: 18.369999, x: 1460, y: 591, zoom: 2.8 },
  { time: 20.14, x: 1463, y: 586, zoom: 2.92 },
  { time: 20.92, x: 836, y: 471, zoom: 1.1 },
  { time: 21.69, x: 836, y: 650, zoom: 1.14 },
  { time: 23.09, x: 836, y: 811, zoom: 1.65 },
  { time: 23.953334, x: 836, y: 787, zoom: 2.35 },
];
