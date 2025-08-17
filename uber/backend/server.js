// const http = require('http');
// const app = require('./app');
// const port = process.env.PORT || 4000;


// const server = http.createServer(app);
  


// server.listen(port, () =>{
//     console.log(`Server is running on port ${port}`);
// });
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket'); // ✅ import your socket init
const port = process.env.PORT || 5000;

const server = http.createServer(app);

// ✅ Initialize Socket.IO
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
