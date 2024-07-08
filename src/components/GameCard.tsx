import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Text,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Game from "../entities/Game";
import getCroppedImageUrl from "../services/image-url";
import CriticScore from "./CriticScore";
import PlatformIconList from "./PlatformIconList";
import { useState } from "react";
import useTrailers from "../hooks/useTrailers";

interface Props {
  game: Game;
}
const esrb = { color: "red", text: "+18" };
const steps = [0, 1, 2, 3];
const GameCard = ({ game }: Props) => {
  const { data, error, isLoading } = useTrailers(game.id);
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) return null;

  if (error) throw error;

  const firstTrailer = data?.results[0];

  switch (game.esrb_rating?.slug) {
    case "teen":
      esrb.color = "green";
      esrb.text = "+13";
      break;
    case "everyone-10-plus":
      esrb.color = "green";
      esrb.text = "+10";
      break;
    case "mature":
      esrb.color = "yellow";
      esrb.text = "+17";
      break;
    default:
      esrb.color = "red";
      esrb.text = "+18";
      break;
  }
  return (
    <Link to={`/games/${game.slug}`}>
      <Card
        onMouseEnter={() => {
          if (firstTrailer) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => setIsHovered(false)}
        marginBottom="2"
      >
        <Image
          src={getCroppedImageUrl(game.background_image)}
          alt="Hover to play video"
          display={isHovered ? "none" : "block"}
          width="100%"
          height="100%"
          objectFit="cover"
          boxShadow="xl"
        />
        <video
          src={firstTrailer ? firstTrailer.data[480] : "null"}
          poster={firstTrailer ? firstTrailer.preview : "null"}
          autoPlay
          muted
          loop
          style={{
            marginBottom:'26px',
            display: isHovered ? "block" : "none",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <CardBody boxShadow="sm">
          <HStack justifyContent="space-between" marginBottom={3}>
            <Text marginY="1" fontSize="md">
              {new Date(game.released).getFullYear()}
            </Text>
            <Badge borderRadius="4px" marginY="1" colorScheme={esrb.color}>
              {esrb.text}
            </Badge>
          </HStack>
          <HStack justifyContent="space-between" marginBottom={3}>
            <PlatformIconList
              platforms={game.parent_platforms.map((p) => p.platform)}
            />
            <CriticScore score={game.metacritic} />
          </HStack>
          <Heading fontSize="lg">
            {game.name}
            <Divider />
            <Text fontSize="sm" marginTop="2">
              Comment: {game.reviews_count}
            </Text>
            {steps.map((step) => (
              <Badge borderRadius="4px" margin="1" colorScheme="purple">
                {game.tags[step]?.name}
              </Badge>
            ))}
          </Heading>
        </CardBody>
      </Card>
    </Link>
  );
};

export default GameCard;
