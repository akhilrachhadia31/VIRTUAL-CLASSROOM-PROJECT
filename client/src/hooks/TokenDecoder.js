import {jwtDecode} from 'jwt-decode';

const getUserByToken = (token) => {
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
}
export default getUserByToken;
