import {
  select, scaleTime, scaleLinear, extent, max, axisBottom, area, brushX,
} from 'd3';

export default function Timeline(parentSelector, data, brushed) {
  this.parentSelector = parentSelector;
  this.data = data;
  this.brushed = brushed;
  this.initVis();
}

Timeline.prototype.initVis = function () {
  const margin = {
    top: 0, right: 0, bottom: 30, left: 60,
  };
  const width = 800 - margin.left - margin.right;
  const height = 100 - margin.top - margin.bottom;
  this.margin = margin;
  this.width = width;
  this.height = height;

  this.svg = select(this.parentSelector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  this.x = scaleTime()
    .range([0, width])
    .domain(extent(this.data, d => d.Year));

  this.y = scaleLinear()
    .range([height, 0])
    .domain([0, max(this.data, d => d.Expenditures)]);

  this.xAxis = axisBottom().scale(this.x);

  this.area = area()
    .x(d => this.x(d.Year))
    .y0(height)
    .y1(d => this.y(d.Expenditures));

  this.svg
    .append('path')
    .datum(this.data)
    .attr('fill', '#ccc')
    .attr('d', this.area);

  const brush = brushX()
    .extent([[0, 0], [width, height]])
    .on('brush end', this.brushed);

  this.svg
    .append('g')
    .attr('class', 'x brush')
    .call(brush);

  this.svg
    .append('g')
    .attr('class', 'x-axis axis')
    .attr('transform', `translate(0,${height})`)
    .call(this.xAxis);
};
