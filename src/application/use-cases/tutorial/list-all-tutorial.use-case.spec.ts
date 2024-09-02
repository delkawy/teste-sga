import { ListAllTutorialUseCase } from './list-all-tutorial.use-case';
import { InMemoryCacheService } from '@test/services/in-memory-cache-service';
import { makeTutorial } from '@test/factories/tutorial.factory';
import { ListAllTutorialDto } from '@infra/http/dto/list-all-tutorial.dto';
import { InMemoryTutorialRepository } from '@test/repositories/in-memory-tutorial.repository';

describe('ListAllTutorialUseCase', () => {
  let listAllTutorialUseCase: ListAllTutorialUseCase;
  let tutorialRepository: InMemoryTutorialRepository;
  let cacheService: InMemoryCacheService;

  beforeEach(() => {
    tutorialRepository = new InMemoryTutorialRepository();
    cacheService = new InMemoryCacheService();
    listAllTutorialUseCase = new ListAllTutorialUseCase(
      tutorialRepository,
      cacheService,
    );
  });

  it('should return cached data if available', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);

    const dto: ListAllTutorialDto = {
      title: tutorial.title,
      page_number: 1,
      page_size: 10,
    };

    const cacheKey = `tutorials:${JSON.stringify({ title: tutorial.title })}:1:10`;
    const cachedResponse = {
      tutorials: [tutorial],
      metadata: {
        total_items: 1,
        total_pages: 1,
        page_number: 1,
        page_size: 10,
      },
    };

    jest.spyOn(cacheService, 'get').mockResolvedValue(cachedResponse);

    const result = await listAllTutorialUseCase.execute(dto);

    expect(result).toEqual(cachedResponse);
    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
  });

  it('should fetch and cache data if not in cache', async () => {
    const tutorial = makeTutorial();
    await tutorialRepository.create(tutorial);

    const dto: ListAllTutorialDto = {
      title: tutorial.title,
      page_number: 1,
      page_size: 10,
    };

    const cacheKey = `tutorials:${JSON.stringify({ title: tutorial.title })}:1:10`;
    const response = {
      tutorials: [tutorial],
      metadata: {
        total_items: 1,
        total_pages: 1,
        page_number: 1,
        page_size: 10,
      },
    };

    jest.spyOn(cacheService, 'get').mockResolvedValue(null);
    jest.spyOn(tutorialRepository, 'findAll').mockResolvedValue({
      items: [tutorial],
      total_items: 1,
    });
    jest.spyOn(cacheService, 'set').mockResolvedValue(undefined);

    const result = await listAllTutorialUseCase.execute(dto);

    expect(result).toEqual(response);
    expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    expect(tutorialRepository.findAll).toHaveBeenCalledWith({
      page_number: dto.page_number,
      page_size: dto.page_size,
      filters: { title: tutorial.title },
    });
    expect(cacheService.set).toHaveBeenCalledWith(cacheKey, response);
  });

  it('should create filter conditions correctly', () => {
    const filters = {
      title: 'Sample Title',
    };

    const fromDate = new Date('2024-01-01');
    const toDate = new Date('2024-12-31');

    const result = listAllTutorialUseCase['createFilterConditions']({
      filters,
      created_at_from: fromDate,
      created_at_to: toDate,
      updated_at_from: fromDate,
      updated_at_to: toDate,
    });

    expect(result).toEqual({
      title: 'Sample Title',
      created_at: { gte: fromDate, lte: toDate },
      updated_at: { gte: fromDate, lte: toDate },
    });
  });
});
