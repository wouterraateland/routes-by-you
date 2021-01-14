const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: {
    content: ["./**/*.jsx", "./**/*.js"],
    options: {
      safelist: ["stroke-0", "stroke-1", "stroke-2", "stroke-3", "stroke-4"],
    },
  },
  darkMode: "class",
  theme: {
    extend: {
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
      },
      strokeWidth: {
        3: "3",
        4: "4",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".pt-safe": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".pl-safe": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".pr-safe": {
          paddingRight: "env(safe-area-inset-right)",
        },
        ".pb-safe": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".disable-scrollbars": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
            display: "none",
          },
          "& *": {
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          },
        },
        ".no-tap-highlighting": {
          "webkit-tap-highlight-color": "rgba(0,0,0,0)",
        },
      });
    }),
  ],
};
