import { NextRequest, NextResponse } from 'next/server';

// EC2 백엔드 API URL (서버 사이드에서만 사용)
const EC2_API_URL = process.env.EC2_API_BASE_URL || 'http://ec2-52-79-241-109.ap-northeast-2.compute.amazonaws.com/api';

// 모든 HTTP 메서드 처리
async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const url = `${EC2_API_URL}/${path}`;

    // 요청 본문 가져오기
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        body = await request.text();
      } catch (e) {
        // 본문이 없는 경우 무시
      }
    }

    // 헤더 복사 (필요한 헤더만)
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('Content-Type') || 'application/json',
    };

    // 쿠키가 있으면 전달
    const cookie = request.headers.get('Cookie');
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    // EC2 API로 요청
    const response = await fetch(url, {
      method: request.method,
      headers,
      body: body || undefined,
      credentials: 'include',
    });

    // 응답 본문
    const responseData = await response.text();

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

    // Set-Cookie 헤더 전달 (인증 토큰을 위해 중요)
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) {
      responseHeaders.set('Set-Cookie', setCookie);
    }

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context);
}
