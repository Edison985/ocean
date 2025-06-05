module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    /* colors: {
      ocean1: "#182540",
      ocean2: "#6D80A6",
      ocean3: "#3C4659",
      ocean4: "#7B89A6",
      ocean5: "#F2F2F2",
      white: "#FFFFFF"
    }, */
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },    
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
