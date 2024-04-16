import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopUser from "@/components/shared/User/TopUser";

type IProps = {
  title: string;
  userData: TopUser[];
};

const TopUsers: React.FC<IProps> = ({ title, userData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {userData &&
          userData.length > 0 &&
          userData.map((user, index) => {
            return (
              <TopUser
                key={`top-user-${user.id}`}
                userData={user}
                index={index}
              />
            );
          })}
      </CardContent>
    </Card>
  );
};

export default TopUsers;
