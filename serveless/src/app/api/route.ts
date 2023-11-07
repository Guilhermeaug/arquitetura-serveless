import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const style = searchParams.get('style');
  const seed = searchParams.get('seed') || 'default';
  
  await kv.lpush('dicebear', `${style}:${seed}`);

  return Response.json({
    image: `${style}:${seed}`,
  });
}

export async function GET(request: Request) {
  const images = await kv.lrange('dicebear', 0, -1);
  return Response.json(images);
}

export async function DELETE(request: Request) {
  await kv.del('dicebear');
  return Response.json({
    message: 'success',
  });
}
