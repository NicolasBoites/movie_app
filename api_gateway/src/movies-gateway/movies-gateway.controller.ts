import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiTags('movies')
@Controller('movies')
@UseGuards(AccessTokenGuard)
export class MoviesGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async findAllMovies(@Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      'find_all_movies',
      {},
      req.user,
      'MOVIES_SERVICE',
    );
  }

  @Get(':id')
  async findMovieById(@Param('id') id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      'find_movie_by_id',
      { id },
      req.user,
      'MOVIES_SERVICE',
    );
  }

  @Post()
  async createMovie(@Body() body: any, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      'create_movie',
      body,
      req.user,
      'MOVIES_SERVICE',
    );
  }

  @Put(':id')
  async updateMovie(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      'update_movie',
      { id, updateMovieDto: body },
      req.user,
      'MOVIES_SERVICE',
    );
  }

  @Delete(':id')
  async deleteMovie(@Param('id') id: string, @Req() req: any) {
    return this.proxyService.sendMicroserviceMessage(
      'delete_movie',
      { id },
      req.user,
      'MOVIES_SERVICE',
    );
  }
}