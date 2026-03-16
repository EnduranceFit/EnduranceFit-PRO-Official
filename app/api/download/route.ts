import { NextResponse } from 'next/server';
import archiver from 'archiver';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
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
