import { AxiosResponse } from 'axios';
import httpClient from '../utils/httpClient';
import {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  SingleUserResponse,
  UsersListResponse,
} from '../types/user.types';

class UserService {
  private readonly endpoint = '/users';

  createUser(data: CreateUserRequest): Promise<AxiosResponse<CreateUserResponse>> {
    return httpClient.post<CreateUserResponse>(this.endpoint, data);
  }

  getAllUsers(page?: number): Promise<AxiosResponse<UsersListResponse>> {
    return httpClient.get<UsersListResponse>(this.endpoint, {
      params: page !== undefined ? { page } : {},
    });
  }

  getUserById(id: number): Promise<AxiosResponse<SingleUserResponse>> {
    return httpClient.get<SingleUserResponse>(`${this.endpoint}/${id}`);
  }

  updateUser(id: number, data: UpdateUserRequest): Promise<AxiosResponse<UpdateUserResponse>> {
    return httpClient.put<UpdateUserResponse>(`${this.endpoint}/${id}`, data);
  }

  deleteUser(id: number): Promise<AxiosResponse<void>> {
    return httpClient.delete<void>(`${this.endpoint}/${id}`);
  }
}

export default new UserService();
