const { url } = require('inspector');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        // website_bg: 'url(../public/assets/website-bg.png)',
        // pattern: 'url(../public/assets/turtle-pattern.png)',
        // avtar: 'url(../public/assets/website/avtar.webp)',
      },
    },
    colors: {
      yellow: '#BDFF00',
      grey: '#858585',
      black: '#000',
      white: '#FFF',
      blueish: '#125F83',
      blue: '#1D095F',
      lightblue: '#9FE4FF',
      lightgrey: '#e5e7eb',
      whiteish: '#F1FCFF',
      sand: '#E7C7B4',
      greyish: '#F8F8F8',
      purple: '#4E2672',
      red: '#ff0000',
      purpleish: '#C2CCF1',
    },
  },
  fontSize: {
    big: ['70px'],
    small: ['12px'],
    web_normal: ['14px'],
    web_large: ['36px'],
    web_title: ['48px'],
    mobile_normal: ['10px'],
    mobile_large: ['24px'],
    mobile_title: ['36px'],
  },
  plugins: [],
};
