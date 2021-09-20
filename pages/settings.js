import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import { Container, Button, Spinner, Center } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { FormLabel, Input, useToast } from "@chakra-ui/react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useState, useEffect } from "react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import {faUpload} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Loader = () => (
  <Center mt="20">
    <Spinner size="xl" />
  </Center>
);

function Setting() {
  const { control, handleSubmit } = useForm();
  const AuthUser = useAuthUser();
  const [metadata, setMeta] = useState(null);
  useEffect(() => {
    if (metadata == null && AuthUser.email) {
      const user = firebase.firestore().collection("users").doc(AuthUser.id);
      user.get().then((val) => {
        if (val.exists) setMeta(val.data());
        else if (AuthUser.email){
        const yu = {
          email: AuthUser.email,
          displayName: AuthUser.displayName,
          photoURL: AuthUser.photoURL ? AuthUser.photoURL : "/pic.jpg",
          verified: false,
          github: "",
          about: "Nothing to see here",
          fullname: AuthUser.displayName,
        };
          setMeta(yu);
      }

      });
    }
  }, [AuthUser]);
  const onSubmit = (data) => {
    const user = firebase.firestore().collection("users").doc(AuthUser.id);
    try {
      user.set({
        ...data,
        photoURL: metadata.photoURL ? metadata.photoURL : "/pic.jpg",
        verified: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setMeta({ ...metadata, photoURL: base64 });
  };
  return (
    <Container maxW="70%" mt="5">
      {metadata ? null : <Loader />}
      {metadata && (
        <>
          <Center mt="10">
            <label>
            <input style={{display:"none"}}
              type="file"
              accept="image/*"
              multiple={false}
              onChange={(e) => handleFileRead(e)}
            />
            <Avatar
              size="2xl"
              name={metadata.fullname}
              src={metadata.photoURL}
            >
             
            </Avatar>
            </label>
          </Center>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              defaultValue={metadata.email}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  <FormLabel mt="2">Email</FormLabel>
                  <Input type="email" {...field} />
                </>
              )}
            />
            <Controller
              name="about"
              control={control}
              defaultValue={metadata.about}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  <FormLabel mt="2">About</FormLabel>
                  <Input type="text" {...field} />
                </>
              )}
            />
            <Controller
              name="fullname"
              control={control}
              defaultValue={metadata.fullname}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  <FormLabel mt="2">Full Name</FormLabel>
                  <Input type="text" {...field} />
                </>
              )}
            />
            <Controller
              name="github"
              control={control}
              defaultValue={metadata.github}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  <FormLabel mt="2">Github</FormLabel>
                  <Input type="text" {...field} />
                </>
              )}
            />
            <Controller
              name="displayName"
              control={control}
              defaultValue={metadata.displayName}
              rules={{ required: false }}
              render={({ field }) => (
                <>
                  <FormLabel mt="2">Username</FormLabel>
                  <Input type="text" {...field} />
                </>
              )}
            />

            <Button mt={4} colorScheme="twitter" type="submit">
              Update
            </Button>
          </form>
        </>
      )}
    </Container>
  );
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: "/auth",
  LoaderComponent: Loader,
})(Setting);
