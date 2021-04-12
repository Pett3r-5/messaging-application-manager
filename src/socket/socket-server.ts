import User from "../models/User";
//import { ConversationSchema } from "../schemas/ConversationSchema";
import Conversation from '../models/Conversation'

const httpServer = require('http').createServer((req:any, res:any) => {
  // serve the index.html file
  res.setHeader('Content-Type', 'text/html');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end();
});

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket:any) => {
  console.log('connect');

  socket.on("create-conversation", (event:Conversation)=>{
    if(!!event){
      console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
      //conversationService.save(event)
    }
  })
});

io.listen(5000)

httpServer.listen(5001, () => {
  console.log('go to http://localhost:5001');
});