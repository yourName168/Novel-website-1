import { NextFunction, Request, Response } from 'express'
import { NovelService } from '~/services/Novels.Services'

export const getListNovelByListIdController = async (req: Request, res: Response, next: NextFunction) => {
  const listNovelId = req.query.listNovelId as string[] | string
  console.log(listNovelId)
  const result = await NovelService.getListNovelByListId(listNovelId)
  res.send(result)
}

export const getChapterOfNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const novelCode = req.query.novelCode as string
  const result = await NovelService.getAllChapterOfNovel(novelCode)
  res.send(result)
}
export const increaseNovelViewController = async (req: Request, res: Response, next: NextFunction) => {
  const novelCode = req.body.novelCode as string
  const result = await NovelService.increaseNovelView(novelCode)
  res.send(result)
}
export const getListNovelSortedByViewController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await NovelService.getListNovelSortedByView()
  res.send(result)
}
export const getListNovelSortedAlphabeticallyController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await NovelService.getListNovelSortedAlphabetically()
  res.send(result)
}
export const getListCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await NovelService.getAllCategory()
  res.send(result)
}
export const getChapterController = async (req: Request, res: Response, next: NextFunction) => {
  const chapterId = req.query.chapterId as string
  const novelCode = req.query.novelCode as string
  const result = await NovelService.getChapterById(chapterId,novelCode)
  res.send(result)
}
export const getPreviousChapterController = async (req: Request, res: Response, next: NextFunction) => {
  const chapterId = req.query.chapterId as string
  const novelCode = req.query.novelCode as string
  const result = await NovelService.getPreviousChapter(chapterId,novelCode)
  res.send(result)
}
export const getNextChapterController = async (req: Request, res: Response, next: NextFunction) => {
  const chapterId = req.query.chapterId as string
  const novelCode = req.query.novelCode as string
  const result = await NovelService.getNextChapter(chapterId,novelCode)
  res.send(result)
}
export const updateEpisodesController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await NovelService.updateEpisodes()
  res.send(result)
}