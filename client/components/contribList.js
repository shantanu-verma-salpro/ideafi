import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Spinner, Center,HStack,Text,Avatar,VStack } from "@chakra-ui/react";
import Link from 'next/link'

export function useData({contributions}){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function hj() {
      const users = firebase.firestore().collection("users");
      const fn = [];
      const ans = [];
      for (let start = 0; start < contributions.length; start += 10)
        fn.push(contributions.slice(start, start + 10));
      let promises = fn.map((g) =>
        users.where(firebase.firestore.FieldPath.documentId(), "in", g).get()
      );
      for (const element of promises) {
        let result = await element;
        result.forEach((z) => ans.push({id:z.id,...z.data()}));
      }
      setData(ans);
    }
    hj();
  }, []);
  return {data};
}
export default function C({ contributions }) {
  const {data} = useData({contributions});
  return (
    <><VStack spacing="2" alignItems="normal">
      {data ? (
        data.map((j, idx) => <Link href={`/user/${j.id}`} key={idx}><a><HStack><Avatar src={j.photoURL} size="sm"/><Text >{j.fullname}</Text></HStack></a></Link>)
      ) : (
        <Center>
          <Spinner size="xl" />
        </Center>
      )}
      </VStack>
    </>
  );
}
