import ProfileHeader from "@/components/ProfilePage/ProfileHeader";
import ProfileForm from "@/components/ProfilePage/ProfileForm";
import AdditionalInfo from "@/components/ProfilePage/AdditionalInfo";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ProfileHeader />
      <div className="max-w-2xl mx-auto p-6">
        <ProfileForm />
        <AdditionalInfo />
      </div>
    </div>
  );
}
