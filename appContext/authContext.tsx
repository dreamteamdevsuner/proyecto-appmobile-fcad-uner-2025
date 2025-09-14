import { createContext, PropsWithChildren, useState } from "react";
//PROVISORIO HAY QUE VER QUE INFO DEVUELVE LA DB CUANDO SE LOGEA USUARIO

enum Role {
  candidate = "candidate",
  recruiter = "recruiter",
}
interface User {
  name: string;
  email: string;
  role: Role;
}
interface UserState {
  isLogged: boolean;
  user: User;
}
const userStateInitiaValues: UserState = {
  isLogged: false,
  user: {} as User,
};
export const AuthContext = createContext<{
  userState: UserState;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => void | false;
  logout: () => void;
}>({
  userState: {
    isLogged: false,
    user: {},
  } as UserState,
  login: function ({ email, password }) {},
  logout: function () {},
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userState, setUserState] = useState<UserState>(userStateInitiaValues);

  //MOCKUP LOGIN
  const login = ({ email, password }: { email: string; password: string }) => {
    if (email === "dev@mail.com") {
      setUserState({
        isLogged: true,
        user: { name: "dev", email: "dev@mail.com", role: Role.candidate },
      });
      return;
    }
    if (email === "recruiter@mail.com") {
      setUserState({
        isLogged: true,
        user: {
          name: "dev",
          email: "recruiter@mail.com",
          role: Role.recruiter,
        },
      });
      return;
    } else {
      setUserState({
        isLogged: false,
        user: {} as User,
      });
      return false;
    }
  };
  //MOCKUP LOGOUT
  const logout = () => {
    setUserState({
      isLogged: false,
      user: {} as User,
    });
  };
  return (
    <AuthContext.Provider value={{ userState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
