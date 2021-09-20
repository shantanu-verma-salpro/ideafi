import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {
  Container,
  VStack,
  Text,
  HStack,
  Box,
  Heading,
  Avatar, AvatarBadge, AvatarGroup,Skeleton,Badge,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useState, useEffect } from "react";
import { StarIcon, CheckCircleIcon } from "@chakra-ui/icons";
import dynamic from 'next/dynamic'
const Contributers = dynamic(() => import('./contributers'))
import Link from "next/link"

function GetBox({ title, contributions, ratings, verified, id,...rest }) {

  return (
    <Box backgroundColor="#1f1f1f" borderRadius="10px">
      <Box p="15" pt="5" pb="5">
        <Heading as="h2" size="sm">
          <Link href={`/ideas/${id}`}><a>{title}</a></Link>
        </Heading>
      <Contributers contributions={contributions}/>
        <HStack justifyContent="space-between">
          <Box d="flex" mt="2" mb="2" alignItems="center">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon 
                  h="13"
                  w="13"
                  mr="1"
                  key={i}
                  color={i < ratings ? "#e9d8fd" : "#5d5d5d"}
                />
              ))}
          </Box>

          {verified ? <CheckCircleIcon /> : null}
        </HStack>
      </Box>
    </Box>
  );
}
function renderCards(idea) {
  return idea.map((x, idx) => (
    <SwiperSlide key={idx}><GetBox {...x}/></SwiperSlide>
  ));
}
function renderLoader(){
  return <><Skeleton height="90px"></Skeleton></>;
}
export default function RenderTrending() {
  const [d, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  //[[x,y,x],[x,y,z]]
  useEffect(() => {
    const ideas = firebase.firestore().collection("ideas").orderBy("createdAt").limit(6);
    ideas.get()
      .then((val) => {
        const arr = [];
        val.forEach((f) => {
          arr.push({id:f.id,...f.data()});
        });
        setData(arr);
        setLoading(false);
      })
      .catch((e) => {
        setErr(e);
        setLoading(false);
      });
  }, []);
  return (
    <Container maxW="100%">
      <VStack alignItems="normal" mt="7">
        <HStack justifyContent="space-between" mb="5">
          <Text fontSize="20px" mt="0" mb="0">
            Trending now
          </Text>
        </HStack>
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
        >
          {loading?renderLoader():renderCards(d)}
        </Swiper>
      </VStack>
    </Container>
  );
}
