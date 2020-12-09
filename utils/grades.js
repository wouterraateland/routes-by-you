const fontPoints = {
  2: 250,
  "2+": 275,
  3: 300,
  "3+": 333,
  "4-": 367,
  4: 400,
  "4+": 433,
  "5-": 467,
  5: 500,
  "5+": 550,
  "6A": 600,
  "6A+": 617,
  "6B": 633,
  "6B+": 650,
  "6C": 667,
  "6C+": 683,
  "7A": 700,
  "7A+": 717,
  "7B": 733,
  "7B+": 750,
  "7C": 767,
  "7C+": 783,
  "8A": 800,
  "8A+": 817,
  "8B": 833,
  "8B+": 850,
  "8C": 867,
  "8C+": 883,
  "9A": 900,
};

export const fontToPoints = (font) => fontPoints[font];
export const pointsToFont = (points) =>
  Object.entries(fontPoints).find((entry) => entry[1] >= points)?.[0];

export const pointsToHsl = (points) => `hsl(${150 - points / 4}deg, 100%, 50%)`;
