import { select, csv } from 'd3';

select('#a1')
  .append('svg')
  .attr('width', 400)
  .attr('height', 200)
  .style('background-color', 'green');

select('#a1')
  .append('div')
  .text('Dynamic Content')
  .style('font-weight', 'bold')
  .style('font-size', '20px');

select('body').style('background-color', '#EEE');

select('#a1')
  .selectAll('p')
  .data(['Kansas', 'Nebraska', 'Missouri', 'Iowa', 'Illinois', 'Indiana'])
  .enter()
  .append('p')
  .text((d, i) => `element: ${d} at position: ${i}`)
  .attr('class', 'custom-paragraph')
  .style('font-weight', d => d === 'Missouri' ? 'bold' : 'normal');

select('#a1')
  .append('svg')
  .attr('width', 300)
  .attr('height', 50)
  .selectAll('rect')
  .data([1, 2, 4, 8, 16])
  .enter()
  .append('rect')
  .attr('fill', 'red')
  .attr('width', 50)
  .attr('height', 50)
  .attr('y', 0)
  .attr('x', (d, i) => 60 * i);

const sandwiches = await csv('data/sandwiches.csv');

select('#a2')
  .append('svg')
  .attr('width', 500)
  .attr('height', 500)
  .selectAll('circle')
  .data(sandwiches)
  .enter()
  .append('circle')
  .attr('fill', d => (d.price < 7 ? 'green' : 'yellow'))
  .attr('stroke', 'black')
  .attr('cx', (d, i) => (i + 1) * 50)
  .attr('cy', 30)
  .attr('r', d => (d.size === 'large' ? 20 : 10));

const converter = d => ({
  city: d.city,
  country: d.country,
  eu: d.eu === 'true',
  population: Number(d.population),
  x: Number(d.x),
  y: Number(d.y),
});

const cities = (await csv('data/cities.csv', converter))
  .filter(city => city.eu);

select('#a3').append('p').text(`Number of cities: ${cities.length}`);

const svg = select('#a3')
  .append('svg')
  .attr('width', 700)
  .attr('height', 550);

svg
  .selectAll('circle')
  .data(cities)
  .enter()
  .append('circle')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', d => (d.population < 1000000 ? 4 : 8))
  .attr('fill', '#AC5A23');

svg
  .selectAll('text')
  .data(cities)
  .enter()
  .append('text')
  .text(d => d.city)
  .attr('class', 'city-label')
  .attr('x', d => d.x)
  .attr('y', d => d.y - 10)
  .attr('opacity', d => (d.population < 1000000 ? 0 : 1));
