import {
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ExpandableText from "../components/ExpandableText";
import GameAttributes from "../components/GameAttributes";
import GameScreenshots from "../components/GameScreenshots";
import GameTrailer from "../components/GameTrailer";
import useGame from "../hooks/useGame";
import useTrailers from "../hooks/useTrailers";

const GameDetailPage = () => {
  const { slug } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { data: game, error, isLoading } = useGame(slug!);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = game!;
  const { data } = useTrailers(id?.id);

  if (isLoading || !game) return <Spinner />;

  if (error) throw error;

  const firstTrailer = data?.results[0];
  return (
    <SimpleGrid
      columns={{
        base: 2,
        md: 1,
      }}
      spacing={5}
    >
      <GridItem justifyContent="center" display="flex">
        <Image
          h="600px"
          src={game.background_image}
          alt="Dan Abramov"
          rounded="lg"
        />
      </GridItem>
      <GridItem>
        <Heading>{game.name}</Heading>
        <ExpandableText >{game.description_raw}</ExpandableText>
        <GameAttributes game={game} />
      </GridItem>
      <GridItem>
        <SimpleGrid
          columns={{
            base: 1,
            md: firstTrailer ? 2 : 1,
          }}
          spacing={5}
        >
          <GridItem>
            <GameTrailer gameId={game.id} />
          </GridItem>
          <GridItem>
            <GameScreenshots gameId={game.id} />
          </GridItem>
        </SimpleGrid>
      </GridItem>
    </SimpleGrid>
  );
};

export default GameDetailPage;
