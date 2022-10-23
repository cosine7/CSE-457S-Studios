import {
  timeParse, json, scaleOrdinal, schemeSet3,
} from 'd3';
import StackedAreaChart from './stackedAreaChart';
import Timeline from './timeline';
import '../styles/style.css';

const parseDate = timeParse('%Y');

const { layers, years } = await json('data/uk-household-purchases.json');

layers.forEach(d => {
  Object.keys(d).forEach(key => {
    d[key] = key === 'Year'
      ? parseDate(d[key].toString())
      : parseFloat(d[key]) * 1.481105 / 100;
  });
});

years.forEach(d => {
  d.Expenditures = parseFloat(d.Expenditures) * 1.481105 / 100;
  d.Year = parseDate(d.Year.toString());
});

const dataKeys = Object.keys(layers[0]).filter(d => d !== 'Year');

const colorScale = scaleOrdinal()
  .domain(dataKeys)
  .range(schemeSet3);

const areaChart = new StackedAreaChart('#stacked-area-chart', layers, colorScale);
const timeline = new Timeline('#timeline', years, brushed);

function brushed({ selection }) {
  const domain = selection ? selection.map(timeline.x.invert) : timeline.x.domain();
  areaChart.x.domain(domain);
  areaChart.updateVis();
}
