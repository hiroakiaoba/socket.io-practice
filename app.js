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

const chat = io.of('/chat').on('connection', function(socket) {
  socket.on('emit_from_client', function(data) {
    socket.join(data.room);
    socket.emit('emit_from_server', 'you are in ' + data.room);
    socket.broadcast.to(data.room).emit('emit_from_server', data.msg);
  });
});

const news = io.of('/news').on('connection', function(socket) {
  let date = new Date(),
      year = date.getFullYear();
      month = date.getMonth();
      day = date.getDate();
      hour = date.getHours();
      minute = date.getMinutes();
  date = year + '/' + month + '/' + day + ' ' + hour + ':' + minute
  socket.emit('emit_from_server', 'today: ' + date );
});
