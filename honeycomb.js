const margin = {
  top: 50,
  right: 20,
  bottom: 20,
  left: 50,
};

const width = 1000;
const height = 500;

const MapColumns = 6;
const MapRows = 11;

const hexRadius = d3.min([
  width / ((MapColumns + 0.5) * Math.sqrt(3)),
  height / ((MapRows + 1 / 3) * 1.5),
]);

const points = [];

for (let i = 0; i < MapRows; i++) {
  for (let j = 0; j < MapColumns; j++) {
    let x = hexRadius * j * Math.sqrt(3);
    if (i % 2 === 1) x += (hexRadius * Math.sqrt(3)) / 2;
    const y = hexRadius * i * 1.5;
    points.push([x, y, i, j]);
  }
}

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const hexbin = d3.hexbin().radius(hexRadius);
const NORMAL_FILL = 'hsl(60, 10%, 95%)';

svg
  .append('g')
  .selectAll('.hexagon')
  .data(hexbin(points))
  .enter()
  .append('path')
  .attr('data:x-index', (d) => d[0][2])
  .attr('data:y-index', (d) => d[0][3])
  .attr('class', 'hexagon')
  .attr('transform', (d) => `translate(${d.y},${d.x}),rotate(90)`)
  .attr('d', hexbin.hexagon())
  .attr('stroke', 'hsl(0, 0%, 70%)')
  .attr('stroke-width', '1px')
  .style('fill', NORMAL_FILL)
  .on('mouseover', onMounseover);

svg
  .append('g')
  .selectAll('text.label')
  .data(hexbin(points))
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', (d) => d.y)
  .attr('y', (d) => d.x)
  .attr('data:x-index', (d) => d[0][2])
  .attr('data:y-index', (d) => d[0][3])
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'central')
  .style('font-size', 14)
  .style('fill', 'black')
  .style('pointer-events', 'none')
  .text((d) => `${d[0][2]}, ${d[0][3]}`);

active(2, 1);

function onMounseover (e) {
  clear();
  const el = e.srcElement;
  const x_index = el.getAttribute('x-index');
  const y_index = el.getAttribute('y-index');
  active(x_index, y_index);
}

function active (x_index, y_index) {
  d3.selectAll('.hexagon')
    .filter((d) => {
      return d[0][2] == x_index || d[0][3] == y_index;
    })
    .style('fill', 'hsl(60, 100%, 85%)');

  d3.selectAll('.label')
    .filter((d) => {
      return d[0][2] == x_index || d[0][3] == y_index;
    })
    .style('font-weight', 'bold')
    .style('fill', 'hsl( 90, 100%, 35%)');
}

function clear () {
  d3.selectAll('.hexagon').style('fill', NORMAL_FILL);
  d3.selectAll('.label')
    .style('fill', 'black')
    .style('font-weight', 'normal');
}
