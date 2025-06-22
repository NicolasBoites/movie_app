import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProxyService } from '../common/clients/proxy/proxy.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiTags('Movies Gateway')
@Controller('movies')
@UseGuards(AccessTokenGuard)
export class MoviesGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: any) {
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movies' },
      query,
      null,
      'MOVIES_SERVICE',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movie' },
      id,
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: any) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'create_movie' },
      createDto,
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateDto: any,
  ) {
    const movie = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'update_movie' },
      { id, updateDto },
      null,
      'MOVIES_SERVICE',
    );
    return movie;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.proxyService.sendMicroserviceMessage(
      { cmd: 'delete_movie' },
      id,
      null,
      'MOVIES_SERVICE',
    );
    return result;
  }

  @Get('batch')
  async getMoviesByIds(
    @Query('ids') ids: string,
    @Req() req: any,
  ) {
    const idArray = ids.split(',').filter(Boolean);
    return this.proxyService.sendMicroserviceMessage(
      { cmd: 'get_movies_by_ids' },
      { ids: idArray },
      req.user,
      'MOVIES_SERVICE',
    );
  }

}