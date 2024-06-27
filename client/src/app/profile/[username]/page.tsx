import PageContainer from "@/components/layouts/PageContainer";
import { USERS_URL } from "@/constants/server-config";
import UserProfilePage from "@/features/users/components/UserProfilePage";
import { UserDetails } from "@/features/users/types/users.types";
import { notFound } from "next/navigation";

type ProfilePageParamType = {
  username: string
}

const ProfilePage = async ({ params }: { params: ProfilePageParamType }) => {

  const res = await fetch(`${USERS_URL}/${params.username}/details`, {cache: "no-cache"});
  if(res.status === 404) {
    return notFound();
  }
  const data = await res.json() as UserDetails;
  return (
    <PageContainer>
      <UserProfilePage data={data} />
    </PageContainer>
  )
}

export default ProfilePage;