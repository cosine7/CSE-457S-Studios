import {
  select, scaleLog, min, max, scaleLinear, csv, scaleOrdinal, schemeAccent, axisBottom, axisLeft,
} from 'd3';

const margin = {
  top: 25,
  left: 25,
  bottom: 25,
  right: 25,
};

const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.bottom + margin.top);

const converter = d => ({
  country: d.Country,
  income: Number(d.Income),
  lifeExpectancy: Number(d.LifeExpectancy),
  population: Number(d.Population),
  region: d.Region,
});

const data = await csv('data/wealth-health-2014.csv', converter);

const incomeScale = scaleLog()
  .base(2)
  .domain([min(data, d => d.income) - 100, max(data, d => d.income) + 100])
  .range([0, width]);

const lifeExpectancyScale = scaleLinear()
  .domain([min(data, d => d.lifeExpectancy) - 5, max(data, d => d.lifeExpectancy) + 5])
  .range([height, 0]);

const radiusScale = scaleLinear()
  .domain([min(data, d => d.population), max(data, d => d.population)])
  .range([4, 30]);

const colorPalette = scaleOrdinal(schemeAccent)
  .domain(data.map(d => d.region));

const xAxis = axisBottom()
  .scale(incomeScale)
  .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000]);

const yAxis = axisLeft()
  .scale(lifeExpectancyScale);

const text = svg
  .append('g')
  .attr('class', 'axis x-axis')
  .attr('transform', `translate(${margin.left},${height + margin.top})`)
  .call(xAxis)
  .append('text')
  .attr('class', 'axis-label')
  .text('Income per Person (GDP per Capita)')
  .attr('text-anchor', 'start');

text
  .attr('transform', `translate(${width - text.node().getBoundingClientRect().width},-5)`);

svg
  .append('g')
  .attr('class', 'axis y-axis')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .call(yAxis)
  .append('text')
  .attr('class', 'axis-label')
  .text('Life Expectancy')
  .attr('transform', 'rotate(-90) translate(0,15)');

svg
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .selectAll('circle')
  .data(data.sort((a, b) => b.population - a.population))
  .enter()
  .append('circle')
  .attr('cx', d => incomeScale(d.income))
  .attr('cy', d => lifeExpectancyScale(d.lifeExpectancy))
  .attr('r', d => radiusScale(d.population))
  .attr('stroke', 'gray')
  .attr('fill', d => colorPalette(d.region));
