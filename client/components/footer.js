import { Container, Text, Box } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Container maxW="100%">
      <Box
        mt="10"
        p="5"
        background="transparent"
        alignItems="center"
        justifyContent="center"
        d="flex"
      >
        <Text size="md"></Text>
      </Box>
    </Container>
  );
}
