import axios from "axios";

export const createUser = async (newUserData) => {
    const res = await axios.post("http://localhost:8080/home/users/createUser", newUserData);
    return res
}