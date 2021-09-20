import Category from "../client/components/categories";
import Explore from "../client/components/explore";
import Trending from "../client/components/trending";
export default function Home() {
  return (
    <>
      <Trending />
      <Category />
      <Explore />
    </>
  );
}
