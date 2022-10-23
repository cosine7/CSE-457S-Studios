import {
  select,
  scaleTime,
  scaleLinear,
  extent,
  max,
  axisBottom,
  area,
  axisLeft,
  stack as stackLayout,
} from 'd3';

export default function StackedAreaChart(parentSelector, data, colorScale) {
  this.parentSelector = parentSelector;
  this.data = data;
  this.colorScale = colorScale;
  this.initVis();
}

StackedAreaChart.prototype.initVis = function () {
  const margin = {
    top: 40, right: 0, bottom: 60, left: 60,
  };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  this.margin = margin;
  this.width = width;
  this.height = height;

  this.svg = select(this.parentSelector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  this.svg
    .append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', width)
    .attr('height', height);

  this.x = scaleTime()
    .range([0, width])
    .domain(extent(this.data, d => d.Year));

  this.y = scaleLinear().range([height, 0]);

  this.xAxis = axisBottom().scale(this.x);

  this.yAxis = axisLeft().scale(this.y);

  this.svg
    .append('g')
    .attr('class', 'x-axis axis')
    .attr('transform', `translate(0,${height})`);

  this.svg
    .append('g')
    .attr('class', 'y-axis axis');

  const stack = stackLayout().keys(this.colorScale.domain());

  this.stackedData = stack(this.data);

  this.stackedArea = area()
    .x(d => this.x(d.data.Year))
    .y0(d => this.y(d[0]))
    .y1(d => this.y(d[1]));

  this.singleArea = area()
    .x(d => this.x(d.data.Year))
    .y0(height)
    .y1(d => this.y(d[1]));

  this.tooltip = this.svg
    .append('text')
    .style('font-size', '12px')
    .attr('dominant-baseline', 'hanging')
    .attr('x', 10)
    .attr('y', 0);

  this.updateVis();
};

StackedAreaChart.prototype.updateVis = function () {
  const data = this.filter ? this.stackedData.filter(d => d.key === this.filter) : this.stackedData;

  if (this.filter) {
    this.y.domain([0, max(data[0], d => d[1])]);
  } else {
    this.y.domain([0, max(data, d => max(d, e => e[1]))]);
  }
  this.svg.select('.x-axis').call(this.xAxis);
  this.svg.select('.y-axis').call(this.yAxis);

  const dataCategories = this.colorScale.domain();

  this.svg
    .selectAll('.area')
    .data(data, d => d.key)
    .join(
      enter => enter
        .append('path')
        .style('cursor', 'pointer')
        .attr('class', 'area')
        .style('fill', (d, i) => this.colorScale(dataCategories[i]))
        .attr('d', d => this.filter ? this.singleArea(d) : this.stackedArea(d))
        .on('mouseover', (e, d) => this.tooltip.text(d.key))
        .on('click', (e, d) => {
          this.filter = this.filter === d.key ? '' : d.key;
          this.updateVis();
        }),
      update => update
        .attr('d', d => this.filter ? this.singleArea(d) : this.stackedArea(d)),
      exit => exit.remove(),
    );
};
