import {
  select, scaleBand, scaleLinear, csv, max, axisBottom, axisLeft, easeLinear,
} from 'd3';
import csvFile from '../data/coffee-house-chains.csv';
import '../styles/style.css';

const margin = {
  top: 40, right: 10, bottom: 60, left: 60,
};

const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = select('#chart-area-activity2')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const rectGroup = svg
  .append('g')
  .attr('transform', `translate(${margin.left + 8},${margin.top})`);

let ascending = true;

// Scales
const x = scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1);

const y = scaleLinear()
  .range([height, 0]);

const selectTag = document.getElementById('ranking-type');

const xAxisGroup = svg
  .append('g')
  .attr('class', 'axis x-axis')
  .attr('transform', `translate(${margin.left + 8},${margin.top + height})`);

const yAxisGroup = svg
  .append('g')
  .attr('class', 'axis y-axis')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const text = yAxisGroup
  .append('text')
  .attr('x', 0)
  .attr('y', -10)
  .attr('fill', 'gray');

const xAxisScale = axisBottom().scale(x);
const yAxisScale = axisLeft().scale(y);

// // Render visualization
function updateVisualization() {
  const { data } = window;
  const property = selectTag.value;

  if (ascending) {
    data.sort((a, b) => b[property] - a[property]);
  } else {
    data.sort((a, b) => a[property] - b[property]);
  }

  x.domain(data.map(d => d.company));
  y.domain([0, max(data, d => d[property])]);

  xAxisGroup
    .transition()
    .duration(1000)
    .call(xAxisScale);

  yAxisGroup
    .transition()
    .duration(1000)
    .ease(easeLinear)
    .call(yAxisScale);

  text.text(property);

  rectGroup
    .selectAll('rect')
    .data(data, d => d.company)
    .join(
      enter => enter
        .append('rect')
        .attr('x', d => x(d.company))
        .classed('bar', true)
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .transition()
        .duration(1000)
        .attr('height', d => height - y(d[property]))
        .attr('y', d => y(d[property])),
      update => update
        .transition()
        .style('opacity', 0.5)
        .duration(1000)
        .attr('x', d => x(d.company))
        .attr('y', d => y(d[property]))
        .attr('height', d => height - y(d[property]))
        .style('opacity', 1),
      exit => exit.remove(),
    );
}
selectTag.addEventListener('change', updateVisualization);

document.getElementById('change-sorting').addEventListener('click', () => {
  ascending = !ascending;
  updateVisualization();
});

// // Create a 'data' property under the window object
// // to store the coffee chain data
Object.defineProperty(window, 'data', {
  // data getter
  get() { return this._data; },
  // data setter
  set(value) {
    this._data = value;
    // update the visualization each time the data property is set by using the equal sign (e.g. data = [])
    updateVisualization();
  },
});

// Load CSV file
window.data = await csv(csvFile, d => {
  d.revenue = Number(d.revenue);
  d.stores = Number(d.stores);
  return d;
});
// Store csv data in global variable
// updateVisualization gets automatically called within the data = csv call;
// basically(whenever the data is set to a value using = operator);
// see the definition above: Object.defineProperty(window, 'data', { ...
