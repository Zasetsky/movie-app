import { Controller, UseGuards, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard/jwt-auth.guard';
import { CreateMovieDto } from './dto/create-movie.dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto/update-movie.dto';
import { AddRatingDto } from './dto/add-rating.dto/add-rating.dto';


@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get('sort/:rating')
  findWithRating(@Param('rating') rating: string) {
    return this.moviesService.findWithRating(Number(rating));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
      return this.moviesService.updateImage(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/rating')
  addRating(@Param('id') id: string, @Body() addRatingDto: AddRatingDto) {
    return this.moviesService.addRating(id, addRatingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}