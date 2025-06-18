import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './service/movie.service';
import { getModelToken } from '@nestjs/mongoose';

// Mock movie document returned by Mongoose
const mockMovieDoc = {
  _id: { toString: () => 'mockId' },
  title: 'Mock Title',
  rank: 5,
  genre: 'Mock Genre',
};

describe('MovieService', () => {
  let service: MovieService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getModelToken('Movie'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([mockMovieDoc]),
            findById: jest.fn().mockResolvedValue(mockMovieDoc),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    model = module.get<any>(getModelToken('Movie'));
  });

  describe('findAll', () => {
    it('should return an array of transformed movies', async () => {
      const result = await service.findAll(1, 10);

      expect(model.find).toHaveBeenCalledWith({});
      expect(model.sort).toHaveBeenCalledWith({ _id: 1 });
      expect(result).toEqual([
        {
          id: 'mockId',
          title: 'Mock Title',
          rank: 5,
          genre: 'Mock Genre',
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single movie document', async () => {
      const result = await service.findOne('mockId');

      expect(model.findById).toHaveBeenCalledWith('mockId');
      expect(result).toEqual(mockMovieDoc);
    });

    it('should throw NotFoundException if movie not found', async () => {
      model.findById.mockResolvedValue(null);
      await expect(service.findOne('invalidId')).rejects.toThrow('Movie not found');
    });
  });
});
