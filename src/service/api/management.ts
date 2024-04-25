import { adapter } from '@/utils';
import { mockRequest,request } from '../request';
import { adapterOfFetchUserList, adapterOfFetchDataList } from './management.adapter';
import type { ApiUserManagement } from '~/src/typings/api';

/** 获取用户列表 */
export const fetchUserList = async (power: string, all: string) => {
  const data = await request.post<ApiUserManagement.User[] | null>('/getAllUserList', { power, all });
  let i = 0;
  for (; i < data.data?.length; i++) {
    if (data.data[i].userRole === 'super') {
      data.data[i].userRole = '1';
    } else if (data.data[i].userRole === 'admin') {
      data.data[i].userRole = '2';
    } else {
      data.data[i].userRole = '3';
    }
    if (data.data[i].gender === '男') {
      data.data[i].gender = '1';
    } else if(data.data[i].gender === '女') {
      data.data[i].gender = '0';
    } else {
			data.data[i].gender = '2';
		}
  }
  return adapter(adapterOfFetchUserList, data);
};

export const fetchDataList = async (name: string) => {
  return request.post<object>('/getDataList', { name });
};

export const fetchMissingList = async (name: string) => {
  return request.post<object>('/MissingData', { name });
};

export const fetchMissData = async (name: string) => {
  const data = await request.post('/getMissData', { name });
  return data;
};

export const fetchEatData = async (name: string) => {
  const data = await request.post('/getEatData', { name });
  return data;
};

export const fetchDrawData = async (name: string) => {
  const data = await request.post('/getDrawData', { name });
  return data;
};

export const fetchFeatureData = async (name: string) => {
  const data = await request.post('/getFeatureData', { name });
  return data;
};

export const fetchLearnData = async (name: string) => {
  const data = await request.post('/getLearnData', { name });
  return data;
};

export const fetchRepeatData = async (name: string) => {
  const data = await request.post('/getRepeatData', { name });
  return data;
};

export const fixRepeatData = async (name: string) => {
  const data = await request.post('/fixRepeatData', { name });
  return data;
};

export const fetchCorrData = async (type: string, name: string) => {
  const data = await request.post('/correlation', { type, name });
  return data;
};

export const fetchCorrSelect1 = async (select: string, type: string, name: string) => {
  const data = await request.post('/correlationSelect1', { select, type, name });
  return data;
};

export const fetchCorrSelect2 = async (select, name: string) => {
  const data = await request.post('/correlationSelect2', { select, name });
  return data;
};

export const fetchUserData = async () => {
  const data = await request.post('/getUserData');
  return data;
};

export const fetchHeaderData = async (name: string) => {
  const data = await request.post('/distribution', { name });
  return data;
};

export const fetchDataName = async () => {
  const data = await request.post('/getDataName');
  console.log(data);
  return data;
};

export const fetchDistriSelect1 = async (select: string, name: string) => {
  const data = await request.post('/distribution1', { select, name });
  return data;
};

export const fetchDistriSelect2 = async (select: never[], name: string) => {
  const data = await request.post('/distribution2', { select, name });
  return data;
};
