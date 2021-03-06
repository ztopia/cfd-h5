<template>
  <div class="klinechart">
    <div id="basic-k-line" class="k-line-chart" />
    <img class="logo" src="../../assets/logo.png" alt />
  </div>
</template>

<script>
import { dispose, init } from 'klinecharts'
import axios from 'axios'
import ReconnectingWebSocket from 'reconnecting-websocket'
var pako = require('pako')

export default {
  name: 'BasicKLineChart',
  data() {
    return {
      kLineChart: null,
      klineData: [],
      updateDate: null,
      granularity: 60,
      WSUrl:
        this.$route.query.region === 1
          ? 'wss://real.okex.com:8443/ws/v3'
          : 'wss://okexcomreal.bafang.com:8443/ws/v3',
      // WSUrl:
      //   this.$route.query.region === 1
      //     ? 'wss://real.okex.com:8443/ws/v3'
      //     : 'wss://real.okex.me:8443/ws/v3',
      id: 'BTC-USDT',
      restfulReady: false,
    }
  },
  watch: {
    klineData() {
      // console.log(this.klineData)
      this.kLineChart && this.kLineChart.applyNewData(this.klineData)
    },
    updateDate() {
      // console.log(this.updateDate)
      var el = this.updateDate
      let newData = {
        timestamp: Date.parse(el[0]),
        open: Number(this.formatByPriceTick(el[1])),
        high: Number(this.formatByPriceTick(el[2])),
        low: Number(this.formatByPriceTick(el[3])),
        close: Number(this.formatByPriceTick(el[4])),
        volume: Number(el[5]),
      }
      this.kLineChart && this.kLineChart.updateData(newData)
    },
  },
  methods: {
    formatByPriceTick(num) {
      if (num === '') return 0
      if (!Number(num)) return num

      let priceTick = this.$route.query.precision
      let floatLen = Number(priceTick) || 1
      let numT = num.toString()
      let num0 = numT.indexOf('.') > -1 ? numT.split('.')[0] : numT
      let num1 = ''
      for (let i = 0; i < floatLen; i++) {
        if (numT.indexOf('.') > -1) {
          num1 += numT.split('.')[1][i] ? numT.split('.')[1][i] : '0'
        } else {
          num1 += '0'
        }
      }

      return floatLen === 0 ? num0 : `${num0}.${num1}`
    },
    getKlineData() {
      axios
        .get(
          '/api/index/v3/instruments/' +
            this.id +
            '/candles?granularity=' +
            this.granularity +
            '&t=1594261796066&size=300'
        )
        .then((res) => {
          // console.log(res)
          let arr = res.data.data.map((el) => ({
            timestamp: Date.parse(el[0]),
            open: Number(el[1]),
            high: Number(el[2]),
            low: Number(el[3]),
            close: Number(el[4]),
            volume: Number(el[5]),
          }))
          this.restfulReady = true
          this.klineData = arr
        })
    },
    CreateWebSocket() {
      const options = {
        connectionTimeout: 1000,
        maxRetries: 10,
      }
      this.Socket = new ReconnectingWebSocket(this.WSUrl, [], options)
      this.Socket.binaryType = 'arraybuffer'
      let sub = {
        op: 'subscribe',
        args: [`index/candle${this.granularity}s:${this.id}`],
      }
      let subTicker = {
        op: 'subscribe',
        args: [`index/ticker:${this.id}`],
      }

      this.Socket.onopen = () => {
        this.Socket.send(JSON.stringify(sub))
        this.Socket.send(JSON.stringify(subTicker))
      }

      this.Socket.onmessage = (data) => {
        if (data.data instanceof String) {
          // console.log(data.data)
        } else {
          try {
            let res = JSON.parse(pako.inflateRaw(data.data, { to: 'string' }))
            // console.log(res)

            switch (res.table) {
              case 'index/ticker':
                if (this.updateDate) {
                  this.updateDate[4] = this.formatByPriceTick(res.data[0].last)
                  // console.log(this.updateDate[4], 'ztopia')
                }
                break
              case `index/candle${this.granularity}s`:
                if (this.restfulReady) {
                  if (res.data[0].candle) {
                    this.updateDate = res.data[0].candle
                    // console.log(this.updateDate[4], 'ztopia candle')
                  }
                }
                break
              default:
                return
            }
          } catch (err) {
            console.log(err)
          }
        }
      }
    },
  },
  mounted: function() {
    window.onresize = () => this.kLineChart.resize()
    var precision = this.$route.query.precision
    var sub = this.$route.query.sub
    var main = this.$route.query.main
    var isReal = this.$route.query.real
    this.granularity = this.$route.query.range
    if (this.$route.query.id) this.id = this.$route.query.id
    this.getKlineData()
    this.CreateWebSocket()
    const kLineChart = init('basic-k-line')
    kLineChart.setOffsetRightSpace(80)
    kLineChart.createTechnicalIndicator(sub)
    isReal === 'true' && kLineChart.setCandleStickChartType('real_time')
    kLineChart.setCandleStickTechnicalIndicatorType(main)
    kLineChart.setPrecision(Number(precision), Number(precision))
    this.kLineChart = kLineChart
    kLineChart.setStyleOptions({
      grid: {
        display: true,
        horizontal: {
          display: true,
          size: 1,
          color: '#393939',
          style: 'dash',
          dashValue: [4, 4],
        },
        vertical: {
          display: true,
          size: 1,
          color: '#393939',
          style: 'dash',
          dashValue: [4, 4],
        },
      },
      candleStick: {
        bar: {
          style: 'solid',
          upColor: '#14af81',
          downColor: '#ec516d',
          noChangeColor: '#666666',
        },
      },
      realTime: {
        timeLine: {
          color: '#1e88e5',
          size: 1,
          areaFillColor: 'rgba(30, 136, 229, 0.08)',
        },
        averageLine: {
          display: false,
          color: '#F5A623',
          size: 1,
        },
      },
      technicalIndicator: {
        bar: {
          upColor: '#14af81',
          downColor: '#ec516d',
          noChangeColor: '#666666',
        },
      },
      separator: {
        size: 1,
        color: 'rgba(255, 255, 255, 0.1)',
        fill: true,
      },
      xAxis: {
        axisLine: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      yAxis: {
        display: true,
        maxWidth: 80,
        minWidth: 60,
        // 'left' | 'right'
        position: 'right',
        axisLine: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        tickText: {
          position: 'inside',
          margin: 5,
        },
        tickLine: {
          display: true,
          size: 1,
          length: 3,
          color: '#888888',
        },
      },
      floatLayer: {
        prompt: {
          displayRule: 'follow_cross',
          candleStick: {
            showType: 'rect',
            labels: ['时间', '开', '收', '高', '低'],
            rect: {
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              left: 8,
              top: 8,
              right: 44,
              borderRadius: 4,
              borderSize: 1,
              borderColor: '#3f4254',
              fillColor: 'rgba(17, 17, 17, .3)',
            },
          },
        },
      },
    })
  },
  destroyed: function() {
    dispose('basic-k-line')
  },
}
</script>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #12141b !important;
}

div,
p {
  box-sizing: border-box;
}
.klinechart {
  position: relative;
}

.logo {
  position: absolute;
  bottom: 140px;
  left: 20px;
  z-index: 100;
  width: 90px;
}

.k-line-chart {
  width: 100%;
  height: 100vh;
  background-color: #12141b;
  border-radius: 2px;
}
</style>
