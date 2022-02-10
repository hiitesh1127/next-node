import { Schema, model } from "mongoose";

interface User {
  id?: string;
  email: string;
  password: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model<User>("user", UserSchema);
export default User;

