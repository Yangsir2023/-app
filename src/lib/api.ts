/**
 * 前端 API 客户端
 * 封装所有对后端 API 的请求，提供类型安全的访问
 */
import { Pet, RescueStation, FAQ, Application } from '../types';

// 用户会话 ID（使用 localStorage 持久化，模拟用户标识）
function getUserSession(): string {
  let session = localStorage.getItem('pet_user_session');
  if (!session) {
    session = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('pet_user_session', session);
  }
  return session;
}

// 通用请求封装
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// =====================================================================
// 宠物相关 API
// =====================================================================

/** 获取宠物列表，可按分类或搜索词筛选 */
export async function fetchPets(params?: {
  category?: string;
  search?: string;
}): Promise<Pet[]> {
  const qs = new URLSearchParams();
  if (params?.category && params.category !== 'all') {
    qs.set('category', params.category);
  }
  if (params?.search) {
    qs.set('search', params.search);
  }
  const query = qs.toString() ? `?${qs.toString()}` : '';
  return request<Pet[]>(`/pets${query}`);
}

/** 获取单只宠物详情 */
export async function fetchPetById(id: string): Promise<Pet> {
  return request<Pet>(`/pets/${id}`);
}

// =====================================================================
// 救助站相关 API
// =====================================================================

/** 获取救助站列表 */
export async function fetchStations(): Promise<RescueStation[]> {
  return request<RescueStation[]>('/stations');
}

// =====================================================================
// FAQ 相关 API
// =====================================================================

/** 获取常见问题列表 */
export async function fetchFAQs(): Promise<FAQ[]> {
  return request<FAQ[]>('/faqs');
}

// =====================================================================
// 领养申请相关 API
// =====================================================================

export interface ApplicationPayload {
  petId: string;
  petName: string;
  petImage: string;
  breed: string;
  age: string;
  applicantName: string;
  phone: string;
  address: string;
  housingType: 'apt' | 'house';
  experience: string;
}

/** 获取当前用户的领养申请列表 */
export async function fetchApplications(): Promise<Application[]> {
  const session = getUserSession();
  return request<Application[]>(`/applications?session=${encodeURIComponent(session)}`);
}

/** 提交领养申请 */
export async function submitApplication(payload: ApplicationPayload): Promise<{
  success: boolean;
  message: string;
  application: { id: string; petName: string; status: string; progress: number };
}> {
  const session = getUserSession();
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify({ ...payload, userSession: session }),
  });
}

// =====================================================================
// 收藏相关 API
// =====================================================================

/** 获取当前用户收藏的宠物 ID 列表 */
export async function fetchFavoritePetIds(): Promise<string[]> {
  const session = getUserSession();
  return request<string[]>(`/favorites?session=${encodeURIComponent(session)}`);
}

/** 切换收藏状态（已收藏则取消，未收藏则添加） */
export async function toggleFavorite(petId: string): Promise<{
  favorited: boolean;
  message: string;
}> {
  const session = getUserSession();
  return request('/favorites', {
    method: 'POST',
    body: JSON.stringify({ petId, userSession: session }),
  });
}
