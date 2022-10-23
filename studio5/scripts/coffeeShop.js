import { select } from 'd3';

const svg = select('#chart-area-activity1')
  .append('svg')
  .attr('width', 600)
  .attr('height', 100);

const text = svg
  .append('text')
  .attr('dominant-baseline', 'central')
  .attr('y', 50)
  .attr('x', 0);

const updateVisualization = orders => {
  text.text(`Orders: ${orders.length}`);

  svg
    .selectAll('circle')
    .data(orders)
    .join(
      enter => enter
        .append('circle')
        .attr('cx', (d, i) => i * 30 + 100)
        .attr('cy', 50)
        .attr('r', 10)
        .attr('fill', d => d.product === 'coffee' ? 'brown' : '#bfa'),
      update => update
        .attr('cx', (d, i) => i * 30 + 100)
        .attr('fill', d => d.product === 'coffee' ? 'brown' : '#bfa'),
      exit => exit.remove(),
    );
};

const orders = [];

const products = [
  { product: 'coffee', price: '3.40' },
  { product: 'tea', price: '2.20' },
];

function randomNumber(start, end) {
  return Math.floor(Math.random() * end) + start;
}

function newOrder() {
  for (let i = 0; i < randomNumber(1, 3); i++) {
    if (orders.length < 10) {
      const product = products[Math.floor(Math.random() * products.length)];
      orders.push(product);
    }
  }
  updateVisualization(orders);
  setTimeout(newOrder, randomNumber(1000, 4000));
}

function processOrder() {
  for (let i = 0; i < randomNumber(1, 3); i++) { orders.shift(); }
  updateVisualization(orders);
  setTimeout(processOrder, randomNumber(1000, 5000));
}

newOrder();
setTimeout(processOrder, 3000);
