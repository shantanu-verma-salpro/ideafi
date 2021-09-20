import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Container } from "@chakra-ui/react";
import {
  FormLabel,
  Input,
  Textarea,
  Button,
  InputLeftAddon,
  InputGroup,
  useToast
} from "@chakra-ui/react";
import getCat from "../store/cat";
import { withAuthUser, AuthAction,useAuthUser } from 'next-firebase-auth'
import {useRouter} from 'next/router'
import Router from 'next/router'
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#232323' : 'white'
  }),
}
function Idea() {
  const { control, handleSubmit } = useForm();
  const router = useRouter();
  const toast = useToast();
  const AuthUser = useAuthUser()
  const onSubmit = (data) => {
    const fi = { ...data, eth: data.eth ? data.eth : "", createdBy: AuthUser.id,category:data.category.value.toLowerCase()};
    fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fi)
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          toast({
            title: "Error",
            description: "Unknown",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }else{
          toast({
            title: "Congratulations!",
            description: "You just posted idea",
            status: "success",
            duration: 2000,
            isClosable: true,
          })
          Router.push("/");
        }
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "unknown",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      })
  }
  return (
    <>
      <Container maxW="lg" mt="5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            defaultValue="Untitled"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel mt="2">Title</FormLabel>
                <Input type="title" {...field} />
              </>
            )}
          />
          <Controller
            name="eth"
            control={control}
            defaultValue=""
            rules={{ required: false }}
            render={({ field }) => (
              <>
                <FormLabel mt="2">ETH address</FormLabel>
                <Input type="text" {...field} />
              </>
            )}
          />
          <Controller
            name="github"
            control={control}
            defaultValue="username"
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel mt="2">Github</FormLabel>
                <InputGroup size="sm" borderRadius="5">
                  <InputLeftAddon p="5"
                    children={"https://github.com/"}
                    bg="white" color="black"
                  />
                  <Input placeholder="username" {...field} p="5"/>
                </InputGroup>
              </>
            )}
          />
          <Controller
            name="category"
            control={control}
            defaultValue={"Web"}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel mt="4">Category</FormLabel>
                <Select {...field} styles={customStyles}
                  options={Object.keys(getCat()).map((k) => ({
                    value: k,
                    label: k,
                  }))}
                />
              </>
            )}
          />
          <Controller
            name="desc"
            control={control}
            render={({ field }) => (
              <Textarea mt="2" placeholder="Idea description" mt="8" {...field} />
            )}
          />
          <Button mt={4} colorScheme="twitter" type="submit">
            Submit idea
          </Button>
        </form>
      </Container>
    </>
  );
}
export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/auth'
})(Idea)