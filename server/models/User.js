/**
 * User Model
 * ─────────────────────────────────────────────────────────────────
 * Represents a platform user — either an Admin or an Employee.
 *
 * Fields:
 *   name       — display name
 *   email      — unique login identifier
 *   password   — bcrypt-hashed, never stored in plain text
 *   role       — 'admin' or 'employee'
 *   department — the department the user belongs to (employees)
 *   createdAt  — auto-set by Mongoose timestamps
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type     : String,
      required : [true, 'Name is required'],
      trim     : true,
    },

    email: {
      type      : String,
      required  : [true, 'Email is required'],
      unique    : true,
      lowercase : true,
      trim      : true,
      match     : [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type     : String,
      required : [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // Never return the password field in query results by default
      select   : false,
    },

    role: {
      type    : String,
      enum    : ['admin', 'employee'],
      default : 'employee',
    },

    department: {
      type    : String,
      default : '',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save hook — hashes the password before saving to the database.
 * Only runs when the password field has been modified (not on every save).
 */
userSchema.pre('save', async function (next) {
  // Skip hashing if the password hasn't changed
  if (!this.isModified('password')) return next();

  // Hash with a salt of 12 rounds — strong enough for production
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * Instance method — compares a plain-text password against the stored hash.
 * Returns true if they match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
