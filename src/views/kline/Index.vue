<template>
  <div id="basic-k-line" class="k-line-chart" />
</template>

<script>
import { dispose, init } from "klinecharts";
import axios from "axios";
import ReconnectingWebSocket from "reconnecting-websocket";
var pako = require("pako");

export default {
  name: "BasicKLineChart",
  data() {
    return {
      kLineChart: null,
      klineData: [],
      updateDate: null,
      granularity: 60,
      WSUrl: "wss://okexcomreal.bafang.com:8443/ws/v3",
      id: "BTC-USDT"
    };
  },
  watch: {
    klineData() {
      console.log(this.klineData);
      this.kLineChart && this.kLineChart.applyNewData(this.klineData);
    },
    updateDate() {
      console.log(this.updateDate);
      var el = this.updateDate;
      let newData = {
        timestamp: Date.parse(el[0]),
        open: Number(el[1]),
        high: Number(el[2]),
        low: Number(el[3]),
        close: Number(el[4]),
        volume: Number(el[5])
      };
      this.kLineChart && this.kLineChart.updateData(newData);
    }
  },
  methods: {
    getKlineData() {
      axios
        .get(
          "/" +
            this.id +
            "/candles?granularity=" +
            this.granularity +
            "&t=1594261796066&size=300"
        )
        .then(res => {
          console.log(res);
          let arr = res.data.data.map(el => ({
            timestamp: Date.parse(el[0]),
            open: Number(el[1]),
            high: Number(el[2]),
            low: Number(el[3]),
            close: Number(el[4]),
            volume: Number(el[5])
          }));
          this.klineData = arr;
        });
    },
    CreateWebSocket() {
      const options = {
        connectionTimeout: 1000,
        maxRetries: 10
      };
      this.Socket = new ReconnectingWebSocket(this.WSUrl, [], options);
      this.Socket.binaryType = "arraybuffer";
      let sub = {
        op: "subscribe",
        args: [`index/candle${this.granularity}s:${this.id}`]
      };

      this.Socket.onopen = () => {
        this.Socket.send(JSON.stringify(sub));
      };

      this.Socket.onmessage = data => {
        if (data.data instanceof String) {
          console.log(data.data);
        } else {
          try {
            var res = JSON.parse(pako.inflateRaw(data.data, { to: "string" }));
            console.log(res);
            if (res.table && res.data[0].candle) {
              this.updateDate = res.data[0].candle;
            }
          } catch (err) {
            console.log(err);
          }
        }
      };
    }
  },
  mounted: function() {
    window.onresize = () => this.kLineChart.resize();
    var precision = this.$route.query.precision;
    console.log(precision)
    var sub = this.$route.query.sub;
    var main = this.$route.query.main;
    this.granularity = this.$route.query.range;
    if (this.$route.query.id) this.id = this.$route.query.id;
    this.getKlineData();
    this.CreateWebSocket();
    const kLineChart = init("basic-k-line");
    kLineChart.setOffsetRightSpace(80);
    kLineChart.createTechnicalIndicator(sub);
    kLineChart.setCandleStickTechnicalIndicatorType(main);
    kLineChart.setPrecision(Number(precision), Number(precision));
    this.kLineChart = kLineChart;
    kLineChart.setStyleOptions({
      grid: {
        display: true,
        horizontal: {
          display: true,
          size: 1,
          color: "#393939",
          // 'solid'|'dash'
          style: "dash",
          dashValue: [4, 4]
        },
        vertical: {
          display: true,
          size: 1,
          color: "#393939",
          // 'solid'|'dash'
          style: "dash",
          dashValue: [4, 4]
        }
      },
      candleStick: {
        bar: {
          style: "solid",
          upColor: "rgba(7,171,145,1)",
          downColor: "rgba(209,72,105,1)",
          noChangeColor: "#666666"
        }
      },
      realTime: {
        timeLine: {
          color: "#1e88e5",
          size: 1,
          areaFillColor: "rgba(30, 136, 229, 0.08)"
        },
        averageLine: {
          display: false,
          color: "#F5A623",
          size: 1
        }
      },
      xAxis: {
        axisLine: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      },
      yAxis: {
        axisLine: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        tickText: {
          position: "inside"
        }
      },
      floatLayer: {
        displayRule: "follow_cross",
        prompt: {
          candleStick: {
            showType: "rect",
            labels: ["", "开", "收", "高", "低", ""],
            text: {
              size: 12,
              color: "#D9D9D9",
              family: "Arial",
              marginLeft: 4,
              marginTop: 6,
              marginRight: 2,
              marginBottom: 0
            }
          }
        },
        rect: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          left: 2,
          top: 2,
          right: 2,
          borderRadius: 4,
          borderSize: 1,
          borderColor: "#3f4254",
          fillColor: "rgba(17, 17, 17, .3)"
        },
        text: {
          size: 10,
          color: "#D9D9D9",
          family: "Arial",
          marginLeft: 0,
          marginTop: 0,
          marginRight: 0,
          marginBottom: 0
        }
      }
    });
  },
  destroyed: function() {
    dispose("basic-k-line");
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #12141b;
}

div,
p {
  box-sizing: border-box;
}

.k-line-chart {
  width: 100%;
  height: 100vh;
  background-color: #12141b;
  border-radius: 2px;
}
</style>
