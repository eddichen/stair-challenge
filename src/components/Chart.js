import React, { Component } from 'react';
import * as d3 from 'd3';

class Chart extends Component {
  createChart() {
    const chartData = this.getMonthChartData(this.props.chartData);
    const svgWidth = 500
    const svgHeight = 300
    const barPadding = 0
    const barWidth = ((svgWidth - 20) / chartData.length)

    const svg = d3.select('svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, function(d) { return new Date(d.date) }))
      .range([0, svgWidth - 21])

    const yScale = d3.scaleLinear()
      .domain([d3.max(chartData, function(d) { return d.floors }), 0])
      .range([0, svgHeight - 20]);

    const xAxis = d3.axisBottom().scale(xScale)
    const xAxisTranslate = svgHeight - 20

    const yAxis = d3.axisLeft().scale(yScale)

    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("y", function(d) {
         return yScale(d.floors) 
      })
      .attr("height", function(d) {
        return yScale(0) - yScale(d.floors); 
      })
      .attr("width", barWidth - barPadding)
      .attr("transform", function (d, i) {
        var translate = [(barWidth * i) + 20, 0]; 
        return "translate("+ translate +")";
      });
    
    svg.append("g")
      .attr("transform", "translate(20, 0)")
      .call(yAxis)

    svg.append("g")
      .attr("transform", "translate(20," + xAxisTranslate + ")")
      .call(xAxis)
  }

  getMonthChartData(data) {
    const days = this.getDaysInAMonth();
    const monthData = []

    days.forEach(day => {
      const matchedDate = data.findIndex(element => {
        return element.date === day
      })

      if (matchedDate !== -1) {
        monthData.push({
          date: day,
          floors: data[matchedDate].floors
        })
      }
      else {
        monthData.push({
          date: day,
          floors: parseInt(0)
        })
      }
    })

    return monthData;
  }

  getDaysInAMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    let date = new Date(currentYear, currentMonth, 1);
    let days = [];

    while (date.getMonth() === currentMonth) {
      days.push(`${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`)
      date.setDate(date.getDate() + 1)
    }
    return days;
  }

  componentDidMount() {
    this.createChart();
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