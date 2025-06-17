import {
  DotFilledIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { Card, Box, Inset, Strong, Text, Flex } from "@radix-ui/themes";
import { Favorite } from "./Favorite";

interface FavoriteProps {
  favorite: Favorite;
}

function FavoriteCard({ favorite }: FavoriteProps) {
  return (
    <Card size="2" className="!rounded-none !p-6">
      <Flex gap="3" align="center" justify="between">
        <Box>
          <Flex>
            <img
              className="!w-16 !h-16"
              src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
              alt="Bold typography"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius-2)",
              }}
            />
            <Box className="mx-5">
              <Text as="div" size="5" weight="bold">
                {favorite.title}
              </Text>
              <Flex align="center" className="mt-3 !space-x-2">
                <Text
                  as="div"
                  size="3"
                  className="font-medium !text-slate-500 "
                >
                  Rank: #{favorite.rank}
                </Text>
                {/* <div className="!m-0"> */}
                <DotFilledIcon color="gray" />
                {/* </div> */}
                <Text
                  as="div"
                  size="3"
                  className="font-medium !text-slate-500 capitalize"
                >
                  {favorite.genre}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Box>
          <HeartFilledIcon className="w-6 h-6 text-slate-400" />
        </Box>
      </Flex>
    </Card>
  );
}

export default FavoriteCard;
