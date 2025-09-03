// Generate initials from name for avatar display
export const getInitials = (name) => {
  if (!name || name === "Guest") return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

// Generate a consistent color for avatar background based on name
export const getAvatarColor = (name) => {
  if (!name) return "#48a6a7"
  
  const colors = [
    "#48a6a7", // teal
    "#2973b2", // blue
    "#9acbd0", // light blue
    "#ff6b6b", // red
    "#4ecdc4", // mint
    "#45b7d1", // sky blue
    "#96ceb4", // green
    "#feca57", // yellow
    "#ff9ff3", // pink
    "#54a0ff"  // blue
  ]
  
  // Simple hash function to get consistent color for same name
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
