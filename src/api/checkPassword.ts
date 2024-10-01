import apiClient from './axiosInstance';

export interface CheckPasswordData {
  password: string;
}

export interface CheckPasswordResponse {
  success: boolean;
  response: null;
  error: {
    status: number;
    message: string;
  } | null;
}

const checkPasswordFormat = async (
  passwordData: CheckPasswordData,
): Promise<CheckPasswordResponse> => {
  try {
    const response = await apiClient.post<CheckPasswordResponse>(
      '/members/check/password',
      passwordData,
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      // �����κ����� ���� ���� ��ȯ
      return error.response.data as CheckPasswordResponse;
    } else {
      // ��Ʈ��ũ ���� ���� ���
      return {
        success: false,
        response: null,
        error: {
          status: 500,
          message: '������ �߻��߽��ϴ�!',
        },
      } as CheckPasswordResponse;
    }
  }
};

export default checkPasswordFormat;
