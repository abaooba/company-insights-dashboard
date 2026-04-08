import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BulletVariant = "strength" | "weakness" | "change";

interface BulletListProps {
  title: string;
  items: string[];
  icon: React.ElementType;
  variant: BulletVariant;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const colorMap: Record<BulletVariant, { text: string; dot: string }> = {
  strength: { text: "text-score-excellent", dot: "bg-score-excellent" },
  weakness: { text: "text-score-bad", dot: "bg-score-bad" },
  change: { text: "text-accent", dot: "bg-accent" },
};

const BulletList = ({ title, items, icon: Icon, variant }: BulletListProps) => {
  const colors = colorMap[variant];

  return (
    <motion.div variants={item}>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Icon className={`h-4 w-4 ${colors.text}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((text, i) => (
              <li key={i} className="text-sm text-secondary-foreground flex gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${colors.dot}`} />
                {text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BulletList;
