const Collection = require('../models/collectionModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const encryption = require('../utils/encryption');

// Return all collections
const getCollections = asyncHandler(async (req, res) => {
    try {
        const collections = await Collection.find({});
        res.status(200).json(collections);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get one collection using its ID
const getCollectionFromId = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { decrypt } = req.query;

        const collection = await Collection.findById(id);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with ID ${id}`);
        }

        if (decrypt) {
            collection.passwords.forEach(password => {
                password.login = encryption.decryptData(password.login);
                password.password = encryption.decryptData(password.password);
            });
        }

        res.status(200).json(collection);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get all the user's collections by his ID
const getCollectionsByUserId = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error(`Cannot find any user with the id: ${userId}`);
        }

        const userCollections = user.collections || [];

        res.status(200).json({ userCollections });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get one password using its collection's ID and own's
const getPasswordById = asyncHandler(async (req, res) => {
    try {
        const { collectionId, passwordId } = req.params;
        const collection = await Collection.findById(collectionId);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${collectionId}`);
        }

        const password = collection.passwords.find(p => p._id.equals(passwordId));

        if (!password) {
            res.status(404);
            throw new Error(`Cannot find any password with the id: ${passwordId} in the collection`);
        }

        res.status(200).json({ password });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


// Create a collection
const createCollection = asyncHandler(async (req, res) => {
    try {
        const ownerExists = await User.exists({ _id: req.body.ownerId });

        if (!ownerExists) {
            res.status(404);
            throw new Error(`User with ID ${req.body.ownerId} not found`);
        }

        const collection = await Collection.create(req.body);
        
        if (!collection) {
            res.status(500);
            throw new Error(`Cannot create the collection`);
        }
        
        const updateOwnerCollections = await User.findByIdAndUpdate(
            req.body.ownerId,
            {
                $push: {
                    collections: {
                        id: collection._id,
                        name: collection.name
                    }
                }
            },

            { new: true }
        )
            
        res.status(200).json({ collection, updateOwnerCollections });
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Add a password to a collection
const addPasswordToCollection = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        let { login, password, commentaire } = req.body;

        const collection = await Collection.findById(id);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${id}`);
        }

        login = encryption.encryptData(login);
        password = encryption.encryptData(password);

        collection.passwords.push({
            login,
            password,
            commentaire
        });

        const updatedCollection = await collection.save();

        res.status(200).json({ collection: updatedCollection });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Share the collection with a user using his ID
const addUserToSharedCollection = asyncHandler(async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { userIds } = req.body;

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${collectionId}`);
        }

        const usersToAdd = await User.find({ _id: { $in: userIds } });

        if (!usersToAdd || usersToAdd.length !== userIds.length) {
            res.status(404);
            throw new Error(`One or more users not found in the provided list`);
        }

        const existingSharedUsers = collection.sharedWith.map(String);
        const usersToAddFiltered = usersToAdd.filter(user => !existingSharedUsers.includes(String(user._id)));

        if (usersToAddFiltered.length === 0) {
            res.status(400);
            throw new Error(`All users are already shared in the collection`);
        }

        const newSharedUserIds = usersToAddFiltered.map(user => user._id);
        collection.sharedWith = [...existingSharedUsers, ...newSharedUserIds];

        const updatedCollection = await collection.save(
            { new: true }
        );

        await User.updateMany(
            { _id: { $in: newSharedUserIds } },
            { $push: { collections: { id: collection._id, name: collection.name } } }
        );

        res.status(200).json({ collection: updatedCollection });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Update a collection using its ID
const putCollection = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInfo = Object.keys(req.body);

        const collection = await Collection.findById(id);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${id}`);
        }

        updatedInfo.forEach(field => 
                collection[field] = req.body[field]
        );

        const updateUsers = await User.updateMany(
            { "collections.id": collection._id },
            { $set: { "collections.$.name": collection.name }}
        );

        await collection.save(
            { new: true }
        );

        res.status(200).json({ collection, updateUsers });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Update a password using its collection's ID and own's
const updatePasswordInCollection = asyncHandler(async (req, res) => {
    try {
        const { collectionId, passwordId } = req.params;
        const password = req.body

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${collectionId}`);
        }

        const passwordExists = collection.passwords.some(p => p._id.equals(passwordId));

        if (!passwordExists) {
            res.status(404);
            throw new Error(`Cannot find any password with the id: ${passwordId} in the collection with the id: ${collectionId}`);
        }

        const passwordObject = collection.passwords.find(p => p._id.equals(passwordId));

        passwordObject.login = password.login ? encryption.encryptData(password.login) : passwordObject.login;
        passwordObject.password = password.password ? encryption.encryptData(password.password) : passwordObject.password;
        passwordObject.commentaire = password.commentaire ? password.commentaire : "";

        const updatedCollection = await collection.save();

        res.status(200).json({ collection: updatedCollection });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});


// Delete a collection using its ID
// TODO FAIRE EN SORTE QUE SI DELETE ET QUE PAS OWNER JUSTE SUPPRESSION DU TABLEAU ET NON SUPPRESSION DE LA COLLECTION
const deleteCollection = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await Collection.findById(id);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${id}`);
        }

        await Collection.findByIdAndDelete(id);

        const result = await User.updateMany(
            { "collections.id": collection._id },
            { $pull: { collections: { id: collection._id } } }
        );

        res.status(200).json({ message: "Collection deleted", result });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Dele a password using its collection's ID and own's
const deletePasswordFromCollection = asyncHandler(async (req, res) => {
    try {
        const { collectionId, passwordId } = req.params;

        const collection = await Collection.findById(collectionId);

        if (!collection) {
            res.status(404);
            throw new Error(`Cannot find any collection with the id: ${collectionId}`);
        }

        const passwordExists = collection.passwords.some(p => p._id.equals(passwordId));

        if (!passwordExists) {
            res.status(404);
            throw new Error(`Cannot find any password with the id: ${passwordId} in the collection`);
        }

        const updatedCollection = await Collection.findByIdAndUpdate(
            collectionId,
            { $pull: { passwords: { _id: passwordId } } },
            { new: true }
        );

        res.status(200).json({ collection: updatedCollection });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

module.exports = {
    getCollections,
    getCollectionFromId,
    getCollectionsByUserId,
    getPasswordById,
    createCollection,
    addPasswordToCollection,
    addUserToSharedCollection,
    putCollection,
    updatePasswordInCollection,
    deleteCollection,
    deletePasswordFromCollection,
};
