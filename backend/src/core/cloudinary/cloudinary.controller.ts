import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger/dist/decorators/api-use-tags.decorator";

@ApiTags("cloudinary")
@Controller("cloudinary")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("image"))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Post("upload-large-video")
  @UseInterceptors(FileInterceptor("video"))
  uploadLargeVideo(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadLargeVideo(file);
  }

  @Get("signature")
  getSignature(@Query("folder") folder: string = "videos") {
    return this.cloudinaryService.getSignature(folder);
  }
}
