/**
 * Formatea una fecha relativa al tiempo actual
 */
export const formatTimeAgo = (dateString: string): string => {
  let date: Date;

  if (typeof dateString === "string") {
    const normalizedDate = dateString.replace(" ", "T");
    date = new Date(normalizedDate);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return "Reciente";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);

  const diffSecs = Math.floor(absDiffMs / 1000);
  const diffMins = Math.floor(absDiffMs / 60000);
  const diffHours = Math.floor(absDiffMs / 3600000);
  const diffDays = Math.floor(absDiffMs / 86400000);

  if (diffSecs < 60) {
    return `${diffSecs}s`;
  } else if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    return `${diffDays}d`;
  }
};
