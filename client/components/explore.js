import { Container, VStack, Text } from "@chakra-ui/react";
import "firebase/firestore";
import QueriedData from './queryDataTable'
export default function Explore({query}) {
  return (
    <Container maxW="100%">
      <VStack spacing="5" alignItems="normal" mt="5" borderRadius="5">
        <Text fontSize="20px" mt="0" mb="0">
          Explore Ideas
        </Text>
        <QueriedData query={query}/>
      </VStack>
    </Container>
  );
}
