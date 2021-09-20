import "swiper/css";
import "swiper/css/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";

import {
  BellIcon,
} from "@chakra-ui/icons";

export default function Noti(){
    return (
        <Popover closeOnBlur="true" isLazy>
        <PopoverTrigger>
          <BellIcon h="5" w="5" />
        </PopoverTrigger>
        <PopoverContent color="white" bg="#1f1f1f" borderColor="#1f1f1f">
          <PopoverArrow bg="#1f1f1f" />
          <PopoverCloseButton />
          <PopoverHeader pt={4} fontWeight="bold" border="0">Notifications</PopoverHeader>
          <PopoverBody>None</PopoverBody>
        </PopoverContent>
      </Popover>
    );
}