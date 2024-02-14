import {useEffect, useState} from "react";
import Heading from "@atlaskit/heading";
import EmptyState from "@atlaskit/empty-state";
import React from "react";

export type UserApiCallProps = {
    accessToken: string | null
}

async function getUser(accessToken: string | null): Promise<{ name: string; email: string; } | null> {
    try {
      const response = await fetch("https://api.atlassian.com/me", {
          headers: {
              "Authorization": "Bearer " + accessToken,
              "Accept": "application/json",
          },
      })
      if (response.ok) {
        const responseJson = await response.json()
        return responseJson;
      }
      return null;
  } catch (error) {
      console.error("An error occurred while fetching data from the endpoint: ", error);
      throw error;
  }}


const UserApiCall = ({accessToken}: UserApiCallProps) => {
    const [user, setUser] = useState<{name: string, email: string} | null>(null)
    useEffect(() => {
        async function fetchUser() {
          const data = await getUser(accessToken);
          setUser(data);
        }
        fetchUser();
    }, [accessToken]);
    return<>        {!user ? <EmptyState header={"Request the user's information"} primaryAction={<Heading level={"h500"}>Not Logged In</Heading>}/> : <>
    <Heading level={"h500"}>Logged in User Details</Heading>
    Name: {user.name}<br />
    Email: {user.email}<br />
</>}</>

}

export default UserApiCall
