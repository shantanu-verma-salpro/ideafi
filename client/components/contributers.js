import {
  Container,
  VStack,
  Box,
  Badge,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import dynamic from 'next/dynamic'
const Contrib = dynamic(() => import('./contribList'))
export default function C({ contributions }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
          <Button mt="4" mb="3" colorScheme="purple" size="xs" onClick={onOpen}>
              {contributions.length} contributions
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contributers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isOpen && <Contrib contributions={contributions}/>}
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
