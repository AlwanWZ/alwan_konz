// src/models/announcement.ts
import mongoose, { Schema, Document } from "mongoose";
export interface IAnnouncement extends Document {
  title: string;
  message: string;
  date: Date;
}
const AnnouncementSchema = new Schema({
  title: String,
  message: String,
  date: { type: Date, default: Date.now },
});
export default mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema, "announcements");