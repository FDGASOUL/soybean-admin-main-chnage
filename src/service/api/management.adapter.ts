import type { ApiUserManagement } from '~/src/typings/api';
import type { UserManagement } from '~/src/typings/business';
export function adapterOfFetchUserList(data: ApiUserManagement.User[] | null): UserManagement.User[] {
  if (!data) return [];

  return data.map((item, index) => {
    const user: UserManagement.User = {
      index: index + 1,
      key: item.id,
      ...item
    };

    return user;
  });
}

export function adapterOfFetchDataList(data: ApiUserManagement.Data[] | null): UserManagement.Data[] {
  if (!data) return [];

  return data.map((item, index) => {
    const user: UserManagement.Data = {
      Index: index + 1,
      key: item.index,
      ...item
    };

    return user;
  });
}
