import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import getCat from '../store/cat'
import { Container, VStack, Text, HStack, Box } from "@chakra-ui/react";
import Link from 'next/link';
function renderCategory() {
 
  const ds = {
    fill: "white",
    width: "50px",
  };
  return (
    <Box>
      {Object.keys(getCat()).map((k) => (
        <SwiperSlide key={k}>
          <Link href={`/category/${k}`}><a><HStack
            spacing="5"
            background="#805ad5"
            p="2"
            pl="3"
            pr="3"
            borderRadius="5"
            color="white"
          >
            <Box d="flex" h="50px" w="50px" justifyContent="center" alignItems="center" >{getCat()[k]}</Box>
            <Text>{k}</Text>
          </HStack>
          </a></Link>
        </SwiperSlide>
      ))}
    </Box>
  );
}
export default function renderCategoryCols() {
  return (
    <Container maxW="100%">
      <VStack alignItems="normal" mt="7">
        <HStack justifyContent="space-between" mb="5">
          <Text fontSize="20px" mt="0" mb="0">
            Categories
          </Text>
        </HStack>
        <Swiper
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 10,
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
          {renderCategory()}
        </Swiper>
      </VStack>
    </Container>
  );
}
