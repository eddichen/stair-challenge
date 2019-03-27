import React, { Component } from 'react';
import * as d3 from 'd3';
import './Chart.css';

class Chart extends Component {
  constructor() {
    super()

    this.default_width = 600
    this.default_height = 338
    this.default_ratio = this.default_width / this.default_height
    this.margin = {top: 16, right: 16, bottom: 16, left: 25}

    this.state = {
      width: this.default_width - this.margin.left - this.margin.right,
      height: this.default_height - this.margin.top - this.margin.bottom
    }
  } 

  set_vars() {
    const current_width = window.innerWidth;
    const current_height = window.innerHeight;  
    const current_ratio = current_width / current_height;
    let h, w;
  
    // Check if height is limiting factor
    if ( current_ratio > this.default_ratio ){
      h = current_height;
      w = h * this.default_ratio;
    // Else width is limiting
    } else {
      w = current_width;
      h = w / this.default_ratio;
    }
  
    // Set new width and height based on graph dimensions
    this.setState({
      width: w - this.margin.left - this.margin.right,
      height: h - this.margin.top - this.margin.bottom
    })
  }

  createChart() {
    const chartData = this.getMonthChartData(this.props.chartData);
    const barPadding = 0
    const barWidth = ((this.state.width - this.margin.right) / chartData.length)

    const svg = d3.select('.bar-chart')
      .attr("width", this.state.width + this.margin.left + this.margin.right)
      .attr("height", this.state.height + this.margin.top + this.margin.bottom);

    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, function(d) { return new Date(d.date) }))
      .range([0, this.state.width - this.margin.right])

    const yScale = d3.scaleLinear()
      .domain([d3.max(chartData, function(d) { return d.floors }), 0])
      .range([0, this.state.height - this.margin.bottom - this.margin.top]);

    const xAxis = d3.axisBottom().scale(xScale)
    const xAxisTranslate = this.state.height - this.margin.bottom

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
      .attr("transform", (function (d, i) {
        var translate = [(barWidth * i) + this.margin.left, this.margin.top]; 
        return "translate("+ translate +")";
      }).bind(this));
    
    svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(yAxis)

    svg.append("g")
      .attr("transform", `translate(${this.margin.left}, ${xAxisTranslate})`)
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
    this.set_vars();
    this.createChart();
    const _this = this;

    let resizeTimer;
    window.onresize = (function(event) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout((function(){
        let s = d3.select('.bar-chart');
        s.remove();
        _this.set_vars();
        _this.createChart();
      }), 100);
    })
  }

  render() {
    return(
      <svg className="bar-chart"></svg>
    )
  }
}

export default Chart