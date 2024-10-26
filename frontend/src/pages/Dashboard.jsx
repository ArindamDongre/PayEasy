import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <div className="px-4 py-4">
        <div className="space-y-8">
          <Balance />
          <Users />
        </div>
      </div>
    </div>
  );
};
