import jwt from 'jsonwebtoken';

export const decodedUser = () => {
  const accessToken = localStorage.getItem('token');
  const decoded = jwt.decode(accessToken);
  // console.log('decoded--->', decoded);
  return decoded;
};
