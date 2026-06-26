export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface UpdateUserRequest {
  name?: string;
  job?: string;
}

export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface SupportInfo {
  url: string;
  text: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}

export interface SingleUserResponse {
  data: UserData;
  support: SupportInfo;
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserData[];
  support: SupportInfo;
}
