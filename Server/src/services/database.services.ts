import { Collection, Db, MongoClient } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.Schema'

import dotenv from 'dotenv'
import { Novel } from '~/models/schemas/Novel.Schema'
import User from '~/models/schemas/Users.Schema'
dotenv.config()
const databaseUserName = process.env.USERS_DATABASE_USER
const databasePassword = process.env.USERS_DATABASE_PASSWORD
const userDBName = process.env.USER_DATABASE_NAME
const novelDBName = process.env.NOVEL_DATABASE_NAME
const userCollectionName = process.env.DB_ACCOUNT_COLLECTION as string
const listNovelName = process.env.DB_LIST_NOVEL_COLLECTION_NAME as string
const catagoryCollectionName = process.env.DB_CATEGORY_COLLECTION_NAME as string

const uri = `mongodb+srv://${databaseUserName}:${databasePassword}@useraccount.p0jlcj2.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseService {
  private client: MongoClient
  private userDB: Db
  private novelDB: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.userDB = this.client.db(`${userDBName}`)
    this.novelDB = this.client.db(`${novelDBName}`)
  }
  run = async () => {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch {
      console.log('Cannot connect to database')
    }
  }
  get NovelDB(): Db {
    return this.novelDB
  }
  get getListNovel(): Collection<Novel> {
    return this.novelDB.collection(`${listNovelName}`)
  }
  get getCategory() {
    return this.novelDB.collection(`${catagoryCollectionName}`)
  }

  get users(): Collection<User> {
    return this.userDB.collection(`${userCollectionName}`)
  }
  // từ khóa get giúp cho việt gọi tới hàm users không cần có dấu ()
  // mà chỉ cần gọi tới như một thuộc tính
  // nếu không có get thì sẽ gọi tới giống như một phương thức
  //vd dùng get: databaseService.users
  // vd k dùng get: databaseService.users()
  get refreshToken(): Collection<RefreshToken> {
    return this.userDB.collection(`refreshTokenCollection`)
  }
}
export const databaseService = new DatabaseService()
