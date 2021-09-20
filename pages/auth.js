import { withAuthUser, AuthAction } from 'next-firebase-auth'
import Signin from '../client/components/signin';
import Signup from '../client/components/signup';
import {useState} from "react"
import { Container,Button,Spinner,Center,Text } from "@chakra-ui/react";
const Loader = () =>  <Center mt="20"><Spinner size="xl" /></Center>
function Auth(){
    const [num,setNum] = useState(0); // 0 in , 1 up
    const renderForm = ()=>{
        return num?<Signup/>:<Signin/>;
    }
    const renderLink = ()=>{
       return <a href="#"><Text colorScheme="purple" onClick={()=>setNum(!num)}>{!num?"New to ideafi?":"Already have an account?"}</Text></a>
    }
    return (
        <>
        {renderForm()}
        <Container maxW="lg" mt="5">{renderLink()}</Container>
        </>
    );
}
export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.RENDER,
    LoaderComponent: Loader,
  })(Auth)