export interface NovelRequestBody {
  novelID: string
  authorName: string
  descriptionImage: URL
  name: string
  category: string[]
  descriptionURL: URL
  episodes: number

  // object include category id
}
export enum NovelStatus {
  upcoming,
  updating,
  full
}
export interface addChapterRequestBoby {
  chapterId: string
  novelID: string
  chapterName: string
  contentURL: URL
}
export interface getChapterRequestBody {
  novelCode: string
}
export interface getListNovelByListIdRequestBody {
  listNovelId?: string[]
}
