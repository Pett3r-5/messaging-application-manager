import User from "../models/User";
import Conversation from '../models/Conversation'
import Message from "../models/Message";
import { v4 } from 'uuid'
import axios, { AxiosResponse } from "axios";
import { app } from '../app'
require('dotenv').config()


let chatServiceBaseUrl = process.env.LOCAL_BASE_URL

if(process.env.NODE_ENV === 'prod') {
  chatServiceBaseUrl = process.env.PROD_BASE_URL
}


async function init() {
  const server = app.listen(5001)
  

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ["GET",'OPTIONS', "POST" ],
      credentials: true,
      transport : ['websocket']
    }
  });

  console.log('-----------------------------started---------------------------');

  io.on('connection', (socket: any) => {

    socket.on("create-conversation", async (event: Conversation) => {
      if (!!event) {
        const uuid = v4()
        event.conversationLink = uuid
        event.users[0].isOnline = true
        try {
          const { data } = await axios.post(`${chatServiceBaseUrl}/conversation`, event)

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

        try {
          const { data } = await axios.post(`${chatServiceBaseUrl}/message`, event.message)
          
          event.conversation.messages = (event.conversation.messages  as any[]).map((message:any)=>message._id)

          event.conversation.messages.push(data._id)
          event.conversation.users = event.conversation.users.map(el => {
            if (el.clientId === event.message.sentBy.clientId) {
              el.isOnline = true
            }
            return el
          })
          
          const updatedConv: AxiosResponse<Conversation> = await axios.put(`${chatServiceBaseUrl}/conversation`, event.conversation)

          io.to(updatedConv.data.conversationLink).emit("message-posted", {...updatedConv.data})
        } catch (error) {
          console.log(error)
        }
      }
    })



    socket.on('join-conversation', async (event: { conversationLink: string, user: User }) => {
      try {

        let { data }: any = await axios.put(`${chatServiceBaseUrl}/conversation/users?conversationLink=${event.conversationLink}`, event.user)
         
        if (!!data) {
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

      try {
        let { data }: AxiosResponse<Conversation> = await axios.get(`${chatServiceBaseUrl}/conversation/conversationLink/${event.conversationLink}`)

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

  console.log(parseInt(process.env.PORT || '5000'))
  io.listen(parseInt(process.env.PORT || '5000'))

}

init()