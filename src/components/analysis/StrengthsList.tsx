import { TrendingUp } from "lucide-react";
import BulletList from "./BulletList";

interface StrengthsListProps {
  items: string[];
}

const StrengthsList = ({ items }: StrengthsListProps) => (
  <BulletList title="Strengths" items={items} icon={TrendingUp} variant="strength" />
);

export default StrengthsList;
