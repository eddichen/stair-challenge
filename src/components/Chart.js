import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {
  createChart(chartLabels, chartData) {
    const svgWidth = 500
    const svgHeight = 300
    const barPadding = 5
    const barWidth = (svgWidth / chartData.length)

    const svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    svg.selectAll("rect")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("y", function(d) {
         return svgHeight - d 
    })
    .attr("height", function(d) { 
        return d; 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0]; 
        return "translate("+ translate +")";
    });
  }

  componentDidMount() {
    this.createChart(this.props.chartLabels, this.props.chartData);
  }

  render() {
    return(
      <div>
        <svg width="500" height="800" className="bar-chart"></svg>
      </div>
    )
  }
}

export default Chart