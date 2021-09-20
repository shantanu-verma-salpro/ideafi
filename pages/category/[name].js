import { useRouter } from "next/router";
import QueriedData from '../../client/components/queryDataTable'
import {
    Container,
  } from "@chakra-ui/react";
export default function Cat(){
    const router = useRouter();
    const {name} = router.query;
    console.log(name);
    return <>
    <Container maxW="100%" mt="10">
    {name && <QueriedData query={[["category","==",name.toLowerCase()]]}/>}
    </Container>
    </>
}