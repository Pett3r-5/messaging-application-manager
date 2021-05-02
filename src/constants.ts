export interface ChatServiceBaseUrl {
    [s:string]:string | undefined
  }
  
export const chatServiceBaseUrl:ChatServiceBaseUrl = { 
    local: process.env.LOCAL_BASE_URL,
    prod: process.env.PROD_BASE_URL
  }