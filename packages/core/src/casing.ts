type Casing = "snake" | "camel" | "pascal" | "screaming-snake"

export function casing(casing: Casing, value: string) {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map(word => word.toLowerCase());

  switch (casing) {
    case "snake":
      return words.join("_");
    case "camel":
      return words
        .map((word, index) =>
          index === 0
            ? word
            : word[0].toUpperCase() + word.slice(1)
        )
        .join("");
    case "pascal":
      return words
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join("");
    case "screaming-snake":
      return words.join("_").toUpperCase();
  }
}