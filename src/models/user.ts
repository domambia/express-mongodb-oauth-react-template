/** @format */

import { Model, Schema, model, Document } from "mongoose";
import {PasswordManager} from  "./../utils/index";

interface Attrs {
  username: string;
  photo?: string;
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: Attrs): UserDoc;
}

interface UserDoc extends Document {
  username: string;
  email: string;
  photo?: string;
  password: string;
  created_at?: Date;
  is_active?: boolean;
}

const userSchema = new Schema(
  {
    token: { type: String},
    email: { type: String},
    photo: {type:  String},
    password: { type: String},
    created_at: {
      type: Date,
      default: Date.now
    },
    is_active: { type: Boolean, default: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.statics.build = (attrs: Attrs) => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = model<UserDoc, UserModel>("User", userSchema);
export { User, UserDoc };
