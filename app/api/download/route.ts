import { NextResponse } from 'next/server';
import archiver from 'archiver';

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

// We only export these when NOT in static mode to avoid build errors with 'output: export'
export const dynamic = isStaticExport ? undefined : 'force-dynamic';
export const runtime = isStaticExport ? undefined : 'nodejs';

export async function GET() {
  if (isStaticExport) {
    return new NextResponse('Not available in static export', { status: 404 });
  }

  const archive = archiver('zip', { zlib: { level: 9 } });

  const stream = new ReadableStream({
    start(controller) {
      archive.on('data', (chunk) => controller.enqueue(chunk));
      archive.on('end', () => controller.close());
      archive.on('error', (err) => controller.error(err));

      archive.glob('**/*', {
        cwd: process.cwd(),
        ignore: ['node_modules/**', '.next/**', '.git/**', 'public/codigo-fonte.zip', 'zip.js']
      });

      archive.finalize();
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="codigo-fonte.zip"',
    },
  });
}
