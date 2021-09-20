import { useRouter } from "next/router";
import Router from "next/router";
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
            setRatings(val.data().ratings);
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
        })
        .then(() => setCon(true))
        .catch((e) => console.log(e));
    }
  };
  const [ratings, setRatings] = useState(null);
  const onRate = (val) => {
    if (AuthUser.email) {
      firebase
        .firestore()
        .collection("ratings")
        .doc(`${AuthUser.id}_${name}`)
        .set({
          rating: val,
          userId: AuthUser.id,
          ideaId: name,
        })
        .then(() => {
          let sm = 0,
            cnt = 0;
          firebase
            .firestore()
            .collection("ratings")
            .where("ideaId", "==", name)
            .get()
            .then((val) => {
              val.forEach((k) => {
                sm += k.data().rating;
                cnt += 1;
              });
              firebase
                .firestore()
                .collection("ideas")
                .doc(name)
                .update({ ratings: Math.ceil(sm / cnt) })
                .then(() => setRatings(Math.ceil(sm / cnt)))
                .catch((e) => console.log(e));
            });
        })
        .catch((e) => console.log(e));
    }
  };
 
  const getSidebar = () => {
    return (
      <Box w="100%" bg="#131313" p="5" borderRadius="10" minH="100px">
        <VStack alignItems="normal">
        <Box d="flex"  mb="4" alignItems="center">
                <Text mr="2"> Ratings </Text>{Array(5)
                  .fill("")
                  .map((_, i) => (
                    <StarIcon
                      h="13"
                      w="13"
                      _hover={{ color: "#805ad5", cursor: "pointer" }}
                      mr="1"
                      key={i}
                      onClick={() => onRate(i + 1)}
                      color={i < ratings ? "white" : "#5d5d5d"}
                    />
                  ))}
              </Box>
        <Button colorScheme="purple" size="sm">
                <HStack spacing="1">
                  <FontAwesomeIcon icon={faEthereum} size="sm" />
                  <Text>
                    {data.eth.length ? "  " + data.eth : "  Not Provided"}
                  </Text>
                </HStack>
              </Button>
              
          {!isContributer ? (
            <Button mt="3"
              colorScheme="purple"
              size="sm"
              mb="2"
              onClick={startContribution}
            >
              {" "}
              Contribute
            </Button>
          ) : null}
  
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
    );
  };
  const getContents = (left) => {
    if (isPc) {
      return (
        <HStack justifyContent="space-between" alignItems="stretch">
          <Box w="80%" bg="#131313" p="4" borderRadius="10" minH="400px">
            {left}
          </Box>
          <Box w="20%" bg="#131313" p="2" borderRadius="10" minH="400px">
            {getSidebar()}
          </Box>
        </HStack>
      );
    } else
      return (
        <VStack>
          <Box bg="#131313" p="4" borderRadius="10" minH="400px">
            {left}
          </Box>
          <Box bg="#131313" p="2" borderRadius="10" minH="400px">
            {getSidebar()}
          </Box>
        </VStack>
      );
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
              <Heading as="h3" size="lg" mb="3">
                {data.title}
              </Heading>

              <Link href={`https://github.com/${data.github}`}>
                <a>
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
              </Link>
              <Text mt="2">
                <FontAwesomeIcon icon={faCalendarWeek} size="sm" />
                {conv(data.createdAt)}
              </Text>
              
              <Text>{data.desc}</Text>
            </VStack>
            {getContents(<Text>Hello</Text>)}
          </VStack>
        )}
      </Container>
    </>
  );
}
export default withAuthUser()(Idea);
