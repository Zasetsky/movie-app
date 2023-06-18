import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: configService.get('AWS_REGION'), // Замените на ваш регион в AWS
      accessKeyId: configService.get('AWS_ACCESS_KEY'), // Замените на ваш AWS Access Key
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'), // Замените на ваш AWS Secret Access Key
    });
  }

  async uploadImageToS3(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer, mimetype } = file;
  
    if (!mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }
    console.log(mimetype);
    
    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // Замените на имя вашего bucket в S3
      Key: originalname.replace(/ /g, "_"),
      Body: buffer,
      ContentType: mimetype,
    };
  
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (error, data) => {
        if (error) {
          reject('Something is wrong! Unable to upload at the moment.' + error);
        }
        if (data) {
          resolve(data.Location);
        }
      });
    });
  }
}  