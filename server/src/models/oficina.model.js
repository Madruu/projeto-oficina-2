import mongoose from 'mongoose';
const { Schema } = mongoose;

const OficinaSchema = new Schema({
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, trim: true },
    data: { type: Date },
    local: { type: String, trim: true },
    responsavel: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Oficina', OficinaSchema);