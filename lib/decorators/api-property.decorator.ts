import { DECORATORS } from '../constants';
import { SchemaObjectMetadata } from '../interfaces/schema-object-metadata.interface';
import { getEnumType, getEnumValues } from '../utils/enum.utils';
import { createPropertyDecorator, getTypeIsArrayTuple } from './helpers';

export interface ApiPropertyOptions
  extends Omit<SchemaObjectMetadata, 'name' | 'enum'> {
  enum?: any[] | Record<string, any>;
}

const isEnumArray = (obj: ApiPropertyOptions): boolean =>
  obj.isArray && !!obj.enum;

export function ApiProperty(
  options: ApiPropertyOptions = {}
): PropertyDecorator {
  const [type, isArray] = getTypeIsArrayTuple(options.type, options.isArray);
  options = {
    ...options,
    type,
    isArray
  };

  if (isEnumArray(options)) {
    options.type = 'array';

    const enumValues = getEnumValues(options.enum);
    options.items = {
      type: getEnumType(enumValues),
      enum: enumValues
    };
    delete options.enum;
  } else if (options.enum) {
    const enumValues = getEnumValues(options.enum);

    options.enum = enumValues;
    options.type = getEnumType(enumValues);
  }

  return createPropertyDecorator(DECORATORS.API_MODEL_PROPERTIES, options);
}

export function ApiPropertyOptional(
  options: ApiPropertyOptions = {}
): PropertyDecorator {
  return ApiProperty({
    ...options,
    required: false
  });
}

export function ApiResponseProperty(
  options: Pick<ApiPropertyOptions, 'type' | 'example'> = {}
): PropertyDecorator {
  return ApiProperty({
    readOnly: true,
    ...options
  });
}
