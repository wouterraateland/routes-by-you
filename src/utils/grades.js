export const fontByPoints = {
  250: "2",
  275: "2+",
  300: "3",
  333: "3+",
  367: "4-",
  400: "4",
  433: "4+",
  467: "5-",
  500: "5",
  550: "5+",
  600: "6A",
  617: "6A+",
  633: "6B",
  650: "6B+",
  667: "6C",
  683: "6C+",
  700: "7A",
  717: "7A+",
  733: "7B",
  750: "7B+",
  767: "7C",
  783: "7C+",
  800: "8A",
  817: "8A+",
  833: "8B",
  850: "8B+",
  867: "8C",
  883: "8C+",
  900: "9A",
};

export const fontToPoints = (font) =>
  Object.entries(fontByPoints).find((entry) => entry[1] === font)?.[0];
export const pointsToFont = (points) =>
  points
    ? Object.entries(fontByPoints).find((entry) => entry[0] >= points)?.[1]
    : "?";

export const pointsToHsl = (points) =>
  points ? `hsl(${150 - points / 4}deg, 100%, 50%)` : "hsl(0deg, 0%, 50%)";
