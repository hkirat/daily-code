import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";
import UserDetailForm from "../../components/UserDetailForm";
import { getUserDetail } from "../../components/utils";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session || !session?.user) {
    redirect("/auth");
  }

  const user = await getUserDetail(session?.user?.id)

  if (!user) {
    return (
      <div>
        <p>User not found. Please contact support or try again later.</p>
      </div>
    )
  }

  return (
    <div>
      <header className="border-b-2 p-3">
        <div className="px-2">
          <h1 className="text-2xl flex items-center gap-2 font-semibold w-fit">
            <UserRound color="#3b82f6" />
            <span>Profile</span>
          </h1>
          <span className="text-xs text-gray-400">This page shows you your profile and account details</span>
        </div>
      </header>

      <main className="p-3">
        <UserDetailForm user={user} />
      </main>
    </div>
  );
}
