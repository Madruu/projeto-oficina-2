import mongoose from 'mongoose';
const { Schema } = mongoose;

const TermoLogSchema = new Schema({
  voluntarioId: { type: Schema.Types.ObjectId, ref: 'Voluntario', required: true, index: true },
  fileName: { type: String },
  generatedAt: { type: Date, default: Date.now, index: true }
});

export default mongoose.models.TermoLog || mongoose.model('TermoLog', TermoLogSchema);
