const express = require('express');
const collectionController = require('../controllers/collectionController');

const router = express.Router();

// GETS //

router.get('/', collectionController.getCollections);
router.get('/:id', collectionController.getCollectionFromId);
router.get('/user/:userId', collectionController.getCollectionsByUserId);
router.get('/:collectionId/password/:passwordId', collectionController.getPasswordById);

// POSTS //

router.post('/', collectionController.createCollection);
router.post('/:id/password', collectionController.addPasswordToCollection);
router.post('/:collectionId/share', collectionController.addUserToSharedCollection);

// PUTS //

router.put('/:id', collectionController.putCollection);
router.put('/:collectionId/password/:passwordId', collectionController.updatePasswordInCollection);

// DELETES //

router.delete('/:id', collectionController.deleteCollection);
router.delete('/:collectionId/password/:passwordId', collectionController.deletePasswordFromCollection);

module.exports = router;