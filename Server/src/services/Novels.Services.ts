import { ObjectId } from 'mongodb'
import { Novel } from '~/models/schemas/Novel.Schema'
import { databaseService } from './database.services'
class novelService {
  getListNovelByListId = async (listNovelId?: string[] | string) => {
    if (!listNovelId) {
      const result = await databaseService.getListNovel.find({}).toArray()
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
      return result
    }
  }
  searchNovel = async (description: string) => {
    const result = await databaseService.getListNovel.find({ novelName: { $regex: description } }).toArray();
    return result;
}

  getAllChapterOfNovel = async (novelCode: string) => {
    const result = await databaseService.NovelDB.collection(`${novelCode}`).find({}).toArray()
    return result
  }
  increaseView = async (chapterId: string, novelCode: string) => {

    const novel = await databaseService.getListNovel.findOne({ novelCode });
    const categories = novel?.category || [];

    // Increment view count for each category
    const categoryUpdates = categories.map(async (category) => {
      await databaseService.getCategory.updateOne(
        { categoryName: category },
        { $inc: { view: 1 } }
      );
    });

    // Increment view counts for novel and chapter
    const novelUpdate = databaseService.getListNovel.updateOne(
      { novelCode: novelCode },
      { $inc: { view: 1 } }
    );
    const chapterUpdate = databaseService.NovelDB.collection(novelCode).updateOne(
      { _id: new ObjectId(chapterId) },
      { $inc: { view: 1 } }
    );

    // Wait for all updates to complete
    await Promise.all([...categoryUpdates, novelUpdate, chapterUpdate]);

    return { success: true };
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
  increaseFollow = async (novelId: string) => {
    const novel = await databaseService.getListNovel.updateOne({ _id: new ObjectId(novelId) }, {
      $inc: { followed: 1 }
    })
    return novel
  }
  decreaseFollow = async (novelId: string) => {
    const novel = await databaseService.getListNovel.updateOne(
      { _id: new ObjectId(novelId) },
      { $inc: { followed: -1 } } // Sử dụng $inc để giảm giá trị của trường followed đi 1
    );
    return novel;
  }
  updateNovelStatus = async () => {
    const listNovel = await databaseService.getListNovel.find().toArray()
    listNovel.forEach(async (novel) => {
      const { novelCode, episodes, _id } = novel
      if (episodes > 0) {
        await databaseService.getListNovel.updateOne({ _id },
          {
            $set: { followed: 0 }
          }
        )
      }
    })
    return "update successfully!"
  }

}

export const NovelService = new novelService()
