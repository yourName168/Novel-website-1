import { ObjectId } from 'mongodb'
import { Novel } from '~/models/schemas/Novel.Schema'
import { databaseService } from './database.services'
class novelService {
  getListNovelByListId = async (listNovelId?: string[] | string) => {
    if (!listNovelId) {
      const result = await databaseService.getListNovel.find({}).toArray()
      console.log(123)
      return result
    } else {
      const result: Novel[] = []
      if (typeof listNovelId === 'string') {
        await databaseService.getListNovel.findOne({ _id: new ObjectId(listNovelId) }).then((document) => {
          if (document) {
            result.push(document as unknown as Novel)
          }
        })
      } else {
        await Promise.all(
          listNovelId.map(async (id) => {
            const document = await databaseService.getListNovel.findOne({ _id: new ObjectId(id) })
            if (document) {
              result.push(document as unknown as Novel)
            }
          })
        )
      }
      console.log(result)
      return result
    }
  }

  getAllChapterOfNovel = async (novelCode: string) => {
    const result = await databaseService.NovelDB.collection(`${novelCode}`).find({}).toArray()
    return result
  }
  increaseNovelView = async (novelCode: string) => {
    const collection = databaseService.getListNovel
    const result = await collection.updateOne({ novelCode }, { $inc: { view: 1 } })
    return result
  }
  getListNovelSortedByView = async () => {
    const result = await databaseService.getListNovel.find({}).sort({ view: -1 }).toArray()
    return result
  }
  getListNovelSortedAlphabetically = async () => {
    const result = await databaseService.getListNovel.find({}).sort({ novelName: 1 }).toArray()
    return result
  }
  getAllCategory = async () => {
    const result = await databaseService.getCategory.find({}).toArray()
    return result
  }
  getChapterById = async (chapterId: string, novelCode: string) => {
    const result = await databaseService.NovelDB.collection(`${novelCode}`).findOne({ _id: new ObjectId(chapterId) })
    console.log(result)
    return result
  }
  getPreviousChapter = async (chapterId: string, novelCode: string) => {
    const chapter = await databaseService.NovelDB.collection(`${novelCode}`).findOne({ _id: new ObjectId(chapterId) });
    if (chapter) {
      const chapterNumber = chapter.chapterNumber;
      if (chapterNumber === 1) {
        return chapter;
      }

      const previousChapter = await databaseService.NovelDB.collection(`${novelCode}`).findOne({ chapterNumber: chapterNumber - 1 });
      return previousChapter;
    }
  }
  getNextChapter = async (chapterId: string, novelCode: string) => {
    const chapter = await databaseService.NovelDB.collection(`${novelCode}`).findOne({ _id: new ObjectId(chapterId) });
    if (chapter) {
      const novelId = chapter.parentID;
      const novel = await databaseService.getListNovel.findOne({ _id: new ObjectId(novelId) });
      if (novel) {
        const episodes = novel.episodes;
        const chapterNumber = chapter.chapterNumber;
        if (chapterNumber === episodes) {
          return chapter;
        }
        const nextChapter = await databaseService.NovelDB.collection(`${novelCode}`).findOne({ chapterNumber: chapterNumber + 1 });
        return nextChapter;
      }
    }
  }
  updateEpisodes = async () => {
    const listNovel = await databaseService.getListNovel.find({}).toArray()
    for (let i = 0; i < listNovel.length; i++) {
      const novel = listNovel[i]
      const novelCode = novel.novelCode
      const chapters = await databaseService.NovelDB.collection(`${novelCode}`).find({}).toArray()
      await databaseService.getListNovel.updateOne({ novelCode }, { $unset: { Episodes: "" } })
    }
    return {
      message: 'Update episodes successfully'
    }
  }
}

export const NovelService = new novelService()
