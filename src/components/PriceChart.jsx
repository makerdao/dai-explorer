import React from "react";

import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

class PriceChart extends React.Component {
  state = {
    priceChart: 'ethusd',
    priceChartCollapsed: localStorage.getItem('priceChartCollapsed')
  };

  changePriceChart = (e) => {
    this.setState({ priceChart: e.target.value });
  }

  saveStorage = (e) => {
    localStorage.setItem('priceChartCollapsed', localStorage.getItem('priceChartCollapsed') === "true" ? false : true)
  }

	render() {
    const { type, width, ratio } = this.props;

    const data = this.props.chartData[this.state.priceChart] &&
                 typeof this.props.chartData[this.state.priceChart].results !== 'undefined' &&
                 this.props.chartData[this.state.priceChart].results.length > 0
                 ? this.props.chartData[this.state.priceChart].results
                 : null;
		const xAccessor = d => d.date;
		const xExtents = data ? [
                                xAccessor(last(data)),
                                xAccessor(data[0])
                              ]
                              : null;
    const x = (d) => {
      return d.timestamp;
    };

		return (
      <div className="box collapsed">
        <div className="box-header with-border" data-toggle="collapse" data-parent="#accordion" onClick={ this.saveStorage } href="#collapsePriceChart" aria-expanded={ localStorage.getItem('priceChartCollapsed') !== "true" }>
          <h3 className="box-title">Price History (Last 30 days)</h3>
        </div>
        <div id="collapsePriceChart" className={ `box-body panel-collapse collapse${localStorage.getItem('priceChartCollapsed') !== 'true' ? ' in' : ''}` } aria-expanded={ localStorage.getItem('priceChartCollapsed') !== "true" } style={{ height: localStorage.getItem('priceChartCollapsed') !== "true" ? "auto" : "0px" }}>
          <div className="row">
            <div className="col-md-12">
              <select className="changePrice" ref={(input) => this.token = input} onChange={ this.changePriceChart }>
                <option value="ethusd">ETH/USD</option>
                <option value="ethdai">ETH/SAI</option>
                <option value="daiusd">SAI/USD</option>
                <option value="skreth">PETH/ETH</option>
              </select>
              {
                data
                ?
                  <ChartCanvas height={400}
                    ratio={ratio}
                    width={width}
                    margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
                    type={type}
                    seriesName="MSFT"
                    data={data}
                    xAccessor={xAccessor}
                    displayXAccessor={xAccessor}
                    xScale={scaleTime()}
                    xExtents={xExtents}
                    >

                  <Chart id={1} yExtents={d => [d.high, d.low]} x={x}>
                    <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                    <YAxis axisAt="left" orient="left" ticks={5} />
                    <MouseCoordinateX
                      rectWidth={80}
                      at="bottom"
                      orient="bottom"
                      displayFormat={timeFormat("%B %d")} />
                    <MouseCoordinateY
                      rectWidth={this.state.priceChart === 'ethusd' ? 70 : 100}
                      at="left"
                      orient="right"
                      displayFormat={format(this.state.priceChart === 'ethusd' ? ".4f" : ".10f")} />

                    <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
                  </Chart>
                  <CrossHairCursor />
                </ChartCanvas>
                :
                <div style={ {margin: '15px 0 15px 10px'} }>Loading...</div>
              }
            </div>
          </div>
        </div>
      </div>
		);
	}
}

PriceChart.propTypes = {
	// data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

PriceChart.defaultProps = {
	type: "svg",
};
PriceChart = fitWidth(PriceChart);

export default PriceChart;
