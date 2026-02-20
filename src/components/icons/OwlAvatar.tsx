import { UgglyOwl } from "./UgglyOwl";

interface OwlAvatarProps {
  size?: number;
  className?: string;
}

export function OwlAvatar({ size = 32, className = '' }: OwlAvatarProps) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <UgglyOwl size={size} variant="color" />
    </div>
  );
}
