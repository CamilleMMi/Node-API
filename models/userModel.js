const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const configuration = require('../configuration/configuration');

const { jwt_key } = configuration;

const collectionSchema = new mongoose.Schema({
    _id: false,

    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },

    name: {
        type: String,
        required: [true, "Name of the collection required"]
    },
});

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Name required"],
        },

        lastName: {
            type: String,
            required: [true, "Last name required"],
        },

        email: {
            type: String,
            required: [true, "Email required"],
            index: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(v) {
                if (!validator.isEmail(v)) {
                    throw new Error(`The email must be valid`);
                }
            }
        },

        phone: {
            type:Number,
            required: [true, "Phone number required"],
            index: true,
            unique: true,
        },

        password: {
            type: String,
            required: [true, "Password required"],
            validate(v) {
                if (!validator.isLength(v, { min: 8 })) {
                    throw new Error(`The password must be between 8 and 20 characters`);
                }
            }
        },

        iconUri: {
            type: String,
            default: "https://i.pinimg.com/280x280_RS/0d/12/5b/0d125bef05d84ce60294293ad8ad6d26.jpg"
        },

        collections: [collectionSchema],

        authTokens: [{
            authToken: {
                type: String,
                required: true
            }
        }]
    },

    {
        timestamps: true
    }
)

userSchema.methods.toJSON = function() {
    const user = this.toObject();

    delete user.password;
    delete user.authTokens;
    delete user.lastName;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;

    return user;
}

userSchema.methods.generateAuthTokenAndSaveUser = async function() {
    const authToken = jwt.sign({ _id: this._id.toString() }, jwt_key, { expiresIn: '12h' });
    const options = { validateBeforeSave: false };
    
    this.authTokens.push({ authToken });

    await this.save(options);

    return authToken;
}

userSchema.statics.login = async(email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Login or password incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Login or password incorrect');
    }

    return user;
}

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hashSync(this.password, 12);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;