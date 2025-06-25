import mongoose, { Schema, Document } from "mongoose";
export interface INotification extends Document {
  userId: string;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  time: Date;
  read: boolean;
}
const NotificationSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["info", "success", "warning"], required: true },
  title: String,
  message: String,
  time: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema, "notifications");