export const userMapper = (data) => {
    // Map the response array
    const mappedUsers = data.map((user) => ({
      id: user._id,
      name: `${user.UserName} ${user.UserSurname}`,
      phone: user.UserTel,
      adresse: user.UserAddress,
      email: user.Useremail,
      type: user.type ?? 'store'
    }));
    return mappedUsers;
}

export const createUserMappertoApi = (userData) => {
  const test = {
      "UserName": userData?.name,
      "UserSurname": userData?.lastName,
      "Useremail": userData?.email,
      "UserAddress": userData?.adresse,
      "UserTel": userData?.phone,
      "actif": true,
      "password": userData?.password,
      "role": userData?.role || 'optician',
      "type": userData?.type,
      "userDeploymentContext": {}
    }
  return test;
}