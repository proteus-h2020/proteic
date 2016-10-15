import * as Colors from '../colors';

export const defaults = {
    stacked: true,
    style: {
        '.axis': {
            'font': '10px sans-serif'
        },
        '.axis path,.axis line': {
            'fill': 'none',
            'stroke': '#000',
            'shape-rendering': 'crispEdges'
        },
        '.x.axis path': {
            'display': 'none'
        },
        '.x.axis.label, .y.axis.label': {
            'font': '12px sans-serif'
        }
    },
    xaxis: {
        label: 'Countries'
    },
    yaxis: {
        label: 'People (%)'
    },
    // Set the color scale for the chart. You can use Proteus scales or any D3 scale
    colorScale: Colors.category7(),
    margin: {
        top: 20,
        right: 250,
        bottom: 70,
        left: 90
    },
    width: '100%', // %, auto, or numeric 
    height: 350,
    ticks: 5, // ticks for y dial.
    tooltip(data) { // Allows HTML
        return '<b>Eje x</b>: ' + data.x + '<br/>' +
            '<b>Eje y</b>: ' + data.y;
    },
    tickLabel: '',
    selector: '#chart',
    events: {
        down() {
            d3.select(this).classed('hover', false);
        },
        over() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 0.4);
        },
        leave() {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('fill-opacity', 1);
        },
        click(d, i) {
            console.log(d, i);
        }
    },
    transitionDuration: 300,
    maxNumberOfElements: 0, // used by keepDrawing to reduce the number of elements in the current chart
    sortData: {
        descending: false,
        prop: 'x'
    }
};