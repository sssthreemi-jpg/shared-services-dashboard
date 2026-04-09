import { Company, Task } from '@/types';

/**
 * API 기본 URL
 * 환경변수로 외부 API 서버를 지정할 수 있음
 * 미설정 시 같은 Next.js 서버의 API Route 사용
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);
  if (!res.ok) {
    throw new Error(`API 오류: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** 전체 회사 목록 조회 */
export function getCompanies(): Promise<Company[]> {
  return fetchJSON<Company[]>('/api/companies');
}

/** 특정 회사 상세 조회 */
export function getCompany(id: string): Promise<Company> {
  return fetchJSON<Company>(`/api/companies/${id}`);
}

/** 과제 목록 조회 (필터 옵션) */
export function getTasks(filters?: {
  companyId?: string;
  status?: string;
  priority?: string;
  area?: string;
}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
  }
  const query = params.toString();
  return fetchJSON<Task[]>(`/api/tasks${query ? `?${query}` : ''}`);
}
