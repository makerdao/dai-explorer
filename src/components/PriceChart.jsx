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
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

class PriceChart extends React.Component {

	render() {
    const { type, width, ratio } = this.props;

    const chart = this.props.chartData.pips.results && this.props.chartData.pips.results.length > 0 ? this.props.chartData.pips.results : null;

    const data = this.props.chartData.pips.results;
		const xAccessor = d => d.date;
		const xExtents = chart ? [
                                xAccessor(last(data)),
                                xAccessor(data[0])
                                // xAccessor(data[data.length - 100])
                              ]
                              : null;
    const x = (d) => {
      return d.timestamp;
    };

		return (
      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title">Price Chart</h3>
        </div>
        <div className="box-body" style={ {'padding-right': '50px'} }>
          <div className="row">
            <div className="col-md-12">
              {
                chart
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
                        displayFormat={timeFormat("%Y-%m-%d")} />
                      <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={format(".2f")} />

                      <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

                      <CandlestickSeries width={timeIntervalBarWidth(utcDay)}/>
                    </Chart>
                    <CrossHairCursor />
                  </ChartCanvas>
                :
                  'Loading...'
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
