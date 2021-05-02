import User from "../models/User";
import Conversation from '../models/Conversation'
import mongoose, { Schema, Types } from 'mongoose'
import Message from "../models/Message";
import { v4 } from 'uuid'
import axios, { AxiosResponse } from "axios";

interface ChatServiceBaseUrl {
  [s:string]:string | undefined
}

const chatServiceBaseUrl:ChatServiceBaseUrl = { 
  local: process.env.LOCAL_BASE_URL,
  prod: process.env.PROD_BASE_URL
}

const env = process.env.NODE_ENV || "local"


async function init() {
  const httpServer = require('http').createServer((req: any, res: any) => {
    // serve the index.html file
    res.setHeader('Content-Type', 'text/html');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
  });

  try {
    await mongoose.connect('mongodb://localhost:27017/test', { useUnifiedTopology: true, useNewUrlParser: true })
  } catch (error) {
    console.log("mongoose error: ")
    console.log(error)
  }


  const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', (socket: any) => {
    console.log('connect');

    socket.on("create-conversation", async (event: Conversation) => {
      if (!!event) {
        console.log("create-conversation");

        const uuid = v4()
        event.conversationLink = uuid
        event.users[0].isOnline = true
        try {
          const { data } = await axios.post(`${chatServiceBaseUrl[env]}/conversation`, event)

          socket.join(uuid)
          socket.room = uuid;
          io.to(uuid).emit("conversation-joined", {...data})
        } catch (error) {
          console.log(error)
        }


      }
    })


    socket.on("post-message", async (event: { message: Message, conversation: Conversation }) => {
      if (!!event) {
        event.message.sentBy.isOnline = true
        event.message.seen = false

        console.log("post-message before:")
        console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
        try {
          const { data } = await axios.post(`${chatServiceBaseUrl[env]}/message`, event.message)
          
          event.conversation.messages = (event.conversation.messages  as any[]).map((message:any)=>message._id)

          event.conversation.messages.push(data._id)
          event.conversation.users = event.conversation.users.map(el => {
            if (el.clientId === event.message.sentBy.clientId) {
              el.isOnline = true
            }
            return el
          })
          
          const updatedConv: AxiosResponse<Conversation> = await axios.put(`${chatServiceBaseUrl[env]}/conversation`, event.conversation)

          //let updatedConv: any = await conversationService.getConversationById(String(event.conversation._id))
          console.log("post-message:")
          console.log(JSON.stringify(updatedConv.data, undefined, 4))

          io.to(updatedConv.data.conversationLink).emit("message-posted", {...updatedConv.data})
        } catch (error) {
          console.log(error)
        }
      }
    })



    socket.on('join-conversation', async (event: { conversationLink: string, user: User }) => {
      console.log("join-conversation");
      console.log(event);
      try {

        let { data }: any = await axios.put(`${chatServiceBaseUrl[env]}/conversation/users?conversationLink=${event.conversationLink}`, event.user)
         
        if (!!data) {
          console.log(data)
          socket.room = event.conversationLink;
          socket.join(event.conversationLink)
          io.to(event.conversationLink).emit("conversation-joined", {
            _id: data._id,
            conversationLink: data.conversationLink,
            messages: data.messages,
            subject: data.subject,
            isPublic: data.isPublic,
            persist: data.persist,
            users: data.users
          })
        }


      } catch (error) {
        console.log(error)
      }
    })

    socket.on("get-conversation", async (event: { conversationLink: string }) => {
      console.log("get-conversation")
      console.log(event)

      try {
        let { data }: AxiosResponse<Conversation> = await axios.get(`${chatServiceBaseUrl[env]}/conversation/conversationLink/${event.conversationLink}`)
        console.log("data---------");
        console.log(data);
        if (!!data) {

          socket.room = event.conversationLink;
          socket.join(event.conversationLink)
          io.to(event.conversationLink).emit("conversation-joined", {
            _id: data._id,
            conversationLink: data.conversationLink,
            messages: data.messages,
            users: data.users,
            subject: data.subject || "",
            isPublic: data.isPublic || true,
            persist: data.isPublic || false
          })
        }


      } catch (error) {
        console.log(error)
      }
    })


    socket.on('leave-conversation', (conversationLink: string) => {
      socket.leave(conversationLink);
    })

    

  });

  io.listen(parseInt(process.env.PORT || '3000'))

}

init()