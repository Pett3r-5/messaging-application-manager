import User from "../models/User";
//import { ConversationSchema } from "../schemas/ConversationSchema";
import Conversation from '../models/Conversation'
import ConversationRepository from '../repositories/ConversationRepository'
import mongoose, { Schema } from 'mongoose'
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";
import { ConversationDocument } from "../schemas/ConversationSchema";
import { v4 } from 'uuid'
import MessageService from "../services/MessageService";
import ConversationService from "../services/ConversationService";
import UserService from "../services/UserService";
import UserRepository from "../repositories/UserRepository";

async function init() {
  const httpServer = require('http').createServer((req: any, res: any) => {
    // serve the index.html file
    res.setHeader('Content-Type', 'text/html');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
  });

  try {
    await mongoose.connect('mongodb://localhost:27017/test')
  } catch (error) {
    console.log("mongoose error: ")
    console.log(error)
  }


  const io = require('socket.io')(httpServer, {
    cors: {
      origin: '*',
    }
  });

  const conversationService: ConversationService = new ConversationService(new ConversationRepository());
  const messageService: MessageService = new MessageService(new MessageRepository())
  const userService: UserService = new UserService(new UserRepository())

  io.on('connection', (socket: any) => {
    console.log('connect');

    socket.on("create-conversation", async (event: Conversation) => {
      if (!!event) {
        const uuid = v4()
        event.conversationLink = uuid
        event.users[0].isOnline = true
        try {
          const res = await conversationService.save(event)

          console.log(`conversation created: ${JSON.stringify(res, undefined, 4)}`)
          socket.join(uuid)
          socket.room = uuid;
          io.to(uuid).emit("conversation-joined", res)
        } catch (error) {
          console.log(error)
        }


      }
    })

    socket.on('join-conversation', async (event: { conversationLink: string, user: User }) => {
      try {

        let conv: any = await conversationService.addUserByConversationLink(event.conversationLink, event.user)
        if (!!conv) {
          conv.messages = await messageService.populateMessages(conv.messages)
          socket.room = event.conversationLink;
          socket.join(event.conversationLink)
          io.to(event.conversationLink).emit("conversation-joined", conv)
        }


      } catch (error) {
        console.log(error)
      }
    })

    socket.on("get-conversation", async (event: { conversationLink: string}) => {
      try {
        let conv: any = await conversationService.getConversationByUrlLink(event.conversationLink)

        if (!!conv) {
          conv.messages = await messageService.populateMessages(conv.messages)
          socket.room = event.conversationLink;
          socket.join(event.conversationLink)
          io.to(event.conversationLink).emit("conversation-joined", conv)
        }


      } catch (error) {
        console.log(error)
      }
    })

    socket.on("edit-username", async (user:User)=>{
      console.log("edit-username")
      console.log(user)
      let userUpserted
      try {
        userUpserted = await userService.updateName(user)
        await Promise.all([
          messageService.updateUserName(user.clientId, user.name),
          conversationService.updateUserName(user.clientId, user.name)
        ])
      } catch (error) {
        console.log(error)
      }
      console.log(userUpserted)
      socket.join(user.clientId)
      io.to(user.clientId).emit("user-data", userUpserted)
      
    })

    socket.on('leave-conversation', (conversationLink: string) => {

    })

    socket.on("post-message", async (event: { message: Message, conversation: ConversationDocument }) => {
      if (!!event) {
        event.message.sentBy.isOnline = true
        event.message.seen = false

        console.log("post-message")
        console.log(`test event: ${JSON.stringify(event, undefined, 4)}`)
        try {
          const messageSaved = await messageService.createMessage(event.message)

          event.conversation.messages.push(messageSaved._id)


          event.conversation.users = event.conversation.users.map(el => {
            if (el.clientId === event.message.sentBy.clientId) {
              el.isOnline = true
            }
            return el
          })

          await conversationService.save(event.conversation)
          let updatedConv: any = await conversationService.getConversationById(String(event.conversation._id))
          updatedConv.messages = await messageService.populateMessages(updatedConv.messages)

          console.log("to be returned:")
          console.log(JSON.stringify(updatedConv, undefined, 4))

          io.to(updatedConv.conversationLink).emit("message-posted", updatedConv)
        } catch (error) {
          console.log(error)
        }
      }
    })

    socket.on("request-conversation-list", async (user: User) => {
      let conversationList
      let userUpserted
      try {
        conversationList = await conversationService.getConversationsByClientId(user.clientId)
        userUpserted = await userService.findOrCreateUser(user)
      } catch (error) {
        console.log(error)
      }

      socket.join(user.clientId)
      io.to(user.clientId).emit("user-data", userUpserted)

      if (!!conversationList && conversationList.length > 0) {
        io.to(user.clientId).emit("listen-conversation-list", conversationList)
      }
    })
  });

  io.listen(5000)

  httpServer.listen(5001, () => {
    console.log('go to http://localhost:5001');
  });
}

init()