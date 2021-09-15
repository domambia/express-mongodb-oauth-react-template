import fs from "fs";
import express, { Response, Request, NextFunction } from "express";
import sharp from "sharp";
import multer from "multer";
import { v1 as uuid1 } from "uuid";
import { body } from "express-validator";
import { BadRequestError } from "./../../errors/bad-request-error";

const router = express.Router();

// UUID options for settings the name of the image
const uuidOptions = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date(Date.now()).getTime(),
  nsecs: 5678,
};

const fileName = uuid1(uuidOptions);

// create custom folder
const createOrReturnFolder = async (folderName: string) => {
  let folder = `${__dirname}/../public/${folderName}`;
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder;
};

/**Upload image preparations */

const multerStorage = multer.memoryStorage();
/**
 * Filter that files uploaded are images not something else
 */
const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Not An image. Please  upload only images`), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const UploadPhoto = upload.single("photo");

const resizePhoto = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }
  req.file.filename = `${req.body.dirName}-${fileName}-${Date.now()}.jpeg`;
  const data = sharp(req.file.buffer)
    .toFormat("png")
    .jpeg({
      quality: 90,
    })
    .toFile(
      `${await createOrReturnFolder(req.body.dirName)}/${req.file.filename}`
    )
    // .toFile(`${__dirname}/../public/photos/${req.file.filename}`)
    .catch((e) => {
      console.log(e);
    });
  next();
};

const docStorage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, `${await createOrReturnFolder(req.body.dirName)}`);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1].toLowerCase();
    const requireExt = ["png", "jpg", "pdf", "jpeg"];
    if (!requireExt.includes(ext)) {
      throw new BadRequestError(
        "You can only upload documents with the following extension. .pdf, .png, .jpeg, and jpg"
      );
    }
    const name = `${req.body.dirName}-${fileName}-${Date.now()}.${ext}`;
    cb(null, name);
  },
});

const docMulterFilter = (req: Request, file: any, cb: any) => {
  if (file) {
    cb(null, true);
  } else {
    throw new BadRequestError(`No upload document`);
  }
};

const uploadDoc = multer({ storage: docStorage, fileFilter: docMulterFilter });

const uploadDocument = uploadDoc.single("doc");

router.post(
  "/api/utilities/uploads/photos",
  [
    body("dirName")
      .notEmpty()
      .withMessage("You must provide the holding dirctory name field: dirName"),
  ],
  UploadPhoto,
  resizePhoto,
  async (req: Request, res: Response) => {
    const full_url = req.protocol + "://" + req.get("host");

    if (!req.body.dirName) {
      throw new BadRequestError(
        "You must provide the holding dirctory name field: dirName"
      );
    }
    const file_name = `${full_url}/${req.body.dirName}/${req.file?.filename}`;

    res.status(201).json({
      status: "success",
      url: file_name,
      message: "Successfully submited a photo",
    });
  }
);

router.post(
  "/api/utilities/uploads/docs",
  [
    body("dirName")
      .notEmpty()
      .withMessage("You must provide the holding dirctory name field: dirName"),
  ],
  uploadDocument,
  async (req: Request, res: Response) => {
    const full_url = req.protocol + "://" + req.get("host");
    if (!req.body.dirName) {
      throw new BadRequestError(
        "You must provide the holding dirctory name field: dirName"
      );
    }
    const file_name = `${full_url}/${req.body.dirName}/${req.file?.filename}`;

    res.status(201).json({
      status: "success",
      url: file_name,
      message: "Successfully submited a doccument",
    });
  }
);

export { router as UploadUtilitiesRoutes };
