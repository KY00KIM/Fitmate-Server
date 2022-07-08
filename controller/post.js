const {Post} = require('../model/Post');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const postController = {
    /**
    * @path {GET} http://localhost:8000/v1/posts
    * @description 사용자와 연관된 모든 매칭글을 조회하는 GET Method
    */
     getAllPosts: async (req, res) =>{
        try {
            const posts = await Post.find({});
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](posts, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
          } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_USER', STATUS_CODE.INVALID_USER);
          }
    },
    /**
    * @path {GET} http://localhost:8000/v1/posts/:postId
    * @description 사용자와 연관된 특정 매칭글을 조회하는 GET Method
    */
    getOnePost: async (req, res) =>{
        try {
            const {
                params: { postId },
              } = req;
            const post = await Post.findById(postId);
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
          } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_USER', STATUS_CODE.INVALID_USER);
          }
    },
    /**
    * @path {POST} http://localhost:8000/v1/posts
    * @description 특정 매칭글을 등록하는 POST Method
    */
    writePost: async (req, res) =>{
        try {
            const {
                body: {  },
              } = req;
            const post = await Post.findById(postId);
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
          } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('INVALID_USER', STATUS_CODE.INVALID_USER);
          }
    }

}

module.exports = postController;