import useAuth from "../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { Container } from "@chakra-ui/react";
import { FormLabel, Input, Button,useToast } from "@chakra-ui/react";

export default function Auth() {
    const toast = useToast();
  const { signup } = useAuth();
  const { control, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try{
        await signup(data.email,data.password);
        
        toast({
            title: "Account created",
            description: "Please wait",
            status: "success",
            duration: 2000,
            isClosable: true,
          })
    }catch(e){
        toast({
            title: "Some error occurred",
            description: e.message,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
    }
  }

  return (
    <>
      <Container maxW="lg" mt="5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel mt="2">Email</FormLabel>
                <Input type="email" {...field} />
              </>
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <FormLabel mt="2">Password</FormLabel>
                <Input type="password" {...field} />
              </>
            )}
          />
          <Button mt={4} colorScheme="twitter" type="submit">
            Signup
          </Button>
        </form>
      </Container>
    </>
  );
}
