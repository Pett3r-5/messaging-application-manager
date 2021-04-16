import User from "../models/User";
//import { ConversationSchema } from "../schemas/ConversationSchema";
import Conversation from '../models/Conversation'
import ConversationRepository from '../repositories/ConversationRepository'
import mongoose from 'mongoose'
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";

async function init() {
  const httpServer = require('http').createServer((req:any, res:any) => {
    // serve the index.html file
    res.setHeader('Content-Type', 'text/html');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
  });
  
  try {
    await mongoose.connect('mongodb://localhost:27017/test')
  } catch(error) {
    console.log("mongoose error: ")
    console.log(error)
  }
  
  
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
    }
  });
  
  const conversationRepository:ConversationRepository = new ConversationRepository();
  const messagenRepository:MessageRepository = new MessageRepository()
  
  io.on('connection', (socket:any) => {
    console.log('connect');
  
    socket.on("create-conversation", async (event:Conversation)=>{
      if(!!event) {
        event.conversationLink = "aaaaaaaaaa"
        console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
        try {
          const res = await conversationRepository.save(event)
          socket.emit("conversation-created", res)
        } catch(error) {
          console.log(error)
        }
      }
    })

    socket.on("post-message", async (event:Message)=>{
      if(!!event) {
        event.sentBy.isOnline = true
        event.seen = false
        console.log("post-message")
        console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
        try {
          const res = await messagenRepository.createMessage(event)
          socket.emit("message-posted", res)
        } catch(error) {
          console.log(error)
        }
      }
    })
  });
  
  io.listen(5000)
  
  httpServer.listen(5001, () => {
    console.log('go to http://localhost:5001');
  });
}

init()