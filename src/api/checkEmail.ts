import apiClient from './axiosInstance';

export interface CheckEmailResponse {
  success: boolean;
  response: null;
  error: {
    status: number;
    message: string;
  } | null;
}

const checkEmail = async (email: string): Promise<CheckEmailResponse> => {
  try {
    const response = await apiClient.get('/members/check/email', {
      params: {email},
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as CheckEmailResponse;
    } else {
      return {
        success: false,
        response: null,
        error: {
          status: 500,
          message: '���� ���ۿ� �����Ͽ����ϴ�',
        },
      } as CheckEmailResponse;
    }
  }
};
export default checkEmail;
