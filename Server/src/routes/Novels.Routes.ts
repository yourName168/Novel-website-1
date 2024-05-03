import express from 'express'
import {
  getChapterController,
  getChapterOfNovelController,
  getListCategoryController,
  getListNovelByListIdController,
  getListNovelSortedAlphabeticallyController,
  getListNovelSortedByViewController,
  getNextChapterController,
  getPreviousChapterController,
  increaseNovelViewController,
  searchNovelController,
  updateEpisodesController
} from '~/controllers/Novels.Controller'
import { wrap } from '~/utils/handler'
const novelRouter = express.Router()

novelRouter.get('/get-list-novel-by-list-id', wrap(getListNovelByListIdController))
/**
 * Description. get all novel from database
 * path: /get-novel
 * mothod: get
 * Query:{listNovelId?:string[]}
 */
novelRouter.post('/search-novel', wrap(searchNovelController))
/**
 * Description. seach novel by name
 * path: /search-novel
 * mothod: post
 * body:{description:string}
 */
novelRouter.get('/get-chapter-in-novel', wrap(getChapterOfNovelController))
/**
 * Description. get all chapter from novel
 * path: /get-chapter-in-novel
 * mothod: get
 */
novelRouter.patch('/increase-view', wrap(increaseNovelViewController))
/**
 * Description. increase view of novel
 * path: /increase-view
 * mothod: PATCH
 * Body:{novelCode:string}
 */
novelRouter.get('/get-novel-sorted-by-view', wrap(getListNovelSortedByViewController))
/**
 * Description. get all novel sorted by view
 * path: /get-novel-sorted-by-view
 * mothod: get
 */
novelRouter.get('/get-novel-sorted-alphabetically', wrap(getListNovelSortedAlphabeticallyController))
/**
 * Description. get all novel sorted alphabetically
 * path: /get-novel-sorted-alphabetically
 * mothod: get
 */
novelRouter.get('/get-chapter', wrap(getChapterController))
/**
 * Description. get 1 chapter by chapter id
 * path: /get-chapter
 * mothod: get
 */
novelRouter.get('/get-all-category', wrap(getListCategoryController))
/**
 * Description. get all category
 * path: /get-all-category
 * mothod: get
 */
novelRouter.get('/get-previous-chapter', wrap(getPreviousChapterController))
/**
 * Description. get previous chapter
 * path: /get-previout-chapter
 * mothod: get
 */
novelRouter.get('/get-next-chapter', wrap(getNextChapterController))
/**
 * Description. get next chapter
 * path: /get-next-chapter
 * mothod: get
 */
novelRouter.patch('/update-episodes', wrap(updateEpisodesController))
export default novelRouter
