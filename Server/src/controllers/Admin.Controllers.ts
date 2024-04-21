import { NextFunction, Request, Response } from 'express'
import { adminServices } from '~/services/Admin.services'

export const addNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.addNovel(req.body)
  res.send(result)
}
export const addChapterOfNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.addChapterbyNovelId(req.body)
  res.send(result)
}
export const updateNovelController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.updateNovel(req.body)
  res.send(result)
}
export const updateChapterController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.updateChapter(req.body)
  res.send(result)
}
export const deleteNovelsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.deleteNovel(req.body)
  res.send(result)
}
export const deleteChaptersController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminServices.deleteChapter(req.body)
  res.send(result)
}
