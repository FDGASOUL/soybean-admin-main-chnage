import { ApiAuth, ApiRoute, ApiMember, ApiUserManagement } from '~/src/typings/api';
import { mockRequest, request } from '../request';
import { List } from 'echarts';
import { adapterOfFetchUserList } from './management.adapter';
import { adapter } from '~/src/utils/service/handler';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 注册
 * @param userName- 用户名
 * @param password - 密码
 */
export function fetchRegistration(userName: string, password: string) {
  return request.post<ApiAuth.Registration>('/registration', { userName, password });
}


/**
 * 登录
 * @param userName - 用户名
 * @param password - 密码
 */
export function fetchLogin(userName: string, password: string) {
  return request.post<ApiAuth.Token>('/login', { userName, password });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return request.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id。
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return request.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return request.post<ApiAuth.Token>('/updateToken', { refreshToken });
}

// /**
//  * 获取成员信息
//  * @param power - 当前权限
//  * @param all - 是否全部成员
//  */
// export function fetchMembers(power: string, all: boolean) {
//   return request.post<ApiMember.Member>('/login', { power, all });
// }

export function userRoleChange(userid: number, userRole: string) {
  return request.post<ApiAuth.Registration>('/userRoleChange', { userid, userRole });
}

export const userFind = async (username) => {
  const data = await request.post<ApiUserManagement.User[] | null>('/userFind', { username });
  let i = 0;
  for (; i < data.data?.length; i++) {
    if (data.data[i].userRole === 'super') {
      data.data[i].userRole = '超级管理员';
    } else if (data.data[i].userRole === 'admin') {
      data.data[i].userRole = '管理员';
    } else {
      data.data[i].userRole = '普通用户';
    }
  }
  return adapter(adapterOfFetchUserList, data);
};


export function fetchUserdel(rowId: string) {
  return request.post('/delUser', { rowId });
}

export function fetchUserdels(rowId: List, power: string) {
  return request.post('/delUsers', { rowId, power });
}

export function Uplandsome(file: FormData) {
  return request.post('/upload', file);
}

export function fetchDatadel(rowId: number) {
  return request.post('/delData', { rowId });
}

export function fetchDatadels(rowId: List) {
  return request.post('/delDatas', { rowId });
}

export function dataChange(id, edit) {
  return request.post('/dataChange', { id, edit });
}

export function dataAdd(data, name) {
  return request.post('/dataADD', { data, name });
}

export function searchSomeData(select,data, name) {
  return request.post('/dataSearch', { select, data, name });
}

export function downland() {
  return request.post('/downland');
}

export function userDataChange(id,data) {
  return request.post('/userDataChange', {id, data });
}
