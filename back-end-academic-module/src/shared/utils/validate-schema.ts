import { ZodTypeAny } from 'zod';
import { Either, left, right } from '../core/utils/validation';

export async function validateSchema<T>(
  schema: ZodTypeAny,
  data: unknown
): Promise<Either<Error, T>> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');

    return left(new Error(`Validation error: ${formattedErrors}`));
  }

  return right(result.data as T);
}
