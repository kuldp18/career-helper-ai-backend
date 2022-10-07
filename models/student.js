const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      maxlength: 60,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    studentinfo: {
      type: String,
      trim: true,
    },
    encrypted_password: {
      type: String,
      required: true,
    },
    physics_marks: {
      type: Number,
    },
    chemistry_marks: {
      type: Number,
    },
    maths_marks: {
      type: Number,
    },
    biology_marks: {
      type: Number,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

studentSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encrypted_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

studentSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encrypted_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(plainpassword)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
};

module.exports = mongoose.model('Student', studentSchema);
