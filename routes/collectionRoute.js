const express = require('express');
const collectionController = require('../controllers/collectionController');
const authentification = require('../middleware/authentification');

const router = express.Router();

// GETS //

router.get('/', authentification, collectionController.getCollections);
router.get('/:id', authentification, collectionController.getCollectionFromId);
router.get('/user/:userId', authentification, collectionController.getCollectionsByUserId);
router.get('/:collectionId/password/:passwordId', authentification, collectionController.getPasswordById);

// POSTS //

router.post('/', authentification, collectionController.createCollection);
router.post('/:id/password', authentification, collectionController.addPasswordToCollection);
router.post('/:collectionId/share', authentification, collectionController.addUserToSharedCollection);

// PUTS //

router.put('/:id', authentification, collectionController.putCollection);

// PATCH //

router.put('/:collectionId/password/:passwordId', authentification, collectionController.updatePasswordInCollection);

// DELETES //

router.delete('/:id', authentification, collectionController.deleteCollection);
router.delete('/:collectionId/password/:passwordId', authentification, collectionController.deletePasswordFromCollection);

module.exports = router;