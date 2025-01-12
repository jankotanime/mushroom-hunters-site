import Image from "next/image";
import Menu from "./components/Menu";
import { cookies } from "next/headers";

export default async function Home() {
  const cookiesStore = await cookies();
  const logCookie = cookiesStore.get("loggedIn");
  return (<Menu logCookie = {logCookie} />);
}
