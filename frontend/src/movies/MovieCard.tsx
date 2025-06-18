import { HeartIcon } from "@radix-ui/react-icons";
import { Card, Inset } from "@radix-ui/themes";
import {Movie} from "./Movie";

interface MovieProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieProps) {
  return (
    <Card size="2" className="!rounded-xs">
      <Inset clip="padding-box" side="top" pb="current">
        <img
          src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          alt="Bold typography"
        />
      </Inset>
      <div className="p-3 ">
        <div className="w-full mb-15">
          <div className="w-full flex flex-row justify-between items-center">
            <p className="font-medium text-xl">{movie.title}</p>
            <HeartIcon className="text-slate-500" width="20" height="20" />
          </div>
          <p className="capitalize text-slate-600 font-medium">{movie.genre}</p>
        </div>
        <div className="w-full flex flex-row justify-between items-center">
          <p className="uppercase text-xs text-slate-400">Rank: {movie.rank}</p>
          <p className="text-sm text-slate-600 font-medium">View Details</p>
        </div>
      </div>
    </Card>
  );
}

export default MovieCard;
