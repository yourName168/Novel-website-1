import { ObjectId } from 'mongodb'
import { NovelRequestBody, addChapterRequestBoby } from '~/models/requests/Novels.Request'
import { Chapter, Novel } from '~/models/schemas/Novel.Schema'
import { databaseService } from './database.services'

class AdminServices {
  addChapterbyNovelId = async (payload: addChapterRequestBoby) => {
    const parentID = new ObjectId(payload.novelID)
    await databaseService.getListNovel.updateOne(
      { _id: parentID },
      {
        $inc: { Epspisode: 1 }
      }
    )
    const novel = await databaseService.getListNovel.findOne({ _id: parentID })
    if (!novel) throw new Error('Novel not found')
    const novelCode = novel.novelCode
    const novelColection = databaseService.NovelDB.collection(`${novelCode}`)
    const maxNum = (await novelColection.countDocuments()) + 1
    const result = await novelColection.insertOne(
      new Chapter({ ...payload, parentID: parentID.toString(), novelCode, chapterNumber: maxNum })
    )
    return result
  }
  addNovel = async (payload: NovelRequestBody) => {
    const collection = databaseService.getListNovel
    const maxNum = (await collection.countDocuments()) + 1
    const novelCode = `novel-${maxNum}`
    const result = await collection.insertOne(new Novel({ ...payload, novelCode }))
    databaseService.NovelDB.createCollection(`${novelCode}`)
    const categoryName = payload.category
    categoryName.map(async (category) => {
      const documentCategoryName = await databaseService.getCategory.findOne({ categoryName: category })
      if (documentCategoryName) {
        const res = await databaseService.getCategory.updateOne(
          { categoryName: category },
          { $push: { novelId: result.insertedId } }
        )
      } else {
        const res = await databaseService.getCategory.insertOne({
          categoryName: category,
          novelId: [result.insertedId]
        })
      }
    })
    return result
  }
  updateNovel = async (payload: NovelRequestBody) => {
    const collection = databaseService.getListNovel
    const result = await collection.updateOne({ _id: new ObjectId(payload.novelID) }, { $set: { ...payload } })
    return result
  }
  updateChapter = async (payload: addChapterRequestBoby) => {
    const parentID = new ObjectId(payload.novelID)
    const novel = await databaseService.getListNovel.findOne({ _id: parentID })
    if (!novel) throw new Error('Novel not found')
    const novelCode = novel.novelCode
    const novelColection = databaseService.NovelDB.collection(`${novelCode}`)
    const result = await novelColection.updateOne({ _id: new ObjectId(payload.chapterId) }, { $set: { ...payload } })
    return result
  }
  deleteNovel = async (payload: { novelId: string }) => {
    const collection = databaseService.getListNovel
    const result = await collection.deleteOne({ _id: new ObjectId(payload.novelId) })
    return result
  }
  deleteChapter = async (payload: { novelId: string; chapterId: string }) => {
    const parentID = new ObjectId(payload.novelId)
    await databaseService.getListNovel.updateOne(
      { _id: parentID },
      {
        $inc: { Epspisode: -1 }
      }
    )
    const novel = await databaseService.getListNovel.findOne({ _id: parentID })
    if (!novel) throw new Error('Novel not found')
    const novelCode = novel.novelCode
    const novelColection = databaseService.NovelDB.collection(`${novelCode}`)
    const result = await novelColection.deleteOne({ _id: new ObjectId(payload.chapterId) })
    return result
  }
}
export const adminServices = new AdminServices()
