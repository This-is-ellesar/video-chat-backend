//libs
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const { version, validate } = require('uuid');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//imports
const authRouter = require('./Routers/auth-router');
const roomRouter = require('./Routers/room-router');
const ACTIONS = require('./Socket/action');
const PORT = process.env.PORT || 5000;

function getClientRooms() {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(
    roomID => validate(roomID) && version(roomID) === 4
  );
}

function shareRoomsInfo() {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms(),
  });
}

io.on('connection', socket => {
  shareRoomsInfo();

  socket.on(ACTIONS.JOIN, config => {
    const { room: roomId } = config;
    const { rooms: joinRooms } = socket;

    if (Array.from(joinRooms).includes(roomId)) {
      return console.warn(`Already joined to ${roomId}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false,
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientId,
        createOffer: true,
      });
    });

    socket.join(roomId);

    shareRoomsInfo();
  });

  function leaveRoom() {
    const { rooms } = socket;

    Array.from(rooms).forEach(roomID => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

      clients.forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerID: socket.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerID: clientId,
        });
      });

      socket.leave(roomID);
    });

    shareRoomsInfo();
  }

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on('disconnecting', leaveRoom);

  socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
    io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerID: socket.id,
      sessionDescription,
    });
  });

  socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
    io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
      peerID: socket.id,
      iceCandidate,
    });
  });
});

//multer
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Video-chat API',
      description: 'This is my first api for a node.js',
    },
    servers: [
      {
        url: 'http://localhost:5000/',
      },
    ],
  },
  apis: ['./Routers/room-router.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(multer({ storage: storage }).single('filedata'));
app.use('./uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/room', roomRouter);

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Ellesar:Ellesaradmin1@cluster0.rf9a8.mongodb.net/Video-chat?retryWrites=true&w=majority'
    );

    server.listen(PORT, () => console.warn(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(`Server error: ${e}!`);
  }
};

start();
