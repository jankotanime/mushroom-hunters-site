import Image from "next/image";
import Menu from "./components/Menu";
import { cookies } from "next/headers";
import Main from "./components/Main";
import Login from "./components/Login";

export default async function Home() {
  const cookiesStore = await cookies();
  const logCookie = cookiesStore.get("loggedIn") || null;
  const user = cookiesStore.get("user") || null;
  
  const result = logCookie && user ? <Main user = {user['value']}/> : <Login />
  return (result);
}
