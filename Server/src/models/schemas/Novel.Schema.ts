import { NovelStatus } from '../requests/Novels.Request'

interface NovelSType {
  descriptionURL: URL
  novelCode: string
  authorName: string
  episodes: number
  descriptionImage: URL
  name: string
  category: string[]
  view?: number
  status?: NovelStatus
}
export class Novel {
  private descriptionURL: URL
  novelCode: string
  private authorName: string
  episodes: number
  private descriptionImage: URL | string
  private novelName: string
  private category: string[]
  private view: number
  private status: NovelStatus
  public getNovelCode = () => this.novelCode
  public getEpisodes = () => this.episodes
  constructor(novel: NovelSType) {
    this.descriptionURL = novel.descriptionURL
    this.novelCode = novel.novelCode
    this.authorName = novel.authorName
    this.episodes = 0
    this.descriptionImage = novel.descriptionImage
    this.novelName = novel.name
    this.category = novel.category
    this.view = 0
    this.status = NovelStatus.upcoming
  }
}

interface ChapterType {
  parentID: string
  novelCode: string
  chapterNumber: number
  contentURL: URL
  chapterName: string
}
export class Chapter {
  private parentID: string
  private novelCode: string
  private chapterNumber: number
  private contentURL: URL
  private chapterName: string
  constructor(chapter: ChapterType) {
    this.parentID = chapter.parentID
    this.novelCode = chapter.novelCode
    this.chapterNumber = chapter.chapterNumber
    this.contentURL = chapter.contentURL
    this.chapterName = chapter.chapterName
  }
}
