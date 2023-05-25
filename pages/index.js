import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";


export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
       <h2>Hello, <b>{session?.user?.name}</b></h2>
       <div className="flex item-center justify-between bg-gray-300  py-1 gap-1 rounded-lg overflow-hidden">
        <div className="overflow-hidden">

          <Image src={session?.user.image} alt="avatar" height={24} width={24}/>
        </div>
        <div className="px-2">
          <span>{session?.user.name}</span>
        </div>
       </div>
      </div>
    </Layout>
  )
}
