const controller = require('../controllers/controller');
const express = require('express');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.get('/', controller.getNews);
router.get('/tags', controller.getAllTags); 
router.get('/all', controller.getAllNews);
router.post('/', upload.array("pictures", 5), controller.createNews);
router.get('/:id', controller.getNewsById);
router.put('/:id', controller.updateNews);
router.delete('/:id', controller.deleteNews);
router.post('/:id/comments', controller.addComment);
router.patch('/:id/like', controller.likeNews);
router.patch('/:id/dislike', controller.dislikeNews);
router.patch('/:id/views', controller.incrementViews);
router.get('/tags/:tag', controller.getNewsByTag);
router.patch('/:id/unlike', controller.unlikeNews);
router.patch('/:id/undislike', controller.undislikeNews);

module.exports = router;