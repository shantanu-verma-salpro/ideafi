import { useState, useEffect } from "react";
import { CheckIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import DataTable, { createTheme } from "react-data-table-component";
import firebase from "firebase/app";
import "firebase/firestore";
import Link from 'next/link'
import { Skeleton, Box,Container } from "@chakra-ui/react";

createTheme("solarized", {
  text: {
    primary: "white",
    secondary: "white",
  },
  background: {
    default: "#0D0D0D",
  },
  context: {
    background: "#1f1f1f",
    text: "white",
  },
  divider: {
    default: "#2e2e2e",
  },
  action: {
    button: "white",
    hover: "white",
    disabled: "grey",
  },
  rows: {
    fontSize: "18px",
  },
});
const conv = (x) => {
  return new Date(x.seconds * 1000 + x.nanoseconds / 1000000).toUTCString();
};
const customColumnSort = (rowA, rowB) => {
    if (rowA.ratings > rowB.ratings) {
     return 1;
    } else if (rowB.ratings > rowA.ratings) {
     return -1;
    }
    return 0;
  };
export default function Explore({ query }) {
  const columns = [
    {
      name: "Title",
      selector: (row) => <Link href={`/ideas/${row.id}`}><a>{row.title}</a></Link>,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => (
        <Box d="flex" mt="2" mb="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                h="13"
                w="13"
                mr="1"
                key={i}
                color={i < row.ratings ? "white" : "#5d5d5d"}
              />
            ))}
        </Box>
      ),
      sortable: true,
      sortFunction:customColumnSort
    },
    {
      name: "Created",
      selector: (row) => conv(row.createdAt),
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.verified ? <CheckIcon /> : <CloseIcon />),
      sortable: true,
    },
  ];
  const [d, setData] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  //[[x,y,x],[x,y,z]]
  useEffect(() => {
    let ideas = firebase.firestore().collection("ideas");
    if (query) {
      query.forEach((q) => {
        ideas = ideas.where(q[0], q[1], q[2]);
      });
    }
    const fg = ideas;
    fg.get()
      .then((val) => {
        const arr = [];
        val.forEach((f) => {
          arr.push({...f.data(),id:f.id});
        });
        setData(arr);
        setLoading(false);
      })
      .catch((e) => {
        setErr(e);
        setLoading(false);
      });
  }, []);
  return (
    <><Container maxW="100%" p="1" m="0">
      {loading && <Skeleton height="60px" />}
      {!loading && (
        <DataTable
          theme="solarized"
          responsive
          subHeaderWrap
          columns={columns}
          data={d}
        />
      )}
      </Container>
    </>
  );
}
