import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema } = mongoose

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'voluntario'], default: 'voluntario' }
}, { timestamps: true })

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})
export default mongoose.model('User', UserSchema);