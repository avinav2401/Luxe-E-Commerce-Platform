import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiHandler = (req: Request, ...args: any[]) => Promise<NextResponse> | NextResponse;

export function withApiHandler(handler: ApiHandler) {
  return async (req: Request, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            message: 'Validation Error',
            errors: error.issues.map((e: any) => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      if (error instanceof Error) {
        // Return 400 for expected application errors, 500 for unexpected
        return NextResponse.json(
          { message: error.message || 'Internal Server Error' },
          { status: 500 }
        );
      }

      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  };
}
