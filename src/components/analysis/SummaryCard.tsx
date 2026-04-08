import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  summary: string;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SummaryCard = ({ summary }: SummaryCardProps) => (
  <motion.div variants={item}>
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default SummaryCard;
