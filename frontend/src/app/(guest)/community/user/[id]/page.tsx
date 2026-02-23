import UserWall from "@/components/community/UserWall";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-8 my-6">
      <UserWall userId={parseInt(id)} />
    </div>
  );
}
