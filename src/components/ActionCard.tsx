import { ReactNode } from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  color: "primary" | "secondary" | "success" | "warning";
  className?: string;
  style?: React.CSSProperties;
}

const ActionCard = ({ title, description, icon, onClick, color, className = "", style }: ActionCardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/10 text-primary",
    secondary: "from-secondary/20 to-secondary/10 text-secondary",
    success: "from-success/20 to-success/10 text-success",
    warning: "from-warning/20 to-warning/10 text-warning",
  };

  return (
    <div 
      className={`action-card animate-slide-up ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;