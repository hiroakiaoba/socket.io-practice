const app = require('http').createServer(handler),
      io = require('socket.io').listen(app),
      fs = require('fs');

app.listen(3000);
console.log('Server Running!');

function handler(req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error');
    }
    res.writeHead(200);
    res.write(data);
    res.end();
  });
}
// [chat]namespaceを作成する
// connectionでweb socket接続
const chat = io.of('/chat').on('connection', function(socket) {
  // onで[emit_from_client]というイベントを待ち受ける
  // clientでemitされたdataを受け取る
  socket.on('emit_from_client', function(data) {
    // 送られてきたroom名に自身のパイプをjoinさせる
    socket.join(data.room);
    // 自身のパイプに対してdataを送る
    socket.emit('emit_from_server', 'you are in ' + data.room);
    // 自身のパイプ以外の通信に対してdataを送る
    socket.broadcast.to(data.room).emit('emit_from_server', data.msg);
  });
});

// [news]namespaceを作成する
const news = io.of('/news').on('connection', function(socket) {
  let date = new Date(),
      year = date.getFullYear();
      month = date.getMonth();
      day = date.getDate();
      hour = date.getHours();
      minute = date.getMinutes();
  date = year + '/' + month + '/' + day + ' ' + hour + ':' + minute
  // 自身のパイプに対してdataを送る
  socket.emit('emit_from_server', 'today: ' + date );
});
