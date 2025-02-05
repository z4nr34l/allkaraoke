export const blueFillBase = '0, 153, 255';
export const blueFill = (a = 1) => `rgba(${blueFillBase}, ${a})`;
export const blueStroke = (a = 1) => `rgba(0, 77, 128, ${a})`;
export const redFillBase = '255, 54, 54';
export const redFill = (a = 1) => `rgba(${redFillBase}, ${a})`;
export const redStroke = (a = 1) => `rgba(117, 25, 25, ${a})`;

const playerColors = [
  {
    text: blueFillBase,
    star: {
      fill: 'rgba(255, 183, 0, .5)',
      stroke: 'rgba(255, 183, 0, 0)',
      lineWidth: 1,
    },
    perfect: {
      fill: blueFill(1),
      stroke: 'white',
      lineWidth: 1,
    },
    starPerfect: {
      fill: 'rgba(255, 213, 0, 1)',
      stroke: 'rgba(255, 183, 0, 1)',
      lineWidth: 2,
    },
    hit: {
      fill: blueFill(0.9),
      stroke: blueStroke(0),
      lineWidth: 1,
    },
    miss: {
      fill: blueFill(0.25),
      stroke: blueStroke(1),
      lineWidth: 1,
    },
  },
  {
    text: redFillBase,
    star: {
      fill: 'rgba(255, 183, 0, .5)',
      stroke: 'rgba(255, 183, 0, 0)',
      lineWidth: 1,
    },
    perfect: {
      fill: redFill(1),
      stroke: 'white',
      lineWidth: 1,
    },
    starPerfect: {
      fill: 'rgba(255, 213, 0, 1)',
      stroke: 'rgba(255, 183, 0, 1)',
      lineWidth: 2,
    },
    hit: {
      fill: redFill(0.9),
      stroke: redStroke(0),
      lineWidth: 1,
    },
    miss: {
      fill: redFill(0.25),
      stroke: redStroke(1),
      lineWidth: 1,
    },
  },
];

const styles = {
  colors: {
    players: playerColors,
    lines: {
      normal: {
        fill: 'rgba(127, 127, 127, .7)',
        stroke: 'black',
        lineWidth: 1,
      },
      star: {
        fill: 'rgba(158, 144, 106, 1)',
        stroke: 'rgba(255, 183, 0, 1)',
        lineWidth: 1,
      },
      freestyle: {
        fill: 'rgba(255, 255, 255, 0.1)',
        stroke: 'black',
        lineWidth: 2,
      },
    },
    text: {
      active: 'orange',
      activeBorder: 'rgb(101,75,22)',
      default: 'white',
      inactive: 'grey',
    },
  },
};

export default styles;
