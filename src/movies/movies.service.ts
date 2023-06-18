import { Model } from 'mongoose';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto/update-movie.dto';
import { AddRatingDto } from './dto/add-rating.dto/add-rating.dto';
import { S3Service } from './s3-service/s3-service.service'; 

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private s3Service: S3Service,
  ) {}


  // Для получения всех фильмов

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }


  // Для получения фильмов по рейтингу

  async findWithRating(rating: number): Promise<Movie[]> {
    if (rating < 1 || rating > 10) {
      throw new BadRequestException('Rating must be between 1 and 10');
    }
    // Ищем фильмы по целому числу рейтинга (например от 3 до 4 не включительно(3.99) )
    return this.movieModel.find({ rating: { $gte: rating, $lt: rating + 1 }}).exec();
  }


  // Для нахождения фильма по _id

  async findOne(id: string): Promise<Movie> {
    console.log("id:", id);
    
    return this.movieModel.findById(id);
  }


  // Для создания нового фильма

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    if(createMovieDto.rating && (createMovieDto.rating < 1 || createMovieDto.rating > 10)) {
      throw new BadRequestException('Rating must be between 1 and 10');
    }
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }


  // Для обновления данных фильма

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    if(updateMovieDto.rating && (updateMovieDto.rating < 0 || updateMovieDto.rating > 10)) {
      throw new BadRequestException('Rating must be between 0 and 10');
    }
    return this.movieModel.findByIdAndUpdate(id, updateMovieDto, { new: true });
  }


  // Для добавления картинки к фильму

  async updateImage(id: string, file: Express.Multer.File): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const imageUrl = await this.s3Service.uploadImageToS3(file);
    movie.imageUrl = imageUrl;

    return movie.save();
  }


  // Для оставления рейтинга

  async addRating(id: string, addRatingDto: AddRatingDto): Promise<Movie> {
    const rating = addRatingDto.rating;
    if(rating < 1 || rating > 10) {
      throw new BadRequestException('Rating must be between 1 and 10');
    }
  
    const movie = await this.movieModel.findById(id);
  
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
  
    // вычисляем новый рейтинг как среднее значение старого и нового
    let newRating = (movie.rating * movie.ratingCount + rating) / (movie.ratingCount + 1);
    // округляем до 2 знаков после запятой и преобразуем обратно в число
    newRating = +newRating.toFixed(2);
  
    // Проверяем, что рейтинг находится в диапазоне от 1 до 10
    if(newRating < 1) {
      newRating = 1;
    } else if(newRating > 10) {
      newRating = 10;
    }
  
    movie.rating = newRating;
    movie.ratingCount += 1;
  
    return movie.save();
  }


  // Для удаления фильма по _id

  async delete(id: string): Promise<Movie> {
    return this.movieModel.findByIdAndRemove(id);
  }
}