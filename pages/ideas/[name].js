import { useRouter } from "next/router";
import Router from "next/router"
import firebase from "firebase/app";
import "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import {
  Center,
  Spinner,
  Container,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Button,
  useMediaQuery,
  Avatar,
} from "@chakra-ui/react";
import ContribList, { useData } from "../../client/components/contribList";
import { faGithub, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import Link from "next/link";
const conv = (x) => {
  return (
    " " +
    new Date(x.seconds * 1000 + x.nanoseconds / 1000000).toLocaleDateString()
  );
};
function Idea() {
  const router = useRouter();
  const [isPc] = useMediaQuery("(min-width: 640px)");
  const { name } = router.query;
  const [data, setData] = useState(null);
  const AuthUser = useAuthUser();
  const [isContributer, setCon] = useState(false);
  const [createdBy, setCreatedBy] = useState(null);
  useEffect(() => {
    if (name) {
      const c = firebase.firestore().collection("ideas").doc(name);
      c.get()
        .then((val) => {
          if (val.exists) {
            setData({ id: val.id, ...val.data() });
            const op = firebase
              .firestore()
              .collection("users")
              .doc(val.data().createdBy);
            op.get()
              .then((v) => setCreatedBy({ id: v.id, ...v.data() }))
              .catch((e) => console.log(e));
            if (AuthUser.email) {
              if (val.data().contributions.includes(AuthUser.id)) {
                setCon(true);
              }
            }
          } else console.log("not found");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [name, AuthUser]);
  const startContribution = () => {
    if (AuthUser.email) {
      firebase
        .firestore()
        .collection("ideas")
        .doc(name)
        .update({
          contributions: firebase.firestore.FieldValue.arrayUnion(AuthUser.id),
        }).then(()=>setCon(true))
        .catch((e) => console.log(e));
    }
  };
  return (
    <>
      <Container mt="5" maxW="100%">
        {!data && (
          <Center>
            <Spinner />
          </Center>
        )}
        {data && (
          <VStack alignItems="normal">
            <VStack bg="#131313" p="5" borderRadius="10">
              <Heading as="h3" size="lg">
                {data.title}
              </Heading>

              <Link href={`https://github.com/${data.github}`}>
                <a>
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
              </Link>
              <Text>
                <FontAwesomeIcon icon={faCalendarWeek} size="sm" />
                {conv(data.createdAt)}
              </Text>
              <Button colorScheme="purple" size="sm">
                <HStack spacing="1">
                  <FontAwesomeIcon icon={faEthereum} size="sm" />
                  <Text>
                    {data.eth.length ? "  " + data.eth : "  Not Provided"}
                  </Text>
                </HStack>
              </Button>
              <Box d="flex" mt="2" mb="2" alignItems="center">
                {Array(5)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      h="13"
                      w="13"
                      mr="1"
                      key={i}
                      color={i < data.ratings ? "white" : "#5d5d5d"}
                    />
                  ))}
              </Box>
              <Text>{data.desc}</Text>
            </VStack>
            {!isPc ? (
              <VStack>
                <Box w="100%" bg="#131313" p="5" borderRadius="10" minH="100px">
                  Content
                </Box>
                <Box w="100%" bg="#131313" p="5" borderRadius="10" minH="100px">
                  <VStack alignItems="normal">
                    {!isContributer ? 
                        <Button
                          colorScheme="purple"
                          size="sm"
                          mb="2"
                          onClick={startContribution}
                        >
                          {" "}
                          Contribute
                        </Button>
                     : null}

                    <Text>Created By</Text>

                    <Box>
                      {createdBy && (
                        <Link href={`/user/${createdBy.id}`}>
                          <a>
                            <HStack>
                              <Avatar src={createdBy.photoURL} />
                              <Text>{createdBy.fullname}</Text>
                            </HStack>
                          </a>
                        </Link>
                      )}
                    </Box>
                  </VStack>
                  <VStack alignItems="normal" mt="2">
                    <Text>Contributers</Text>

                    <Box>
                      <ContribList contributions={data.contributions} />
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            ) : (
              <HStack justifyContent="space-between">
                <Box w="80%" bg="#131313" p="5" borderRadius="10" minH="300px">
                  Content
                </Box>
                <Box w="20%" bg="#131313" p="5" borderRadius="10" minH="300px">
                  <VStack alignItems="normal">
                  {!isContributer ? 
                        <Button
                          colorScheme="purple"
                          size="sm"
                          mb="2"
                          onClick={startContribution}
                        >
                          {" "}
                          Contribute
                        </Button>
                     : null}
                    <Text>Created By</Text>

                    <Box>
                      {createdBy && (
                        <Link href={`/user/${createdBy.id}`}>
                          <a>
                            <HStack>
                              <Avatar src={createdBy.photoURL} />
                              <Text>{createdBy.fullname}</Text>
                            </HStack>
                          </a>
                        </Link>
                      )}
                    </Box>
                  </VStack>
                  <VStack alignItems="normal" mt="2">
                    <Text>Contributers</Text>

                    <Box>
                      <ContribList contributions={data.contributions} />
                    </Box>
                  </VStack>
                </Box>
              </HStack>
            )}
          </VStack>
        )}
      </Container>
    </>
  );
}
export default withAuthUser()(Idea);
