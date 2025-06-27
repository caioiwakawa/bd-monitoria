import FeedBox from "@/components/feed_box";
import FeedFlexBox from "@/components/feed_flexbox";
import Header from "@/components/header";
import SearchBar from "@/components/search_bar";

export default function Feed() {
  return (
    <main>
      <Header/>
      <SearchBar/>
      <FeedFlexBox>
        <FeedBox titulo="CIC 0099 -  Organização e Arquitetura de Computadores"></FeedBox>
        <FeedBox titulo="CIC 0099 -  Organização e Arquitetura de Computadores"></FeedBox>
        <FeedBox titulo="CIC 0099 -  Organização e Arquitetura de Computadores"></FeedBox>
        <FeedBox titulo="CIC 0099 -  Organização e Arquitetura de Computadores"></FeedBox>
      </FeedFlexBox>
    </main>
    );
}
