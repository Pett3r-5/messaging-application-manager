import User from "../models/User";
//import { ConversationSchema } from "../schemas/ConversationSchema";
import Conversation from '../models/Conversation'
import ConversationRepository from '../repositories/ConversationRepository'
import mongoose, { Schema } from 'mongoose'
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";
import { ConversationDocument } from "../schemas/ConversationSchema";
import { v4 } from 'uuid'

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
  const messageRepository:MessageRepository = new MessageRepository()
  
  io.on('connection', (socket:any) => {
    console.log('connect');
  
    socket.on("create-conversation", async (event:Conversation)=>{
      if(!!event) {
        event.conversationLink = v4()
        event.users[0].isOnline = true
        try {
          const res = await conversationRepository.save(event)
          
        console.log(`conversation created: ${JSON.stringify(res, undefined, 4)}`)
          socket.emit("conversation-created", res)
        } catch(error) {
          console.log(error)
        }
      }
    })

    socket.on("post-message", async (event:{message: Message, conversation: ConversationDocument})=>{
      if(!!event) {
        event.message.sentBy.isOnline = true
        event.message.seen = false
        
        console.log("post-message")
        console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
        try {
          const messageSaved = await messageRepository.createMessage(event.message)

          event.conversation.messages.push(messageSaved._id)


          event.conversation.users = event.conversation.users.map(el=>{
            if(el.clientId===event.message.sentBy.clientId){
              el.isOnline = true
            }
            return el
          })

          await conversationRepository.save(event.conversation)
          const updatedConv:any = await conversationRepository.getConversationById(String(event.conversation._id))
          
          let messageRequests:any = []
          messageRequests = updatedConv.messages.map((el:any)=>messageRepository.getMessageById(String(el)))
          const messagesFromConversation = await Promise.all(messageRequests)
          updatedConv.messages = messagesFromConversation
          
          console.log("to be returned:")
          console.log(messagesFromConversation)
          console.log(JSON.stringify(updatedConv, undefined, 4))
          socket.emit("message-posted", updatedConv)
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