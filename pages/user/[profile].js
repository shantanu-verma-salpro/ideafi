import {
  Container,
  Box,
  HStack,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Avatar,
  Flex,
  Spacer,
  AvatarBadge
} from "@chakra-ui/react";
import Link from 'next/link'
import { CheckIcon, SettingsIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "next/router";
import { Spinner,Center} from "@chakra-ui/react"
import QueriedData from '../../client/components/queryDataTable'
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function User() {
  const AuthUser = useAuthUser();
  const router = useRouter();
  const { profile } = router.query;
  const [metadata, setMeta] = useState(null);
  useEffect(() => {
    if (metadata == null) {
      const user = firebase.firestore().collection("users").doc(profile);
      user.get().then((val) => {
        if (val.exists) setMeta(val.data());
        else if (AuthUser.email) setMeta({...AuthUser,verified:false,github:"",about:"Nothing to see here",fullname:AuthUser.displayName});
      });
    }
  }, [profile, AuthUser]);
  return (
    <>
      <Container maxW="100%" mt="5">
        {metadata == null ?  <Center><Spinner w="100px" h="100px" /></Center>:null}
        {metadata && 
        <VStack spacing="5" bg="#131313" p="5" borderRadius="10">
          <Flex w="100%">
            <Box h="38px" w="38px" />
            <Spacer />
            <Avatar size="xl" name="Christian Nwamba" src={metadata.photoURL} >
            {metadata.verified?<AvatarBadge boxSize="0.8em" bg="white"><CheckIcon w="15px" h="15px"/></AvatarBadge>:null}
            </Avatar>
            <Spacer />
            {AuthUser.email ? (
              AuthUser.id == profile ? (
                <Link href={"/settings"}><a><IconButton
                  variant="outline"
                  colorScheme="twitter"
                  aria-label="Settings"
                  fontSize="20px"
                  icon={<SettingsIcon />}
                /></a></Link>
              ) : (
                <Box h="38px" w="38px" />
              )
            ) : (
              <Box h="38px" w="38px" />
            )}
          </Flex>
          <Heading as="h2" size="sm">
            {metadata.fullname}
          </Heading>
          <Text marginTop={"2px !important"}>{metadata.about}</Text>
          <Link href={`https://github.com/${metadata.github}`}><a><FontAwesomeIcon icon={faGithub} size="2x"/></a></Link>
        </VStack>}
      </Container>
      <Container maxW="100%" mt="10">
        <Tabs isLazy colorScheme="twitter" p="0" borderRadius="5">
          <TabList borderColor="#252525">
            <Tab>Created</Tab>
            <Tab>Contributing</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {profile && <QueriedData query={[["createdBy","==",profile]]}/>}
            </TabPanel>
            <TabPanel>
            {profile && <QueriedData query={[["contributions","array-contains",profile]]}/>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}
export default withAuthUser()(User);
