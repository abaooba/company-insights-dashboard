import { TrendingDown } from "lucide-react";
import BulletList from "./BulletList";

interface WeaknessesListProps {
  items: string[];
}

const WeaknessesList = ({ items }: WeaknessesListProps) => (
  <BulletList title="Weaknesses" items={items} icon={TrendingDown} variant="weakness" />
);

export default WeaknessesList;
