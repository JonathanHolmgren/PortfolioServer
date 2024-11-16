import express from 'express';
import cors from 'cors';
import { createServer } from 'http'; // Nytt: Skapa en HTTP-server
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app); // Använd httpServer för att hantera både HTTP och Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

const port = 3000;

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});

// Starta servern
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './templates');

// app.use('/static', express.static('./static'));

// app.use('/static', express.static('./static'));
// app.use(express.json(), cors(corsOptions)); // Use this after the variable declaration

// app.use(apirouter);
// app.use(pagesrouter);