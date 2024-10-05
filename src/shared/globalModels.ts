import mongoose, { Document, Model } from 'mongoose';

type ISentEmail = {
  sent_email_counter_id: string;
  day: string;
  month: string;
  year: string;
  count: number;
} & Document;

const sentEmailSchema = new mongoose.Schema<ISentEmail>({
  sent_email_counter_id: {
    type: String,
    default: 'sent_email_counter',
  },
  day: String,
  month: String,
  year: String,
  count: Number,
});

const SentEmail: Model<ISentEmail> = mongoose.model<ISentEmail>(
  'SentEmail',
  sentEmailSchema
);

export { SentEmail };
