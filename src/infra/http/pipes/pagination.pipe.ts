import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { parseISO, isValid, isBefore, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class PaginationFilterPipe implements PipeTransform {
  transform(query: any) {
    const {
      page_size = 10,
      page_number = 1,
      created_at_from,
      created_at_to,
      updated_at_from,
      updated_at_to,
      ...filters
    } = query;

    const pageNumber = Number(page_number);
    const pageSize = Number(page_size);

    if (pageNumber <= 0 || pageSize <= 0) {
      throw new BadRequestException('Page and limit must be positive numbers');
    }

    this.isFromBeforeToDate(created_at_from, created_at_to, 'created');
    this.isFromBeforeToDate(updated_at_from, updated_at_to, 'updated');

    return {
      page_number: pageNumber,
      page_size: pageSize,
      filters,
      created_at_from: created_at_from
        ? startOfDay(parseISO(created_at_from))
        : undefined,
      created_at_to: created_at_to
        ? endOfDay(parseISO(created_at_to))
        : undefined,
      updated_at_from: updated_at_from
        ? startOfDay(parseISO(updated_at_from))
        : undefined,
      updated_at_to: updated_at_to
        ? endOfDay(parseISO(updated_at_to))
        : undefined,
    };
  }

  private isFromBeforeToDate(
    from_date: string,
    to_date: string,
    propertyName: string,
  ) {
    if (from_date && to_date) {
      const fromDate = parseISO(from_date);
      const toDate = parseISO(to_date);

      if (
        !isValid(fromDate) ||
        !isValid(toDate) ||
        isBefore(toDate, fromDate)
      ) {
        throw new BadRequestException(
          `${propertyName}_at_from" must be earlier than or equal to ${propertyName}_at_to`,
        );
      }
    }
  }
}
