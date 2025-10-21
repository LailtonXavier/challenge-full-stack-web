import { ZodError, ZodIssue } from 'zod';

interface FormattedError {
  field: string;
  message: string;
}

export class ZodErrorFormatter {
  static format(error: ZodError): FormattedError[] {
    return error.issues.map((issue) => ({
      field: issue.path.join('.') || 'root',
      message: this.getErrorMessage(issue),
    }));
  }

  private static getErrorMessage(issue: ZodIssue): string {
    const fieldName = issue.path[issue.path.length - 1] || 'Field';
    const capitalizedField =
      typeof fieldName === 'string'
        ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        : 'Field';

    switch (issue.code) {
      case 'too_small':
        return `${capitalizedField} must be at least ${issue.minimum} characters`;
      case 'too_big':
        return `${capitalizedField} must be at most ${issue.maximum} characters`;
      case 'unrecognized_keys':
        return `Unexpected field(s): ${issue.keys.join(', ')}`;
      default:
        return issue.message;
    }
  }
}