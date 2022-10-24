import {
  select,
  json,
  forceSimulation,
  forceLink,
  forceCenter,
  forceManyBody,
  drag as Drag,
} from 'd3';
import airportsData from '../data/airports.json';

const width = 400;
const height = 400;

const svg = select('#chart-area')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const data = await json(airportsData);

const simulation = forceSimulation(data.nodes)
  .force('link', forceLink(data.links).distance(60))
  .force('center', forceCenter().x(width / 2).y(height / 2))
  .force('charge', forceManyBody().strength(-5));

const link = svg.selectAll('.link')
  .data(data.links)
  .enter()
  .append('line')
  .attr('class', 'link')
  .style('stroke', 'grey');

const node = svg.selectAll('circle')
  .data(data.nodes)
  .enter()
  .append('circle')
  .attr('fill', d => d.country === 'United States' ? 'blue' : 'red')
  .attr('r', 4);

node.call(Drag()
  .on('start', dragstart)
  .on('drag', drag)
  .on('end', dragend))
  .append('title')
  .text(d => d.name);

function dragstart(d) {
  if (!d.active) simulation.alphaTarget(0.3).restart();
  d.subject.fx = d.subject.x;
  d.subject.fy = d.subject.y;
}

function drag(d) {
  d.subject.fx = d.x;
  d.subject.fy = d.y;
}

function dragend(d) {
  if (!d.active) simulation.alphaTarget(0);
  d.subject.fx = null;
  d.subject.fy = null;
}

simulation.on('tick', () => {
  node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y);

  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
});

function onSlide(val) {
  svg.attr('transform', `scale(${1 + Number(val) / 10})`);
}
