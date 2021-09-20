import "swiper/css";
import "swiper/css/navigation";
import {
  Container,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,IconButton
} from "@chakra-ui/react";
import { AddIcon, ArrowRightIcon, SettingsIcon } from "@chakra-ui/icons";
import Link from "next/link";
import dynamic from "next/dynamic";
const Notification = dynamic(() => import("./noti"), { ssr: false });
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faSignOutAlt,
  faSignInAlt,
  faPlusCircle,faMugHot
} from "@fortawesome/free-solid-svg-icons";

import { useAuthUser, withAuthUser } from "next-firebase-auth";
import useAuth from "../hooks/useAuth";
function Header() {
  const AuthUser = useAuthUser();
  const { signout } = useAuth();
  return (
    <Container maxW="100%">
      <HStack justifyContent="space-between" pt="5">
      <Link href="/"><a><FontAwesomeIcon
                        icon={faMugHot}
                        size="2x"
                      /></a></Link>

        {AuthUser.email ? (
          <HStack spacing="6">
            <Notification />
            <Menu isLazy >
              <MenuButton borderWidth="0px"
               _hover={{ bg: "#805ad5",color:"white" }}
               _expanded={{ bg: "#805ad5",color:"white" }}
                as={IconButton}
                aria-label="Options"
                icon={<SettingsIcon />}
                variant="outline"
              />
              <MenuList color="blackAlpha.700" zIndex="999">
                
                  <Link href="/create">
                    <a><MenuItem><HStack spacing="2">
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        widths="27px"
                        xHeight="27px"
                      /> <Text>Create idea</Text></HStack></MenuItem>
                    </a>
                  </Link>
                
               
                  <Link href={`/user/${AuthUser.id}`}>
                    <a> <MenuItem><HStack spacing="2">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        widths="27px"
                        xHeight="27px"
                      /> <Text>Profile</Text></HStack></MenuItem>
                    </a>
                  </Link>
                
                <MenuItem  onClick={async () => {
                      await signout();
                    }}><HStack spacing="2">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    widths="27px"
                    xHeight="27px"
                   
                  /> <Text>Signout</Text></HStack>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        ) : (
          <Link href="/auth">
            <a>
              <FontAwesomeIcon
                icon={faSignInAlt}
                widths="27px"
                xHeight="27px"
              />
            </a>
          </Link>
        )}
      </HStack>
    </Container>
  );
}
export default withAuthUser()(Header);
