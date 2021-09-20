import { ChakraProvider } from "@chakra-ui/react"
import { Container } from "@chakra-ui/react"
import Header from "../client/components/header";
import Footer from "../client/components/footer";
import '../styles/globals.css'
import initAuth from '../client/store/initAuth'
initAuth();

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Container maxW="100%" minH="100vh" backgroundColor="#0D0D0D" textColor="white" >
      <Header/>
      <Component {...pageProps} />
      <Footer/>
      </Container>
    </ChakraProvider>
  )
}
export default MyApp