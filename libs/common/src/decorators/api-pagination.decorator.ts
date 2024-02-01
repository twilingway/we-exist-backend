import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPagination() {
    return applyDecorators(
        ApiQuery({ name: 'page', required: false, type: Number, description: 'Номер страницы' }),
        ApiQuery({ name: 'limit', required: false, type: Number, description: 'Количество элементов на страницу' }),
        ApiQuery({ name: 'search', required: false, type: String, description: 'Поисковый запрос' }),
        // Добавьте здесь другие общие параметры пагинации/поиска
    );
}
