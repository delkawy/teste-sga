import { Entity } from '@application/base/entity';

export class TutorialEntity extends Entity {
  title: string;
  content: string;
  user_id: string;
}
