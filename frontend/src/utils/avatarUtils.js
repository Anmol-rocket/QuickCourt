// Generate initials from name for avatar display
export const getInitials = (name) => {
  if (!name || name === "Guest") return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

export const getAvatarColor = (name) => {
  if (!name) return "#48a6a7"
  
  const colors = [
    "#48a6a7",
    "#2973b2", 
    "#9acbd0", 
    "#ff6b6b", 
    "#4ecdc4",
    "#45b7d1", 
    "#96ceb4", 
    "#feca57", 
    "#ff9ff3", 
    "#54a0ff"  
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
