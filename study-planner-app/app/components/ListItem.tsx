interface ListItemProps {
  time: string;
  title: string;
  completed?: boolean;
  onToggle?: () => void;
}

export default function ListItem({
  time,
  title,
  completed = false,
  onToggle,
}: ListItemProps) {
  return (
    <div className="flex items-center gap-3 border-l-4 border-primary pl-3 py-2">
      {/* Time */}
      <span className="text-sm text-text-secondary min-w-12">{time}</span>

      {/* Title */}
      <span className="flex-1 text-text-primary">{title}</span>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        disabled
        className={`h-5 w-5 rounded-sm border-2 transition-all ${
          completed
            ? "border-primary bg-primary"
            : "border-card-border bg-card-bg hover:border-primary"
        }`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed && (
          <svg
            className="h-full w-full text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
