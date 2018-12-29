const router = require('koa-router')()
const readLastLines = require('read-last-lines');
const event_map = require('../event_map');


const connect = async function (io, udp) { //socket udp
  let json = {}; //汇总数据
  let chartData = []; //图标数据
  let tableData = []; //表格数据

  function sendData() {
    let barArr = Array.from({
      length: 29
    }, v => 0);
    let pieArr = [];
    Object.keys(json).map(it => {
      if (event_map[it]) {
        barArr[event_map[it].index] = parseInt(json[it].value);
        pieArr.push(Object.assign(json[it], {
          event: it,
          name: event_map[it].name
        }))
      }
    })
    io.emit('bar', barArr);
    io.emit('pie', pieArr);
  }

  function checkChartData(ts, name) {
    chartData.push({
      ts: ts,
      name: name
    });
    if (json.hasOwnProperty(name)) {
      json[name].value += 1;
    } else {
      json[name] = {
        value: 1
      }
    }
    sendData();
  }

  function checkTableData(params) {
    tableData.push(params);
    while (tableData.length > 1000) {
      tableData.shift();
    }
    let pageTotal = Math.ceil(tableData.length / 10);
    io.emit('pageTotal', pageTotal == 0 ? 1 : pageTotal);
  }
  // socket连接
  io.on('connection', (socket) => {
    console.log('socket start');
    let pageTotal = Math.ceil(tableData.length / 10);
    sendData();
    io.emit('pageTotal', pageTotal == 0 ? 1 : pageTotal);

    socket.on('pageNum', (n) => {
      let arr = [];
      let start = (parseInt(n) - 1) * 10;
      for (let i = start; i < start + 10; i++) {
        if (i < tableData.length) {
          arr.push(tableData[i]);
        } else {
          break;
        }
      }
      io.emit('pageData', arr);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });

  //udp
  udp.on('message', function (msg, rinfo) { //rinfo 数据来源信息{address,port,size,family}
    console.log('收到udp数据报：' + msg);
    msg = msg.toString();
    let eventReg = new RegExp("event_type:[^\s\s]*");
    if (eventReg.test(msg)) {
      let ts = msg.split(" ")[0];
      let name = msg.match(eventReg)[0].slice(11).trim() //格式化取出的value
      checkChartData(ts, name);
      let start_time = /stat_time:.*?\s\s/.test(msg) ? msg.match(/stat_time:.*?\s\s/).slice(10).trim() : "";
      let ip = /dst_ip:.*?\s/.test(msg) ? msg.match(/dst_ip:.*?\s/).slice(7).trim() : "";
      let url = /domain:.*?\s/.test(msg) ? msg.match(/domain:.*?\s/).slice(7).trim() : "";
      checkTableData({
        name: name,
        start_time: start_time,
        ip: ip,
        url: url
      });
    }

    // var buf = Buffer.from('客户端：你也好');
    // udp.send(buf, 0, buf.length, rinfo.port, rinfo.address);
  });

  let lines = await readLastLines.read('./syslog.log', 100)
  let dataInfo = lines.split(/[\n]/);
  // dataInfo.pop();
  let eventReg = new RegExp("event_type:[^\s\s]*");
  dataInfo.map(it => {
    if (eventReg.test(it)) {
      let ts = it.split(" ")[0];
      let name = it.match(eventReg)[0].slice(11).trim() //格式化取出的value
      checkChartData(ts, name);
    }
  });
  sendData();
  let timer = setInterval(() => {
    if (chartData.length > 0) {
      while (parseInt(chartData[0].ts) * 1000 < +new Date() - 3600) {
        let del = chartData.shift();
        json[del.name].value--;
        if (chartData.length == 0) {
          break;
        }
      }
      sendData();
    }
  }, 1000);


  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      checkTableData({
        name: i,
        start_time: +new Date() + i * 100,
        ip: '10.16.60.' + (40 + i),
        url: 'www.baidu.com'
      });
    }
    console.log('set Data')
  }, 5000)
}

module.exports = connect;