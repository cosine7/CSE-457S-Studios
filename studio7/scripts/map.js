import {
  select,
  geoOrthographic,
  geoPath,
  json,
} from 'd3';
import worldData from '../data/world-110m.json';
import airportsData from '../data/airports.json';

const topojson = require('topojson');

const width = window.innerWidth;
const height = window.innerHeight;

const svg = select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// var projection = geoMercator()
// .scale(100)
//   .translate([width / 2, height / 2]);

const projection = geoOrthographic()
  .rotate([-15, -40])
  .scale(300)
  .translate([width / 2, height / 2]);

const path = geoPath().projection(projection);

const data = await json(worldData);
const airports = await json(airportsData);

const world = topojson.feature(data, data.objects.countries).features;

svg.selectAll('path')
  .data(world)
  .enter().append('path')
  .attr('d', path);

svg
  .selectAll('circle')
  .data(airports.nodes)
  .join('circle')
  .attr('r', 5)
  .attr('fill', 'red')
  .attr('transform', d => `translate(${projection([d.longitude, d.latitude])})`);
