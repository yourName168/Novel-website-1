import { Router } from 'express'
import {
  followNovelController,
  getMeController,
  loginController,
  logoutController,
  regitsterController,
  unFollowNovelController
} from '~/controllers/Users.Controller'
import {
  accessTokenValidator,
  loginValidator,
  regitsterValidator
} from '~/middlewares/users.middlewares'
import { wrap } from '~/utils/handler'
import { validate } from '~/utils/validation'

const usersRoute = Router()
/**
 * Description. login a new user
 * path: /login
 * mothod: POST
 * Body:{password:string,email:string}
 */
usersRoute.post('/login', validate(loginValidator), wrap(loginController))
/**
 * Description. Regitster a new user
 * path: /regitster
 * mothod: POST
 * Body:{name:string,password:string,email:string,date_of_birth:ISO8601
 * ,confirm_password:string}
 */

usersRoute.post('/register', validate(regitsterValidator), wrap(regitsterController))
/**
 * Description. logout a  user
 * path: /logout
 * mothod: POST
 * Header:{Authorization:Bearer <access_token>}
 * Body:{refresh_token:string}
 */

usersRoute.post('/logout', validate(accessTokenValidator),  wrap(logoutController))
/**
 * Description. verify user
 * path: /verify
 * mothod: POST
 * Body:{email_verify_token:string}
 */
usersRoute.post('/follow-novel', validate(accessTokenValidator),  wrap(followNovelController))
/**
 * Description. follow the novel
 * path: /follow-novel
 * mothod: POST
 * Body:{novelId:string}
 * Header:{Authorization:Bearer <access_token>}
 */
usersRoute.post('/unfollow-novel', validate(accessTokenValidator),  wrap(unFollowNovelController))
/**
 * Description. follow the novel
 * path: /follow-novel
 * mothod: POST
 * Body:{novelId:string}
 * Header:{Authorization:Bearer <access_token>}
 */

usersRoute.get('/get-me',validate(accessTokenValidator),wrap(getMeController))

/**
 * Description. get user profile
 * path: /:username
 * mothod: GET
 * Body:{username}
 */


export default usersRoute
