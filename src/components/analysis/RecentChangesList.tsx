import { RefreshCw } from "lucide-react";
import BulletList from "./BulletList";

interface RecentChangesListProps {
  items: string[];
}

const RecentChangesList = ({ items }: RecentChangesListProps) => (
  <BulletList title="Recent Changes" items={items} icon={RefreshCw} variant="change" />
);

export default RecentChangesList;
