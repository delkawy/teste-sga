import { faker } from '@faker-js/faker';

import { TutorialEntity } from '@application/domain/entities/tutorial.entity';

export function makeTutorial(
  override: Partial<TutorialEntity> = {},
): TutorialEntity {
  const tutorial = new TutorialEntity();

  tutorial.id = faker.string.uuid();
  tutorial.title = faker.music.songName();
  tutorial.content = faker.lorem.text();
  tutorial.updated_at = new Date();
  tutorial.created_at = new Date();

  return { ...tutorial, ...override };
}
