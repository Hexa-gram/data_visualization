var event_map = require('../event_map');
// var readLastLines = require('read-last-lines');

var connect = function (io, udp) { //socket udp
  var json = {
    'Info_Leak': {
      value: 0,
      name: 'HTTP协议违背',
    },
  }; //汇总数据
  var chartData = []; //图标数据
  var tableData = []; //表格数据

  function sendData() {
    var barArr = Array.from({
      length: 29
    }, v => 0);
    var pieArr = [];
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
    var pageTotal = Math.ceil(tableData.length / 10);
    io.emit('pageTotal', pageTotal == 0 ? 1 : pageTotal);
  }

  // socket连接
  io.on('connection', (socket) => {
    console.log('socket start');
    var pageTotal = Math.ceil(tableData.length / 10);
    sendData();
    io.emit('pageTotal', pageTotal == 0 ? 1 : pageTotal);

    socket.on('test', (msg) => {
      console.log(msg)
    })

    socket.on('pageNum', (n) => {
      var arr = [];
      var start = (parseInt(n) - 1) * 10;
      for (var i = start; i < start + 10; i++) {
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
    var eventReg = new RegExp("event_type:[^\s\s]*");
    if (eventReg.test(msg)) {
      var ts = msg.split(" ")[0];
      var name = msg.match(eventReg)[0].slice(11).trim() //格式化取出的value
      checkChartData(ts, name);
      var start_time = /stat_time:.*?\s\s/.test(msg) ? msg.match(/stat_time:.*?\s\s/)[0].slice(10).trim() : "";
      var ip = /dst_ip:.*?\s/.test(msg) ? msg.match(/dst_ip:.*?\s/)[0].slice(7).trim() : "";
      var url = /domain:.*?\s/.test(msg) ? msg.match(/domain:.*?\s/)[0].slice(7).trim() : "";
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

  // var lines = readLastLines.read('./syslog.log', 100).then((lines) => {
  //   var dataInfo = lines.split(/[\n]/);
  //   // dataInfo.pop();
  //   var eventReg = new RegExp("event_type:[^\s\s]*");
  //   dataInfo.map(it => {
  //     if (eventReg.test(it)) {
  //       var ts = it.split(" ")[0];
  //       var name = it.match(eventReg)[0].slice(11).trim() //格式化取出的value
  //       checkChartData(ts, name);
  //     }
  //   });
  //   sendData();
  // })

  var timer = setInterval(() => {
    if (chartData.length > 0) {
      while (parseInt(chartData[0].ts) * 1000 < +new Date() - 3600) {
        var del = chartData.shift();
        json[del.name].value--;
        if (chartData.length == 0) {
          break;
        }
      }
      sendData();
    }
  }, 1000);


  // setTimeout(() => {
  //   for (var i = 0; i < 50; i++) {
  //     checkTableData({
  //       name: i,
  //       start_time: +new Date() + i * 100,
  //       ip: '10.16.60.' + (40 + i),
  //       url: 'www.baidu.com'
  //     });
  //   }
  //   console.log('set Data')
  // }, 5000)
}

module.exports = connect;