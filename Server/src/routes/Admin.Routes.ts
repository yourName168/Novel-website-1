import { Router } from 'express'
import { wrap } from '~/utils/handler'
import {
  addNovelController,
  addChapterOfNovelController,
  updateNovelController,
  updateChapterController,
  
} from '~/controllers/Admin.Controllers'
import { update } from 'lodash'

const adminRouter = Router()
adminRouter.post('/add-novel', wrap(addNovelController))
/**
 * Description. add a new novel to Database
 * path: /add-novel
 * mothod: POST
 * Body:{authorName:string,image:URL,name:string,category:object}
 */

adminRouter.post('/add-chapter-in-novel', wrap(addChapterOfNovelController))
/**
 * Description. add a new chapter to novel
 * path: /add-chapter-in-novel
 * mothod: POST
 * Body:{novelId:string,chapterName:string,chapterContent:string,chapterIndex:number}
 */
adminRouter.patch('/update-novel', wrap(updateNovelController))
/**
 * Description. update novel
 * path: /update-novel
 * mothod: PATCH
 * Body:{novelId:string,authorName:string,image:URL,name:string,category:object}
 */
adminRouter.patch('/update-chapter', wrap(updateChapterController))
/**
 * Description. update chapter
 * path: /update-chapter
 * mothod: PATCH
 * Body:{novelId:string,chapterId:string,chapterName:string,chapterContent:string,chapterIndex:number}
 */
adminRouter.delete('/delete-novel', wrap(updateNovelController))
/**
 * Description. delete novel
 * path: /delete-novel
 * mothod: DELETE
 * Body:{novelId:string}
 */
adminRouter.delete('/delete-chapter', wrap(updateChapterController))
/**
 * Description. delete chapter
 * path: /delete-chapter
 * mothod: DELETE
 * Body:{novelId:string,chapterId:string}
 *
 */



export default adminRouter
